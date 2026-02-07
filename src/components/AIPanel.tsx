import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, Sparkles, User, Loader2, GripVertical, Copy, Check } from 'lucide-react';
import { useFileContext } from '../contexts/FileContext';
import { generateAIResponse } from '../lib/ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    const [width, setWidth] = useState(350); // Slightly wider default
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
            // Clamp between 280px and 800px
            setWidth(Math.max(280, Math.min(800, newWidth)));
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
            className="h-full bg-[#0d0d0d] border-l border-white/10 flex flex-col relative shadow-2xl"
            style={{ width: `${width}px`, minWidth: '280px', maxWidth: '800px' }}
        >
            {/* Resize Handle */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize group flex items-center justify-center z-10
                    ${isResizing ? 'bg-blue-500' : 'hover:bg-blue-500/50'}`}
                onMouseDown={startResizing}
            >
                <div className="absolute -left-2 w-5 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={14} className="text-gray-400" />
                </div>
            </div>

            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0d0d0d]/95 backdrop-blur">
                <div className="flex items-center gap-2.5">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg shadow-lg shadow-purple-900/20">
                        <Sparkles className="text-white" size={16} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-100 text-sm tracking-tight">AI Assistant</h2>
                        <p className="text-[10px] text-gray-400 font-medium">Powered by Gemini</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 ai-chat-scroll bg-[#0d0d0d]">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ai-message-container ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg border border-white/5
                            ${msg.role === 'ai'
                                ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                                : 'bg-gradient-to-br from-blue-600 to-blue-700'}`}>
                            {msg.role === 'ai' ? (
                                <Bot size={16} className="text-gray-300" />
                            ) : (
                                <User size={16} className="text-white" />
                            )}
                        </div>

                        {/* Content */}
                        <div className={`flex flex-col gap-1 max-w-[85%] min-w-0 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {/* Name Label */}
                            <span className="text-[10px] text-gray-500 font-medium px-1">
                                {msg.role === 'ai' ? 'Gemini' : 'You'}
                            </span>

                            <div className={`px-4 py-3 rounded-2xl ai-chat-message shadow-sm
                                ${msg.role === 'ai'
                                    ? 'bg-[#1a1a1a] text-gray-200 rounded-tl-sm border border-white/5'
                                    : 'bg-blue-600 text-white rounded-tr-sm shadow-blue-900/20'}`}>

                                {msg.role === 'ai' ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code(props: any) {
                                                const { node, inline, className, children, ...rest } = props;
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline && match ? (
                                                    <div className="my-3 rounded-lg overflow-hidden border border-white/10 bg-[#111]">
                                                        <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
                                                            <span className="text-xs text-gray-400 font-mono">{match[1]}</span>
                                                            <button
                                                                onClick={() => copyToClipboard(String(children).replace(/\n$/, ''), msg.id + match[1])}
                                                                className="text-gray-500 hover:text-gray-300 transition-colors"
                                                            >
                                                                {copiedId === msg.id + match[1] ? <Check size={12} /> : <Copy size={12} />}
                                                            </button>
                                                        </div>
                                                        <code className={`${className} block p-3 text-sm font-mono text-gray-300 overflow-x-auto`} {...rest}>
                                                            {children}
                                                        </code>
                                                    </div>
                                                ) : (
                                                    <code className={`${className} font-mono bg-white/10 rounded px-1 py-0.5 text-[0.9em]`} {...rest}>
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>,
                                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                            a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{children}</a>,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                ) : (
                                    <span className="whitespace-pre-wrap">{msg.content}</span>
                                )}
                            </div>

                            {/* Actions (Copy whole message for AI) */}
                            {msg.role === 'ai' && (
                                <div className="flex items-center gap-1 pl-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => copyToClipboard(msg.content, msg.id)}
                                        className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors"
                                        title="Copy response"
                                    >
                                        {copiedId === msg.id ? (
                                            <Check size={12} className="text-green-400" />
                                        ) : (
                                            <Copy size={12} />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shrink-0 border border-white/5">
                            <Bot size={16} className="text-gray-300" />
                        </div>
                        <div className="bg-[#1a1a1a] px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 text-sm text-gray-400 flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin text-blue-500" />
                            <span className="font-medium animate-pulse">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0d0d0d] border-t border-white/10">
                <div className="relative bg-[#1a1a1a] rounded-xl border border-white/10 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
                    <textarea
                        placeholder="Ask anything about your code..."
                        className="w-full bg-transparent border-none rounded-xl pl-4 pr-12 py-3 text-sm text-gray-200 placeholder:text-gray-500 focus:ring-0 resize-none h-[46px] max-h-[120px]"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-transparent disabled:text-gray-600 text-white rounded-lg transition-all shadow-lg shadow-blue-900/20"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-600">AI can make mistakes. Verify important code.</p>
                </div>
            </div>
        </div>
    );
}
