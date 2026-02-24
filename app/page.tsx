'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SparkQuiz } from '@/components/SparkQuiz';
import { ServicesSection } from '@/components/ServicesSection';

export default function Home() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background visual effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-purple/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-cyan/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="w-full px-6 py-4 lg:px-12 flex justify-between items-center z-10 glass-card mx-auto max-w-7xl mt-4 rounded-2xl sticky top-4">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            alt="HelpMeBusiness Logo"
            width={160}
            height={50}
            className="h-10 w-auto object-contain brightness-110"
            priority
          />
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
        </nav>
        <Button variant="primary" size="sm" onClick={() => setIsQuizOpen(true)}>Start Spark Quiz</Button>
      </header>

      <main className="flex-1 flex flex-col items-center pt-24 pb-32 px-6">

        {/* Hero Section */}
        <section className="w-full max-w-4xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
            You bring the money.<br />
            <span className="text-gradient">We bring the clarity.</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Before you invest ₹1 lakh, invest <strong className="text-white">₹999</strong> in clarity. Stop guessing and start building with precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" onClick={() => setIsQuizOpen(true)} className="group">
              Get Clarity Now — ₹999
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
            <Button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              variant="secondary"
              size="lg"
            >
              View All Services
            </Button>
          </div>
        </section>

        {/* Detailed Services Section */}
        <ServicesSection onQuizOpen={() => setIsQuizOpen(true)} />

      </main>

      {isQuizOpen && <SparkQuiz onClose={() => setIsQuizOpen(false)} />}
    </div>
  );
}
