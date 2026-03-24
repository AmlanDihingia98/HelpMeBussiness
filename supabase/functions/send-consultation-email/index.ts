import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateAnalysis } from "./lib/groq.ts";
import { sendEmail, buildEmailHtml, buildEmailText } from "./lib/email.ts";
import { buildPrompt } from "./lib/prompt.ts";
import type {
  ConsultationRecord,
  LeadRecord,
  TriggerPayload,
} from "./lib/types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const groqApiKey = Deno.env.get("GROQ_API_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const emailFrom =
    Deno.env.get("EMAIL_FROM") || "HelpMeBusiness <onboarding@resend.dev>";

  if (!groqApiKey || !resendApiKey) {
    console.error("[HMB] Missing GROQ_API_KEY or RESEND_API_KEY");
    return new Response(
      JSON.stringify({ error: "Missing API keys" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  let payload: TriggerPayload;

  try {
    payload = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON payload" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { consultation_id, lead_id } = payload;

  if (!consultation_id || !lead_id) {
    return new Response(
      JSON.stringify({ error: "Missing consultation_id or lead_id" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  console.log(`[HMB] Processing consultation: ${consultation_id}`);

  try {
    // Mark as processing
    await supabase
      .from("consultations")
      .update({ email_status: "processing" })
      .eq("id", consultation_id);

    // Fetch consultation data
    const { data: consultation, error: cErr } = await supabase
      .from("consultations")
      .select("*")
      .eq("id", consultation_id)
      .single();

    if (cErr || !consultation) {
      throw new Error(`Consultation not found: ${cErr?.message}`);
    }

    // Fetch lead data
    const { data: lead, error: lErr } = await supabase
      .from("leads")
      .select("*")
      .eq("id", lead_id)
      .single();

    if (lErr || !lead) {
      throw new Error(`Lead not found: ${lErr?.message}`);
    }

    const consultationData = consultation as ConsultationRecord;
    const leadData = lead as LeadRecord;

    // Build prompt and call Groq
    console.log(`[HMB] Calling Groq for ${leadData.full_name}`);
    const messages = buildPrompt(consultationData, leadData);
    const { analysis, rawResponse } = await generateAnalysis(
      messages,
      groqApiKey
    );

    console.log(`[HMB] Analysis generated (${analysis.length} chars)`);

    // Build and send email
    const html = buildEmailHtml(
      leadData.full_name,
      analysis,
      consultationData.business_type || ""
    );
    const text = buildEmailText(leadData.full_name, analysis);

    console.log(`[HMB] Sending email to ${leadData.email}`);
    const emailResult = await sendEmail({
      to: leadData.email,
      subject: `${leadData.full_name}, your Business Reality Check is ready`,
      html,
      text,
      from: emailFrom,
      apiKey: resendApiKey,
    });

    console.log(`[HMB] Email sent: ${emailResult.id}`);

    // Update DB with success
    await supabase
      .from("consultations")
      .update({
        email_status: "sent",
        email_sent_at: new Date().toISOString(),
        ai_analysis: analysis,
        ai_raw_response: rawResponse,
        email_error: null,
      })
      .eq("id", consultation_id);

    return new Response(
      JSON.stringify({ success: true, email_id: emailResult.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`[HMB] Error processing ${consultation_id}:`, errorMessage);

    // Fail-safe: update DB with error status
    await supabase
      .from("consultations")
      .update({
        email_status: "failed",
        email_error: errorMessage.substring(0, 500),
      })
      .eq("id", consultation_id);

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
