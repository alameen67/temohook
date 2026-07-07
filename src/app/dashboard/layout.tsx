import { Mail, Key, Settings, HelpCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-surface-border hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-surface-border">
          <div className="bg-primary/20 p-2 rounded-xl">
            <Mail className="text-primary-light" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">Temphook</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-foreground/80 hover:text-foreground transition-colors">
            <PlusCircle size={20} className="text-primary-light" />
            <span className="font-medium">Generate New</span>
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-foreground/40 uppercase tracking-wider">Menu</p>
          </div>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary-light border border-primary/20 transition-colors">
            <Mail size={20} />
            <span className="font-medium">Inbox</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-foreground/80 hover:text-foreground transition-colors">
            <Key size={20} />
            <span className="font-medium">API Tokens</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-foreground/80 hover:text-foreground transition-colors">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-foreground/80 hover:text-foreground transition-colors">
            <HelpCircle size={20} />
            <span className="font-medium">FAQ</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-surface-border">
          <div className="p-4 rounded-xl glass-panel text-center">
            <p className="text-xs text-foreground/60 mb-2">Inboxes expire after</p>
            <p className="font-bold text-primary-light">24 Hours</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}
