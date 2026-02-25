'use client';

import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, User, Mail, Phone, Building2, MapPin, Users, IndianRupee, Wallet, Target, Rocket } from 'lucide-react';
import { supabase } from '@/utils/supabase';

const steps = [
    { id: 1, title: 'Contact', description: 'Your personal details' },
    { id: 2, title: 'Business', description: 'Current scale & numbers' },
    { id: 3, title: 'Goals', description: 'Your vision' },
];

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

export function FreeConsultationForm({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ConsultationData>({
        fullName: '', email: '', phone: '',
        businessType: '', city: '',
        customers: '', revenue: '', expense: '', profit: '',
        shortTermGoal: '', longTermGoal: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep1 = () => {
        const e: Record<string, string> = {};
        if (!formData.fullName.trim()) e.fullName = 'Full name required';
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required';
        if (!formData.phone.trim()) e.phone = 'Phone number required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep2 = () => {
        const e: Record<string, string> = {};
        if (!formData.businessType.trim()) e.businessType = 'Required';
        if (!formData.city.trim()) e.city = 'Required';
        if (!formData.customers.trim()) e.customers = 'Required';
        if (!formData.revenue.trim()) e.revenue = 'Required';
        if (!formData.expense.trim()) e.expense = 'Required';
        if (!formData.profit.trim()) e.profit = 'Required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep3 = () => {
        const e: Record<string, string> = {};
        if (!formData.shortTermGoal.trim()) e.shortTermGoal = 'Required';
        if (!formData.longTermGoal.trim()) e.longTermGoal = 'Required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) { setErrors({}); setStep(2); }
        else if (step === 2 && validateStep2()) { setErrors({}); setStep(3); }
    };

    const handleBack = () => { setErrors({}); setStep(s => s - 1); };

    const handleSubmit = async () => {
        if (!validateStep3()) return;

        setIsLoading(true);
        setSubmitError(null);

        try {
            // Step 1 — Insert Lead (contact details)
            const { data: leadData, error: leadError } = await supabase
                .from('leads')
                .insert([{
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                }])
                .select()
                .single();

            if (leadError) throw new Error(`Lead save failed: ${leadError.message}`);

            // Step 2 — Insert into the dedicated consultations table
            const { error: consultationError } = await supabase
                .from('consultations')
                .insert([{
                    lead_id: leadData.id,
                    business_type: formData.businessType,
                    city: formData.city,
                    num_customers: formData.customers,
                    current_revenue: formData.revenue,
                    current_expense: formData.expense,
                    profit_after_tax: formData.profit,
                    short_term_goal: formData.shortTermGoal,
                    long_term_goal: formData.longTermGoal,
                }]);

            if (consultationError) throw new Error(`Consultation save failed: ${consultationError.message}`);

            setIsSuccess(true);
        } catch (err: any) {
            console.error('[HMB] Client-side submission failed:', err);
            setSubmitError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = (field: string) =>
        `w-full bg-white/5 border ${errors[field] ? 'border-red-500/70' : 'border-white/10'} rounded-2xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400/60 focus:bg-white/8 transition-all duration-200 text-sm`;

    const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5 ml-1 flex items-center gap-1.5";

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                <div className="w-full max-w-md bg-[#0d0d0d] rounded-3xl border border-white/8 shadow-2xl p-8 text-center relative">
                    <button onClick={onClose} className="absolute right-6 top-6 text-zinc-500 hover:text-white"><X size={20} /></button>
                    <div className="w-16 h-16 bg-purple-400/15 border border-purple-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-purple-400 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Request Received!</h2>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                        Thank you for sharing your business details. Our expert team will review your information and contact you shortly to schedule your free consultation.
                    </p>
                    <button onClick={onClose} className="w-full py-3.5 rounded-2xl bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-all">
                        Return to site
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#0d0d0d] rounded-3xl border border-white/8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Progress Bar */}
                <div className="h-0.5 bg-white/5 flex-shrink-0">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }} />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-6 pb-4 flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {steps.map((s, i) => (
                                <div key={s.id} className="flex items-center gap-1.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${step > s.id ? 'bg-purple-400 text-black' : step === s.id ? 'bg-white text-black' : 'bg-white/10 text-zinc-500'}`}>
                                        {step > s.id ? '✓' : s.id}
                                    </div>
                                    {i < steps.length - 1 && <div className={`w-6 h-px transition-all duration-300 ${step > s.id ? 'bg-purple-400' : 'bg-white/10'}`} />}
                                </div>
                            ))}
                        </div>
                        <h2 className="text-xl font-bold text-white">{steps[step - 1].title}</h2>
                        <p className="text-zinc-500 text-sm mt-0.5">{steps[step - 1].description}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/8 rounded-xl transition-colors text-zinc-500 hover:text-white flex-shrink-0 ml-4"><X size={18} /></button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 pb-4">
                    {/* Step 1: Contact */}
                    {step === 1 && (
                        <div className="space-y-4 max-w-md mx-auto py-2">
                            <div>
                                <label className={labelClass}><User size={12} className="text-purple-400" /> Full Name</label>
                                <input type="text" autoFocus className={inputClass('fullName')} value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" />
                                {errors.fullName && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.fullName}</p>}
                            </div>
                            <div>
                                <label className={labelClass}><Mail size={12} className="text-purple-400" /> Email Address</label>
                                <input type="email" className={inputClass('email')} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                                {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className={labelClass}><Phone size={12} className="text-purple-400" /> Phone Number</label>
                                <input type="tel" className={inputClass('phone')} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 99999 99999" />
                                {errors.phone && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.phone}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Business Metrics */}
                    {step === 2 && (
                        <div className="space-y-5 py-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}><Building2 size={12} className="text-purple-400" /> Type of Business</label>
                                    <input type="text" autoFocus className={inputClass('businessType')} value={formData.businessType} onChange={e => setFormData({ ...formData, businessType: e.target.value })} placeholder="e.g. Retail, SaaS, Agency" />
                                    {errors.businessType && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.businessType}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}><MapPin size={12} className="text-purple-400" /> City / Location</label>
                                    <input type="text" className={inputClass('city')} value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="e.g. Mumbai" />
                                    {errors.city && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.city}</p>}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}><Users size={12} className="text-purple-400" /> Average Number of Customers (per month)</label>
                                <input type="text" className={inputClass('customers')} value={formData.customers} onChange={e => setFormData({ ...formData, customers: e.target.value })} placeholder="e.g. 150 B2B clients, or 5000 D2C orders" />
                                {errors.customers && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.customers}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}><IndianRupee size={12} className="text-purple-400" /> Current Revenue</label>
                                    <input type="text" className={inputClass('revenue')} value={formData.revenue} onChange={e => setFormData({ ...formData, revenue: e.target.value })} placeholder="e.g. ₹5 Lakh/mo" />
                                    {errors.revenue && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.revenue}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}><Wallet size={12} className="text-purple-400" /> Current Expense</label>
                                    <input type="text" className={inputClass('expense')} value={formData.expense} onChange={e => setFormData({ ...formData, expense: e.target.value })} placeholder="e.g. ₹3 Lakh/mo" />
                                    {errors.expense && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.expense}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}><Target size={12} className="text-purple-400" /> Profit After Tax</label>
                                    <input type="text" className={inputClass('profit')} value={formData.profit} onChange={e => setFormData({ ...formData, profit: e.target.value })} placeholder="e.g. ₹1.5 Lakh/mo" />
                                    {errors.profit && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.profit}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Goals */}
                    {step === 3 && (
                        <div className="space-y-4 max-w-lg mx-auto py-2">
                            <div>
                                <label className={labelClass}><Rocket size={12} className="text-purple-400" /> Short Term Goal (Next 6-12 Months)</label>
                                <textarea rows={3} className={`${inputClass('shortTermGoal')} resize-none`} value={formData.shortTermGoal} onChange={e => setFormData({ ...formData, shortTermGoal: e.target.value })} placeholder="What is your immediate priority? (e.g. increase leads, reduce operations cost)" />
                                {errors.shortTermGoal && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.shortTermGoal}</p>}
                            </div>

                            <div>
                                <label className={labelClass}><Target size={12} className="text-purple-400" /> Long Term Goal (Next 3-5 Years)</label>
                                <textarea rows={3} className={`${inputClass('longTermGoal')} resize-none`} value={formData.longTermGoal} onChange={e => setFormData({ ...formData, longTermGoal: e.target.value })} placeholder="Where do you see the business ultimately going? (e.g. national expansion, exit strategy)" />
                                {errors.longTermGoal && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.longTermGoal}</p>}
                            </div>

                            <div className="bg-purple-400/5 border border-purple-400/20 rounded-2xl p-4 mt-4">
                                <p className="text-zinc-300 text-xs leading-relaxed text-center">
                                    Your data is securely stored and exclusively used by our experts to prepare for your consultation. We guarantee strict confidentiality.
                                </p>
                            </div>

                            {submitError && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 text-xs text-red-400 leading-relaxed mt-2">
                                    <strong className="text-red-300">⚠ Submission Error:</strong> {submitError}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/6 flex gap-3 flex-shrink-0 bg-[#0d0d0d]">
                    {step > 1 && (
                        <button onClick={handleBack} className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all text-sm font-medium">
                            <ArrowLeft size={15} /> Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-black text-sm font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-200">
                            Continue <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 text-white text-sm font-bold hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none">
                            {isLoading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                            ) : (
                                <>Submit & Request Consultation</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
