'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Loader2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectIsLoggedIn } from '@/store/slices/userSlice';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
}

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! How can I help you today? You can ask me about tracking your order, product recommendations, or your available coupons!",
            sender: 'bot',
            timestamp: new Date('2026-03-07T00:00:00Z')
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const user = useAppSelector(selectUser);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    userId: isLoggedIn ? user?.id : null
                })
            });
            const data = await res.json();
            
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.reply,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting to the garden right now. Please try again later!",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div suppressHydrationWarning style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Chat Bubble Toggle */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(45, 106, 79, 0.3)',
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '380px', height: '550px', backgroundColor: 'white',
                    borderRadius: '24px', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.05)',
                    overflow: 'hidden', animation: 'slideUp 0.3s ease-out',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '20px 24px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: 'rgba(255,255,255,0.2)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Veg-Assistant</h3>
                                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Online • Smart Support</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7 }}>
                                <Minimize2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#f9fafb' }}>
                        {messages.map((msg) => (
                            <div key={msg.id} style={{
                                alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                                maxWidth: '85%',
                                display: 'flex',
                                gap: '8px',
                                flexDirection: msg.sender === 'bot' ? 'row' : 'row-reverse'
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '10px',
                                    background: msg.sender === 'bot' ? 'var(--primary-100)' : 'var(--accent-100)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: msg.sender === 'bot' ? 'var(--primary)' : 'var(--accent)',
                                    flexShrink: 0
                                }}>
                                    {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: msg.sender === 'bot' ? '0 16px 16px 16px' : '16px 0 16px 16px',
                                    backgroundColor: msg.sender === 'bot' ? 'white' : 'var(--primary)',
                                    color: msg.sender === 'bot' ? 'var(--text)' : 'white',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.5,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    whiteSpace: 'pre-line'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <Bot size={16} />
                                </div>
                                <div style={{ padding: '12px 16px', borderRadius: '0 16px 16px 16px', backgroundColor: 'white', display: 'flex', gap: '4px' }}>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assistant is thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} style={{ padding: '20px', backgroundColor: 'white', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            style={{
                                flex: 1, padding: '12px 16px', borderRadius: '12px',
                                border: '1px solid #e2e8f0', outline: 'none',
                                fontSize: '0.9rem', transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            style={{
                                width: '45px', height: '45px', borderRadius: '12px',
                                background: 'var(--primary)', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: 'none', cursor: 'pointer', opacity: input.trim() ? 1 : 0.5,
                                transition: 'transform 0.2s',
                            }}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ChatBot;
