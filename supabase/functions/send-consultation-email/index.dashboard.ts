// ============================================================
// HelpMeBusiness — Automated Consultation Email Edge Function
// Consolidated single-file version for Supabase Dashboard deployment
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Types ────────────────────────────────────────────────────

interface ConsultationRecord {
  id: string;
  lead_id: string;
  business_type: string | null;
  city: string | null;
  num_customers: string | null;
  current_revenue: string | null;
  current_expense: string | null;
  profit_after_tax: string | null;
  short_term_goal: string | null;
  long_term_goal: string | null;
  email_status: string;
}

interface LeadRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface TriggerPayload {
  consultation_id: string;
  lead_id: string;
}

// ── Prompt Builder ───────────────────────────────────────────

const SYSTEM_PROMPT = `You are a senior business advisor at HelpMeBusiness. You analyze real business data and provide brutally honest, actionable insights.

Your response MUST follow this exact format with three sections:

**📊 Reality Check**
Analyze the actual numbers: revenue, expenses, profit, customer count. Point out any red flags or strengths. Be specific with calculations.

**📈 Industry Comparison**
Compare their metrics against typical businesses in their industry and city. Are they above or below average? Cite realistic benchmarks.

**⚡ Shortfall or Better Than Reality**
Final verdict: Are their goals realistic given the numbers? What's the gap between where they are and where they want to be? Give one concrete next step.

Rules:
- Keep the total response under 120 words.
- Use plain, direct language. No fluff.
- Reference their actual numbers.
- Be encouraging but honest.`;

function buildPrompt(consultation: ConsultationRecord, lead: LeadRecord): GroqMessage[] {
  const userMessage = `Analyze this business for ${lead.full_name}:

Business Type: ${consultation.business_type || "Not specified"}
City: ${consultation.city || "Not specified"}
Monthly Customers: ${consultation.num_customers || "Not specified"}
Current Revenue: ${consultation.current_revenue || "Not specified"}
Current Expenses: ${consultation.current_expense || "Not specified"}
Profit After Tax: ${consultation.profit_after_tax || "Not specified"}
Short-Term Goal: ${consultation.short_term_goal || "Not specified"}
Long-Term Goal: ${consultation.long_term_goal || "Not specified"}

Provide your Reality Check, Industry Comparison, and Shortfall/Better verdict.`;

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ];
}

// ── Groq API Client ─────────────────────────────────────────

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

async function generateAnalysis(messages: GroqMessage[], apiKey: string) {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  if (!data.choices || data.choices.length === 0) {
    throw new Error("Groq returned no choices");
  }

  return { analysis: data.choices[0].message.content, rawResponse: data };
}

// ── Resend Email Client ─────────────────────────────────────

async function sendEmail(params: {
  to: string; subject: string; html: string; text: string; from: string; apiKey: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({
      from: params.from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText.substring(0, 200)}`);
  }
  return response.json();
}

function buildEmailHtml(fullName: string, analysis: string, businessType: string): string {
  const analysisHtml = analysis
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border-radius:16px;border:1px solid rgba(255,255,255,0.08);">
        <tr><td style="padding:32px 32px 16px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:#fff;">HelpMe<span style="color:#22d3ee;">Business</span></div>
          <div style="font-size:12px;color:#71717a;letter-spacing:1px;text-transform:uppercase;">Business Reality Check</div>
        </td></tr>
        <tr><td style="padding:16px 32px 8px;">
          <div style="font-size:16px;color:#e4e4e7;">Hi <strong style="color:#fff;">${fullName}</strong>,</div>
          <div style="font-size:14px;color:#a1a1aa;margin-top:8px;">Thanks for sharing your ${businessType || "business"} details. Here's your personalized analysis:</div>
        </td></tr>
        <tr><td style="padding:16px 32px;">
          <div style="background:linear-gradient(135deg,rgba(34,211,238,0.05),rgba(139,92,246,0.05));border:1px solid rgba(34,211,238,0.15);border-radius:12px;padding:24px;">
            <div style="font-size:14px;color:#e4e4e7;line-height:1.8;">${analysisHtml}</div>
          </div>
        </td></tr>
        <tr><td style="padding:16px 32px;text-align:center;">
          <div style="font-size:13px;color:#71717a;margin-bottom:16px;">Want a deeper dive with a human expert?</div>
          <a href="https://helpmebusiness.com" style="display:inline-block;background:linear-gradient(135deg,#22d3ee,#3b82f6);color:#000;font-weight:700;font-size:14px;padding:12px 32px;border-radius:12px;text-decoration:none;">Book a Clarity Call →</a>
        </td></tr>
        <tr><td style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <div style="font-size:11px;color:#52525b;">AI-generated analysis for informational purposes only.<br>© ${new Date().getFullYear()} HelpMeBusiness</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildEmailText(fullName: string, analysis: string): string {
  return `Hi ${fullName},\n\nHere's your Business Reality Check from HelpMeBusiness:\n\n${analysis}\n\n---\nBook a Clarity Call at https://helpmebusiness.com\n© ${new Date().getFullYear()} HelpMeBusiness`;
}

// ── Main Handler ─────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const groqApiKey = Deno.env.get("GROQ_API_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const emailFrom = Deno.env.get("EMAIL_FROM") || "HelpMeBusiness <onboarding@resend.dev>";

  if (!groqApiKey || !resendApiKey) {
    console.error("[HMB] Missing GROQ_API_KEY or RESEND_API_KEY");
    return new Response(JSON.stringify({ error: "Missing API keys" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  let payload: TriggerPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { consultation_id, lead_id } = payload;
  if (!consultation_id || !lead_id) {
    return new Response(JSON.stringify({ error: "Missing IDs" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  console.log(`[HMB] Processing consultation: ${consultation_id}`);

  try {
    await supabase.from("consultations").update({ email_status: "processing" }).eq("id", consultation_id);

    const { data: consultation, error: cErr } = await supabase
      .from("consultations").select("*").eq("id", consultation_id).single();
    if (cErr || !consultation) throw new Error(`Consultation not found: ${cErr?.message}`);

    const { data: lead, error: lErr } = await supabase
      .from("leads").select("*").eq("id", lead_id).single();
    if (lErr || !lead) throw new Error(`Lead not found: ${lErr?.message}`);

    console.log(`[HMB] Calling Groq for ${lead.full_name}`);
    const messages = buildPrompt(consultation as ConsultationRecord, lead as LeadRecord);
    const { analysis, rawResponse } = await generateAnalysis(messages, groqApiKey);
    console.log(`[HMB] Analysis generated (${analysis.length} chars)`);

    const html = buildEmailHtml(lead.full_name, analysis, consultation.business_type || "");
    const text = buildEmailText(lead.full_name, analysis);

    console.log(`[HMB] Sending email to ${lead.email}`);
    const emailResult = await sendEmail({
      to: lead.email,
      subject: `${lead.full_name}, your Business Reality Check is ready`,
      html, text, from: emailFrom, apiKey: resendApiKey,
    });
    console.log(`[HMB] Email sent: ${emailResult.id}`);

    await supabase.from("consultations").update({
      email_status: "sent",
      email_sent_at: new Date().toISOString(),
      ai_analysis: analysis,
      ai_raw_response: rawResponse,
      email_error: null,
    }).eq("id", consultation_id);

    return new Response(JSON.stringify({ success: true, email_id: emailResult.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[HMB] Error: ${msg}`);

    await supabase.from("consultations").update({
      email_status: "failed",
      email_error: msg.substring(0, 500),
    }).eq("id", consultation_id);

    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
