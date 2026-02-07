import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, Sparkles, User, Loader2, GripVertical, Copy, Check } from 'lucide-react';
import { useFileContext } from '../contexts/FileContext';
import { generateAIResponse } from '../lib/ai';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
}

export function AIPanel() {
    const { activeFile } = useFileContext();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: "Hello! I'm your AI coding assistant. I can help you write, debug, and explain code." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [width, setWidth] = useState(320); // Default 320px (w-80)
    const [isResizing, setIsResizing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Resize handlers
    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isResizing && panelRef.current) {
            const newWidth = window.innerWidth - e.clientX;
            // Clamp between 240px and 600px
            setWidth(Math.max(240, Math.min(600, newWidth)));
        }
    }, [isResizing]);

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const contextFiles = activeFile && activeFile.type === 'file'
                ? [{ name: activeFile.name, content: activeFile.content || '', language: activeFile.language || 'text' }]
                : [];

            const response = await generateAIResponse(input, contextFiles);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: response.error ? `⚠️ ${response.error}` : response.content
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "Sorry, I encountered an error communicating with the AI."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div
            ref={panelRef}
            className="h-full bg-gray-900 border-l border-gray-800 flex flex-col relative"
            style={{ width: `${width}px`, minWidth: '240px', maxWidth: '600px' }}
        >
            {/* Resize Handle */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize group flex items-center justify-center
                    ${isResizing ? 'bg-purple-500' : 'hover:bg-purple-500/50'}`}
                onMouseDown={startResizing}
            >
                <div className="absolute -left-2 w-5 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={12} className="text-gray-400" />
                </div>
            </div>

            <div className="p-4 border-b border-gray-800 flex items-center gap-2">
                <Sparkles className="text-purple-400" size={18} />
                <span className="font-semibold text-gray-200">AI Assistant</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 ai-chat-scroll">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ai-message-container ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                            ${msg.role === 'ai' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                            {msg.role === 'ai' ? (
                                <Bot size={16} className="text-purple-400" />
                            ) : (
                                <User size={16} className="text-blue-400" />
                            )}
                        </div>
                        <div className="flex flex-col gap-1 max-w-[85%]">
                            <div className={`px-4 py-3 rounded-2xl ai-chat-message
                                ${msg.role === 'ai'
                                    ? 'bg-gray-800/80 text-gray-200 rounded-tl-md'
                                    : 'bg-gradient-to-r from-blue-600/30 to-purple-600/20 text-gray-100 rounded-tr-md border border-blue-500/20'}`}>
                                <span className="whitespace-pre-wrap">{msg.content}</span>
                            </div>
                            {msg.role === 'ai' && (
                                <div className="flex items-center gap-1 pl-1">
                                    <button
                                        onClick={() => copyToClipboard(msg.content, msg.id)}
                                        className={`copy-btn p-1.5 rounded-md hover:bg-gray-700/50 transition-all text-gray-500 hover:text-gray-300 ${copiedId === msg.id ? 'copied' : ''}`}
                                        title={copiedId === msg.id ? 'Copied!' : 'Copy message'}
                                    >
                                        {copiedId === msg.id ? (
                                            <Check size={14} className="text-green-400" />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-purple-400" />
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg rounded-tl-none text-sm text-gray-300 flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin text-purple-400" />
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-800">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Ask anything..."
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-4 pr-10 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="absolute right-2 top-2 p-1 text-gray-400 hover:text-purple-400 transition-colors disabled:opacity-50"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
