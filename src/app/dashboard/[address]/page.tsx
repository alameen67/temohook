'use client';

export const runtime = 'edge';

import { useState, useEffect, use } from 'react';
import { Copy, QrCode, Wifi, WifiOff, Inbox as InboxIcon, ChevronRight, Mail } from 'lucide-react';

import { formatDistanceToNow } from 'date-fns';

type Message = {
  id: string;
  sender: string;
  subject: string;
  text?: string;
  html?: string;
  receivedAt: string;
  size: number;
};

export default function DashboardPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/inbox/${address}`);
        const data: any = await res.json();
        if (data.messages) {
          setMessages(data.messages);
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };

    fetchMessages();
    setConnected(true);

    // Poll every 3 seconds
    const interval = setInterval(fetchMessages, 3000);

    return () => {
      clearInterval(interval);
      setConnected(false);
    };
  }, [address]);

  const loadMessageContent = async (id: string) => {
    try {
      const res = await fetch(`/api/message/${id}`);
      const data: any = await res.json();
      setSelectedMessage(data);
    } catch (e) {
      console.error(e);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    // Could add toast notification here
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Topbar: Address Info */}
      <header className="p-6 border-b border-surface-border glass z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground/60 mb-1">Your temporary email address</p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-foreground/70">
              {address}
            </h1>
            <button onClick={copyAddress} className="p-2 glass rounded-lg hover:bg-surface-hover hover:text-primary-light transition-colors" title="Copy">
              <Copy size={18} />
            </button>
            <button className="p-2 glass rounded-lg hover:bg-surface-hover hover:text-primary-light transition-colors" title="QR Code">
              <QrCode size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-surface-border text-sm font-medium">
          {connected ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-green-400">Live Updates Active</span>
            </>
          ) : (
            <>
              <WifiOff size={16} className="text-red-400" />
              <span className="text-red-400">Disconnected</span>
            </>
          )}
        </div>
      </header>

      {/* Main Area: Inbox List & Viewer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Inbox List */}
        <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-surface-border flex flex-col bg-background/50 ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-surface-border font-medium flex items-center gap-2">
            <InboxIcon size={18} /> Inbox ({messages.length})
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-foreground/50">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full text-foreground/50">
                <div className="w-16 h-16 rounded-full bg-surface border border-surface-border flex items-center justify-center mb-4">
                  <InboxIcon size={24} className="text-foreground/30" />
                </div>
                <p>Waiting for incoming emails...</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => loadMessageContent(msg.id)}
                  className={`p-4 border-b border-surface-border cursor-pointer transition-colors hover:bg-surface-hover ${selectedMessage?.id === msg.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium truncate pr-2" title={msg.sender}>{msg.sender}</span>
                    <span className="text-xs text-foreground/50 whitespace-nowrap">{formatDistanceToNow(new Date(msg.receivedAt))} ago</span>
                  </div>
                  <div className="text-sm font-medium text-foreground/80 truncate mb-1">{msg.subject || '(No Subject)'}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Viewer */}
        <div className={`flex-1 flex flex-col bg-background ${!selectedMessage ? 'hidden md:flex' : 'flex'}`}>
          {selectedMessage ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 border-b border-surface-border glass sticky top-0 z-10">
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="md:hidden flex items-center gap-1 text-primary-light mb-4 text-sm font-medium"
                >
                  <ChevronRight className="rotate-180" size={16} /> Back to Inbox
                </button>
                <h2 className="text-2xl font-bold mb-4">{selectedMessage.subject || '(No Subject)'}</h2>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-foreground/50">From: </span>
                    <span className="font-medium">{selectedMessage.sender}</span>
                  </div>
                  <span className="text-foreground/50">{new Date(selectedMessage.receivedAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="p-8">
                {selectedMessage.html ? (
                  <div 
                    className="prose prose-invert max-w-none prose-a:text-primary-light"
                    dangerouslySetInnerHTML={{ __html: selectedMessage.html }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-foreground/80">
                    {selectedMessage.text || 'No content.'}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-foreground/40 hidden md:flex">
              <div className="text-center">
                <Mail size={48} className="mx-auto mb-4 opacity-20" />
                <p>Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
