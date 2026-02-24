'use server';

import { supabase } from '@/utils/supabase';

interface IntakeData {
    capital: string;
    time: string;
    risk: string;
    location: string;
    skills: string;
}

export async function submitOrderAction(formData: FormData, intakeData: IntakeData) {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const serviceName = formData.get('serviceName') as string || 'Stage 1: Clarity - Idea Spark';
    const amount = Number(formData.get('amount')) || 999;

    // 1. Insert Lead (Step 1 personal details)
    const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([{ full_name: fullName, email, phone }])
        .select()
        .single();

    if (leadError) {
        console.error('Lead insert error:', leadError.message);
        return { success: false, error: `Failed to save your details: ${leadError.message}` };
    }

    // 2. Insert Order with all intake fields as explicit columns + JSONB snapshot
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
            lead_id: leadData.id,
            service_name: serviceName,
            amount: amount,
            payment_status: 'success',
            // Explicit columns for easy admin querying
            capital: intakeData.capital,
            time_commitment: intakeData.time,
            risk_appetite: intakeData.risk,
            location: intakeData.location,
            skills: intakeData.skills,
            // Full JSONB snapshot
            intake_responses: intakeData,
        }])
        .select()
        .single();

    if (orderError) {
        console.error('Order insert error:', orderError.message);
        return { success: false, error: `Failed to save your order: ${orderError.message}` };
    }

    return { success: true, orderId: orderData.id };
}
