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

    // Step 1 — Insert Lead
    const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([{ full_name: fullName, email, phone }])
        .select()
        .single();

    if (leadError) {
        console.error('[HMB] Lead insert failed:', JSON.stringify(leadError));
        return { success: false, error: leadError.message };
    }

    // Step 2 — Try inserting with explicit intake columns (requires ALTER TABLE to have been run).
    // If that fails due to missing columns, fall back to JSONB-only insert.
    const fullOrderPayload = {
        lead_id: leadData.id,
        service_name: serviceName,
        amount: amount,
        payment_status: 'success',
        capital: intakeData.capital,
        time_commitment: intakeData.time,
        risk_appetite: intakeData.risk,
        location: intakeData.location,
        skills: intakeData.skills,
        intake_responses: intakeData,
    };

    let { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([fullOrderPayload])
        .select()
        .single();

    // If new columns don't exist yet, fall back to minimal payload
    if (orderError) {
        console.warn('[HMB] Full order insert failed, trying minimal payload:', JSON.stringify(orderError));

        const minimalPayload = {
            lead_id: leadData.id,
            service_name: serviceName,
            amount: amount,
            payment_status: 'success',
            intake_responses: intakeData,
        };

        const fallback = await supabase
            .from('orders')
            .insert([minimalPayload])
            .select()
            .single();

        orderData = fallback.data;
        orderError = fallback.error;
    }

    if (orderError) {
        console.error('[HMB] Order insert failed (both attempts):', JSON.stringify(orderError));
        return { success: false, error: orderError.message };
    }

    return { success: true, orderId: orderData?.id };
}
