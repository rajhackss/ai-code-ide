import { useState } from 'react';
import { Play, Trash2, Terminal as TerminalIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { useFileContext } from '../contexts/FileContext';
import { runCode, getSupportedLanguages } from '../lib/codeRunner';

interface TerminalProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function Terminal({ isOpen, onToggle }: TerminalProps) {
    const { activeFile } = useFileContext();
    const [output, setOutput] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = async () => {
        if (!activeFile || !activeFile.content) return;

        setIsRunning(true);
        setOutput('Running...\n');

        const result = await runCode(activeFile.content, activeFile.language || 'javascript');

        if (result.error) {
            setOutput(prev => prev + `\n❌ Error:\n${result.error}`);
        } else {
            setOutput(prev => prev + `\n✅ Output:\n${result.output || '(no output)'}`);
        }

        setIsRunning(false);
    };

    const handleClear = () => setOutput('');

    const canRun = activeFile && getSupportedLanguages().includes(activeFile.language || '');

    return (
        <div className={`bg-gray-900 border-t border-gray-800 flex flex-col transition-all ${isOpen ? 'h-48' : 'h-10'}`}>
            {/* Toolbar */}
            <div className="h-10 px-4 flex items-center justify-between border-b border-gray-800 shrink-0">
                <div className="flex items-center gap-2">
                    <TerminalIcon size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-300">Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRun}
                        disabled={isRunning || !canRun}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 rounded text-white transition-colors"
                    >
                        <Play size={12} />
                        Run
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                    <button
                        onClick={onToggle}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>
                </div>
            </div>

            {/* Output */}
            {isOpen && (
                <div className="flex-1 overflow-auto p-3 font-mono text-xs text-gray-300 whitespace-pre-wrap">
                    {output || 'Click "Run" to execute your code...'}
                </div>
            )}
        </div>
    );
}
