export interface ConsultationRecord {
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
  created_at: string;
}

export interface LeadRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface TriggerPayload {
  consultation_id: string;
  lead_id: string;
}
