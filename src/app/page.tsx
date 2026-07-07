'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const generateEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/email/new', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate');
      const data = await res.json();
      router.push(`/dashboard/${data.address}`);
    } catch (error) {
      console.error(error);
      alert('Failed to generate email');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="p-6 flex items-center justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-xl">
            <Mail className="text-primary-light" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">Temphook</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-foreground/70">
          <a href="#features" className="hover:text-primary-light transition-colors">Features</a>
          <a href="#api" className="hover:text-primary-light transition-colors">API</a>
          <a href="#faq" className="hover:text-primary-light transition-colors">FAQ</a>
        </nav>
        <button 
          onClick={generateEmail}
          disabled={loading}
          className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-lg font-medium transition-all neon-glow flex items-center gap-2"
        >
          {loading ? 'Generating...' : 'Get Started'}
          {!loading && <ArrowRight size={18} />}
        </button>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center p-6 mt-20 md:mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/30 text-primary-light text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-light"></span>
            </span>
            Next-Gen Temporary Email
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Protect your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-blue-400">Privacy</span> with Temphook
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 mb-10 max-w-2xl mx-auto">
            Secure, fast, and beautiful disposable email platform. Instantly generate a temporary mailbox to keep your real inbox clean and safe from spam.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={generateEmail}
              disabled={loading}
              className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all neon-glow flex items-center justify-center gap-3 disabled:opacity-70"
            >
              <Mail size={22} />
              {loading ? 'Creating Inbox...' : 'Generate Temporary Email'}
            </button>
            <button className="w-full sm:w-auto glass hover:bg-surface-hover px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3">
              View API Docs
            </button>
          </div>
        </motion.div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose Temphook?</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">Everything you need in a disposable email service, built with modern technology and security in mind.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="text-yellow-400" size={32} />}
              title="Lightning Fast"
              description="Emails arrive instantly via Server-Sent Events. No manual refreshing needed. As soon as the server gets it, you see it."
            />
            <FeatureCard 
              icon={<Shield className="text-green-400" size={32} />}
              title="Secure & Private"
              description="Your temporary inbox is private and self-destructs after 24 hours. We sanitize all HTML to protect against XSS attacks."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="text-blue-400" size={32} />}
              title="Developer API"
              description="Automate your workflow with our simple REST API. Perfect for QA testing, bots, and programmatic email verification."
            />
          </div>
        </div>
      </section>

      <footer className="mt-auto py-8 text-center text-foreground/40 text-sm border-t border-surface-border glass">
        <p>© {new Date().getFullYear()} Temphook.lol - Built with Next.js</p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-8 rounded-2xl text-left"
    >
      <div className="bg-background/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-surface-border">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-foreground/60 leading-relaxed">{description}</p>
    </motion.div>
  );
}
