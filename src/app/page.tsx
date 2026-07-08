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
      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      router.push(`/dashboard/${data.address}`);
    } catch (error: any) {
      console.error(error);
      alert(String(error) + (error.message ? " MSG: " + error.message : " NO MSG"));
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
          </div>
        </motion.div>
      </section>



      <footer className="mt-auto py-8 text-center text-foreground/40 text-sm border-t border-surface-border glass">
        <p>© {new Date().getFullYear()} Temphook.lol - Built with Next.js</p>
      </footer>
    </main>
  );
}


