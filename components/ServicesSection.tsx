'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

const clarityServices = [
    {
        id: 1,
        number: '01',
        name: 'Idea Spark',
        subtitle: 'Business Matchmaking Session',
        price: '₹999',
        bestFor: 'Anyone saying they want to start something but do not know what.',
        tagline: 'This is not advice. This is direction.',
        whatWeDo: [
            'Understand your capital, time, risk appetite, location, and skills',
            'Analyse your lifestyle & accessibility',
            'Curate 3 business ideas tailored specifically for you',
            'Explain why each idea fits (or does not)',
        ],
        whatYouGet: [
            '30-minute 1:1 call',
            'A custom PDF with 10 shortlisted ideas',
            'Investment range + effort level for each',
        ],
        color: 'cyan',
        cta: 'Take the Spark Quiz',
        isQuizTrigger: true,
    },
    {
        id: 2,
        number: '02',
        name: 'Capital to Concept',
        subtitle: 'Investment Direction Call',
        price: '₹999',
        bestFor: 'People with savings who want to invest smartly.',
        tagline: 'Confidence before you invest.',
        whatWeDo: [
            'Understand how much capital you want to deploy',
            'Identify business vs investment options',
            'Suggest 3 practical paths (active + semi-passive)',
            'Help you avoid common beginner mistakes',
        ],
        whatYouGet: [
            'Clear breakdown of where your money makes sense',
            'A short-term vs long-term view',
            'Confidence before you invest',
        ],
        color: 'cyan',
        cta: 'Book This Call',
        isQuizTrigger: true,
    },
    {
        id: 3,
        number: '03',
        name: 'Location-Based Opportunity Mapping',
        subtitle: '',
        price: '₹999',
        bestFor: 'People who want a business that works where they live.',
        tagline: 'We give the right ideas for you, not random ones.',
        whatWeDo: [
            'Study your city / locality / access',
            'Identify demand-driven opportunities nearby',
            'Curate 3 hyper-relevant business ideas based on geography',
        ],
        whatYouGet: [
            'A location-aware idea shortlist',
            'Local execution logic (offline + online)',
            'A realistic starting plan',
        ],
        color: 'cyan',
        cta: 'Map My Opportunity',
        isQuizTrigger: true,
    },
];

const buildServices = [
    {
        id: 4,
        number: '04',
        name: 'Revenue Model Design',
        subtitle: '',
        price: '₹6,999',
        bestFor: 'People who picked an idea but need to know how money will flow.',
        tagline: 'Turns an idea into a business model.',
        whatWeDo: [],
        whatYouGet: [
            'Pricing strategy',
            'Revenue streams',
            'Cost structure & break-even logic',
            '90-day revenue roadmap',
        ],
        color: 'blue',
        cta: 'Get My Revenue Model',
        isQuizTrigger: false,
    },
    {
        id: 5,
        number: '05',
        name: 'Website / Landing Page Development',
        subtitle: '',
        price: '₹9,999',
        bestFor: 'Service or digital-first businesses.',
        tagline: 'Simple. Professional. Revenue-ready.',
        whatWeDo: [],
        whatYouGet: [
            'Conversion-focused landing page',
            'Clear positioning & messaging',
            'Lead capture (forms / WhatsApp)',
            'Mobile-first design',
        ],
        color: 'blue',
        cta: 'Build My Website',
        isQuizTrigger: false,
    },
    {
        id: 6,
        number: '06',
        name: 'Marketing & Lead Generation Setup',
        subtitle: '',
        price: '₹12,999',
        bestFor: 'People who want customers, not theory.',
        tagline: 'We do not promise virality. We promise leads.',
        whatWeDo: [],
        whatYouGet: [
            'Meta or Google Ads setup',
            'Ad copy + creatives',
            'Audience targeting',
            'Budget strategy',
        ],
        color: 'blue',
        cta: 'Start Generating Leads',
        isQuizTrigger: false,
    },
    {
        id: 7,
        number: '07',
        name: 'WhatsApp Chatbot & Automation',
        subtitle: 'Customer Support & Lead Qualification',
        price: '₹4,999',
        bestFor: 'Businesses that want scale & professionalism.',
        tagline: 'Looks small from outside. Works big from inside.',
        whatWeDo: [],
        whatYouGet: [
            'Auto-replies & service menus',
            'Lead qualification',
            'Follow-up automation',
            'Professional business presence',
        ],
        color: 'blue',
        cta: 'Automate My WhatsApp',
        isQuizTrigger: false,
    },
];

const highTicketServices = [
    {
        id: 8,
        number: '08',
        name: 'Business Launch Partner',
        subtitle: '30-Day Done-With-You Program',
        price: '₹24,999',
        bestFor: 'First-time founders ready to execute.',
        tagline: 'From idea to launch in 30 days.',
        whatWeDo: [],
        whatYouGet: [
            'Idea finalisation',
            'Revenue model',
            'Website / funnel',
            'Marketing plan',
            'Weekly strategy calls',
            'Launch checklist',
        ],
        color: 'white',
        cta: 'Apply Now',
        isQuizTrigger: false,
    },
    {
        id: 9,
        number: '09',
        name: 'Business Build & Scale',
        subtitle: '60-Day Intensive Growth Program',
        price: '₹34,999',
        bestFor: 'People investing serious capital who want complete execution.',
        tagline: 'Where businesses stop being ideas and start becoming assets.',
        whatWeDo: [],
        whatYouGet: [
            'Deep business strategy',
            'Brand positioning',
            'Lead generation system',
            'Automation & tracking',
            'Ongoing optimisation',
            'Priority support',
        ],
        color: 'white',
        cta: 'Apply Now',
        isQuizTrigger: false,
    },
];

const colorMap: Record<string, { accent: string; badge: string; check: string; liquidClass: string }> = {
    cyan: {
        accent: 'text-cyan-400',
        badge: 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20',
        check: 'text-cyan-400',
        liquidClass: 'liquid-card liquid-card-cyan',
    },
    blue: {
        accent: 'text-blue-400',
        badge: 'bg-blue-400/10 text-blue-400 border border-blue-400/20',
        check: 'text-blue-400',
        liquidClass: 'liquid-card liquid-card-blue',
    },
    white: {
        accent: 'text-amber-400',
        badge: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
        check: 'text-amber-400',
        liquidClass: 'liquid-card liquid-card-white',
    },
};

type ServiceData = {
    id: number;
    number: string;
    name: string;
    subtitle: string;
    price: string;
    bestFor: string;
    tagline: string;
    whatWeDo: string[];
    whatYouGet: string[];
    color: string;
    cta: string;
    isQuizTrigger: boolean;
};

function ServiceCard({ service, onQuizOpen }: { service: ServiceData; onQuizOpen: () => void }) {
    const c = colorMap[service.color];
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={`${c.liquidClass} rounded-3xl p-7 relative overflow-hidden group transition-all duration-300 flex flex-col hover:scale-[1.01] hover:shadow-2xl`}
            style={{ transform: 'translateZ(0)' }}
        >
            {/* Liquid glass overlay is handled via ::before CSS pseudo-element */}

            <div className="relative z-10 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <span className={`text-xs font-mono font-bold tracking-widest ${c.accent} opacity-50`}>{service.number}</span>
                        <h3 className="text-xl font-bold mt-1 leading-tight">{service.name}</h3>
                        {service.subtitle && <p className="text-zinc-500 text-xs mt-0.5">{service.subtitle}</p>}
                    </div>
                    <span className={`text-2xl font-extrabold ${c.accent} shrink-0 ml-4`}>{service.price}</span>
                </div>

                {/* Best For */}
                <div className={`inline-flex items-start gap-2 px-3 py-1.5 rounded-lg border text-xs mb-5 ${c.badge}`}>
                    <span className="font-semibold shrink-0">Best for:</span> {service.bestFor}
                </div>

                {/* What We Do */}
                {service.whatWeDo.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">What We Do</p>
                        <ul className="space-y-2">
                            {service.whatWeDo.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                    <span className={`shrink-0 mt-0.5 ${c.check}`}>✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* What You Get - collapsible when there are also "whatWeDo" items */}
                <div className="mt-auto">
                    {service.whatWeDo.length > 0 ? (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1 text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2 hover:text-white transition-colors"
                        >
                            What You Get
                            <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>&#9662;</span>
                        </button>
                    ) : (
                        <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">What You Get</p>
                    )}
                    {(expanded || service.whatWeDo.length === 0) && (
                        <ul className="space-y-2 mb-5">
                            {service.whatYouGet.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                    <span className={`shrink-0 mt-0.5 ${c.check}`}>&#8594;</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Tagline */}
                <p className="text-xs italic text-zinc-500 mb-5 border-l-2 border-zinc-700 pl-3">{service.tagline}</p>

                {/* CTA */}
                <Button
                    className="w-full"
                    variant={service.isQuizTrigger ? 'primary' : 'secondary'}
                    onClick={service.isQuizTrigger ? onQuizOpen : undefined}
                >
                    {service.cta}
                </Button>
            </div>
        </div>
    );
}

export function ServicesSection({ onQuizOpen }: { onQuizOpen: () => void }) {
    return (
        <section id="services" className="w-full max-w-7xl space-y-16 md:space-y-24">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Services We Offer</h2>
                <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto">From idea to income — every step of the journey.</p>
            </div>

            {/* Stage 1: Clarity */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-1">Stage 1</div>
                        <h3 className="text-2xl md:text-3xl font-bold">Clarity Services</h3>
                        <p className="text-zinc-400 text-sm mt-1">Low commitment. High value. Zero pressure.</p>
                    </div>
                    <div className="flex-1 h-px bg-zinc-800 ml-6 hidden md:block" />
                    <span className="text-cyan-400 font-bold text-lg hidden md:block shrink-0">₹999 each</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {clarityServices.map((s) => (
                        <ServiceCard key={s.id} service={s} onQuizOpen={onQuizOpen} />
                    ))}
                </div>
            </div>

            {/* Stage 2: Build & Launch */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-1">Stage 2</div>
                        <h3 className="text-2xl md:text-3xl font-bold">Build &amp; Launch Services</h3>
                        <p className="text-zinc-400 text-sm mt-1">Once clarity is achieved, we help you build.</p>
                    </div>
                    <div className="flex-1 h-px bg-zinc-800 ml-6 hidden md:block" />
                    <span className="text-blue-400 font-bold text-lg hidden md:block shrink-0">₹4,999 – ₹12,999</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {buildServices.map((s) => (
                        <ServiceCard key={s.id} service={s} onQuizOpen={onQuizOpen} />
                    ))}
                </div>
            </div>

            {/* Stage 3: High Ticket */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="text-xs uppercase tracking-widest text-white font-bold mb-1">Stage 3</div>
                        <h3 className="text-2xl md:text-3xl font-bold">Consulting &amp; Done-With-You Packages</h3>
                        <p className="text-zinc-400 text-sm mt-1">For people serious about execution.</p>
                    </div>
                    <div className="flex-1 h-px bg-zinc-800 ml-6 hidden md:block" />
                    <span className="text-white font-bold text-lg hidden md:block shrink-0">₹24,999 – ₹34,999</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {highTicketServices.map((s) => (
                        <ServiceCard key={s.id} service={s} onQuizOpen={onQuizOpen} />
                    ))}
                </div>
            </div>
        </section>
    );
}
