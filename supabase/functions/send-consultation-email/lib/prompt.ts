import type { ConsultationRecord, LeadRecord, GroqMessage } from "./types.ts";

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

export function buildPrompt(
  consultation: ConsultationRecord,
  lead: LeadRecord
): GroqMessage[] {
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
