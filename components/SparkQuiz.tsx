'use client';

import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, User, Mail, Phone, MapPin, Zap, TrendingUp, Clock, Shield } from 'lucide-react';
import { submitOrderAction } from '@/app/actions/submit-order';
import { useRouter } from 'next/navigation';

const steps = [
    { id: 1, title: 'Your Details', description: 'Tell us about yourself' },
    { id: 2, title: 'Your Vision', description: 'Help us understand your goals' },
    { id: 3, title: 'Confirm & Pay', description: 'Review and complete booking' },
];

export function SparkQuiz({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [personal, setPersonal] = useState({ fullName: '', email: '', phone: '' });
    const [intake, setIntake] = useState({ capital: '', time: '', risk: '', location: '', skills: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep1 = () => {
        const e: Record<string, string> = {};
        if (!personal.fullName.trim()) e.fullName = 'Full name is required';
        if (!personal.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) e.email = 'Enter a valid email';
        if (!personal.phone.trim()) e.phone = 'Phone number is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep2 = () => {
        const e: Record<string, string> = {};
        if (!intake.capital) e.capital = 'Please select an option';
        if (!intake.time) e.time = 'Please select an option';
        if (!intake.risk) e.risk = 'Please select an option';
        if (!intake.location.trim()) e.location = 'Location is required';
        if (!intake.skills.trim()) e.skills = 'Please mention your skills';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) { setErrors({}); setStep(2); }
        else if (step === 2 && validateStep2()) { setErrors({}); setStep(3); }
    };

    const handleBack = () => { setErrors({}); setStep(s => s - 1); };

    const handlePayment = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        const formData = new FormData();
        formData.append('fullName', personal.fullName);
        formData.append('email', personal.email);
        formData.append('phone', personal.phone);
        formData.append('serviceName', 'Stage 1: Clarity - Idea Spark');
        formData.append('amount', '999');
        const result = await submitOrderAction(formData, intake);
        if (result.success) { router.push('/success'); }
        else { alert('Something went wrong. Please try again.'); setIsLoading(false); }
    };

    const inputClass = (field: string) =>
        `w-full bg-white/5 border ${errors[field] ? 'border-red-500/70' : 'border-white/10'} rounded-2xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400/60 focus:bg-white/8 transition-all duration-200 text-sm`;

    const selectClass = (field: string) =>
        `w-full bg-white/5 border ${errors[field] ? 'border-red-500/70' : 'border-white/10'} rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-cyan-400/60 focus:bg-white/8 transition-all duration-200 text-sm appearance-none cursor-pointer`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0d0d0d] rounded-3xl border border-white/8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* Progress Bar */}
                <div className="h-0.5 bg-white/5 flex-shrink-0">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-6 pb-4 flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {steps.map((s, i) => (
                                <div key={s.id} className="flex items-center gap-1.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${step > s.id ? 'bg-cyan-400 text-black' : step === s.id ? 'bg-white text-black' : 'bg-white/10 text-zinc-500'}`}>
                                        {step > s.id ? '✓' : s.id}
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`w-6 h-px transition-all duration-300 ${step > s.id ? 'bg-cyan-400' : 'bg-white/10'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <h2 className="text-lg font-bold text-white">{steps[step - 1].title}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{steps[step - 1].description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/8 rounded-xl transition-colors text-zinc-500 hover:text-white flex-shrink-0 ml-4"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body — scrollable */}
                <div className="flex-1 overflow-y-auto px-6 pb-4">

                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Full Name</label>
                                <div className="relative">
                                    <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                    <input
                                        type="text"
                                        autoFocus
                                        className={`${inputClass('fullName')} pl-10`}
                                        value={personal.fullName}
                                        onChange={e => setPersonal({ ...personal, fullName: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.fullName && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.fullName}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                    <input
                                        type="email"
                                        className={`${inputClass('email')} pl-10`}
                                        value={personal.email}
                                        onChange={e => setPersonal({ ...personal, email: e.target.value })}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                    <input
                                        type="tel"
                                        className={`${inputClass('phone')} pl-10`}
                                        value={personal.phone}
                                        onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                                        placeholder="+91 99999 99999"
                                    />
                                </div>
                                {errors.phone && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.phone}</p>}
                            </div>

                            <div className="bg-white/3 border border-white/6 rounded-2xl p-4 mt-2">
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    <span className="text-cyan-400 font-medium">🔒 100% Private.</span> Your details are only used to personalise your clarity call. We never share your data.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1 flex items-center gap-1.5">
                                    <TrendingUp size={12} className="text-cyan-400" /> Available Capital to Invest
                                </label>
                                <div className="relative">
                                    <select
                                        className={selectClass('capital')}
                                        value={intake.capital}
                                        onChange={e => setIntake({ ...intake, capital: e.target.value })}
                                    >
                                        <option value="" disabled>Select your range</option>
                                        <option value="Under ₹1 Lakh">Under ₹1 Lakh</option>
                                        <option value="₹1 Lakh - ₹5 Lakhs">₹1 Lakh – ₹5 Lakhs</option>
                                        <option value="₹5 Lakhs - ₹20 Lakhs">₹5 Lakhs – ₹20 Lakhs</option>
                                        <option value="₹20 Lakhs+">₹20 Lakhs+</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">▾</div>
                                </div>
                                {errors.capital && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.capital}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1 flex items-center gap-1.5">
                                    <Clock size={12} className="text-cyan-400" /> Weekly Time Commitment
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {['Part-time (10-20 hrs)', 'Full-time (40+ hrs)'].map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setIntake({ ...intake, time: opt })}
                                            className={`p-3 rounded-2xl border text-xs font-medium text-left transition-all duration-200 ${intake.time === opt ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-400' : 'border-white/10 bg-white/3 text-zinc-400 hover:border-white/20'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                {errors.time && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.time}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1 flex items-center gap-1.5">
                                    <Shield size={12} className="text-cyan-400" /> Risk Appetite
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {[
                                        { val: 'Low', desc: 'Safe & steady' },
                                        { val: 'Medium', desc: 'Balanced' },
                                        { val: 'High', desc: 'Aggressive' },
                                    ].map(opt => (
                                        <button
                                            key={opt.val}
                                            type="button"
                                            onClick={() => setIntake({ ...intake, risk: opt.val })}
                                            className={`p-3 rounded-2xl border text-center transition-all duration-200 ${intake.risk === opt.val ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-400' : 'border-white/10 bg-white/3 text-zinc-400 hover:border-white/20'}`}
                                        >
                                            <div className="text-sm font-semibold">{opt.val}</div>
                                            <div className="text-[10px] mt-0.5 opacity-70">{opt.desc}</div>
                                        </button>
                                    ))}
                                </div>
                                {errors.risk && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.risk}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1 flex items-center gap-1.5">
                                        <MapPin size={12} className="text-cyan-400" /> Location
                                    </label>
                                    <input
                                        type="text"
                                        className={inputClass('location')}
                                        value={intake.location}
                                        onChange={e => setIntake({ ...intake, location: e.target.value })}
                                        placeholder="City, State"
                                    />
                                    {errors.location && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.location}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1 flex items-center gap-1.5">
                                        <Zap size={12} className="text-cyan-400" /> Key Skills
                                    </label>
                                    <input
                                        type="text"
                                        className={inputClass('skills')}
                                        value={intake.skills}
                                        onChange={e => setIntake({ ...intake, skills: e.target.value })}
                                        placeholder="e.g. Sales, Tech"
                                    />
                                    {errors.skills && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.skills}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review + Pay */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <div className="text-center py-4">
                                <div className="w-14 h-14 bg-cyan-400/15 border border-cyan-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="text-cyan-400 w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold">You are almost there!</h3>
                                <p className="text-zinc-400 text-sm mt-1.5 max-w-xs mx-auto leading-relaxed">
                                    Complete the ₹999 payment to book your 30-minute expert clarity call.
                                </p>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-white/4 border border-white/8 rounded-2xl divide-y divide-white/6 text-sm overflow-hidden">
                                <div className="flex justify-between px-4 py-3">
                                    <span className="text-zinc-400">Name</span>
                                    <span className="text-white font-medium">{personal.fullName}</span>
                                </div>
                                <div className="flex justify-between px-4 py-3">
                                    <span className="text-zinc-400">Capital</span>
                                    <span className="text-white font-medium">{intake.capital}</span>
                                </div>
                                <div className="flex justify-between px-4 py-3">
                                    <span className="text-zinc-400">Location</span>
                                    <span className="text-white font-medium">{intake.location}</span>
                                </div>
                                <div className="flex justify-between px-4 py-3">
                                    <span className="text-zinc-400">Risk</span>
                                    <span className="text-white font-medium">{intake.risk}</span>
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border border-cyan-400/20 rounded-2xl px-4 py-4 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-semibold text-white">Stage 1: Clarity Call</div>
                                    <div className="text-xs text-zinc-400 mt-0.5">30-min 1:1 Expert Session</div>
                                </div>
                                <div className="text-2xl font-extrabold text-cyan-400">₹999</div>
                            </div>

                            <p className="text-center text-zinc-600 text-[11px]">
                                🔒 Secure payment · 100% satisfaction or we redo your call
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/6 flex gap-3 flex-shrink-0 bg-[#0d0d0d]">
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
                        >
                            <ArrowLeft size={15} /> Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-black text-sm font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-200"
                        >
                            Continue <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-sm font-bold hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Processing…
                                </>
                            ) : (
                                <>Pay ₹999 &amp; Book Call</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
