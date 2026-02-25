'use server';

import { supabase } from '@/utils/supabase';

export interface ConsultationData {
    fullName: string;
    email: string;
    phone: string;
    businessType: string;
    city: string;
    customers: string;
    revenue: string;
    expense: string;
    profit: string;
    shortTermGoal: string;
    longTermGoal: string;
}

export async function submitConsultationAction(data: ConsultationData) {
    // Step 1 — Insert Lead (contact details)
    const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([{
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
        }])
        .select()
        .single();

    if (leadError) {
        const msg = `Lead save failed: ${leadError.message} (code: ${leadError.code})`;
        console.error('[HMB] Lead insert failed (Consultation):', JSON.stringify(leadError));
        return { success: false, error: msg };
    }

    // Step 2 — Insert into the dedicated `consultations` table
    const { data: consultationData, error: consultationError } = await supabase
        .from('consultations')
        .insert([{
            lead_id: leadData.id,
            business_type: data.businessType,
            city: data.city,
            num_customers: data.customers,
            current_revenue: data.revenue,
            current_expense: data.expense,
            profit_after_tax: data.profit,
            short_term_goal: data.shortTermGoal,
            long_term_goal: data.longTermGoal,
        }])
        .select()
        .single();

    if (consultationError) {
        const msg = `Consultation save failed: ${consultationError.message} (code: ${consultationError.code})`;
        console.error('[HMB] Consultation insert failed:', JSON.stringify(consultationError));
        return { success: false, error: msg };
    }

    return { success: true, consultationId: consultationData?.id };
}
