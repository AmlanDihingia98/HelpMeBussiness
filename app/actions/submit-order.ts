'use server';

import { supabase } from '@/utils/supabase';

export async function submitOrderAction(formData: FormData, intakeData: any) {
    // 1. Extract values from formData
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const serviceName = formData.get('serviceName') as string || 'Stage 1: Clarity';
    const amount = Number(formData.get('amount')) || 999;

    // 2. Insert Lead
    const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([{ full_name: fullName, email, phone }])
        .select()
        .single();

    if (leadError) {
        console.error('Lead error:', leadError);
        return { success: false, error: 'Failed to create lead.' };
    }

    // 3. Insert Order
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
            lead_id: leadData.id,
            service_name: serviceName,
            amount: amount,
            payment_status: 'success', // Assuming mock payment success
            intake_responses: intakeData
        }])
        .select()
        .single();

    if (orderError) {
        console.error('Order error:', orderError);
        return { success: false, error: 'Failed to create order.' };
    }

    return { success: true, orderId: orderData.id };
}
