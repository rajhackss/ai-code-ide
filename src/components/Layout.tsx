import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { CodeEditor } from './CodeEditor';
import { AIPanel } from './AIPanel';
import { Terminal } from './Terminal';

export function Layout() {
    const [terminalOpen, setTerminalOpen] = useState(true);

    return (
        <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden">
            {/* Sidebar - Left Panel */}
            <Sidebar />

            {/* Main Editor Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Editor */}
                <div className="flex-1 relative overflow-hidden">
                    <CodeEditor />
                </div>

                {/* Terminal */}
                <Terminal isOpen={terminalOpen} onToggle={() => setTerminalOpen(!terminalOpen)} />
            </main>

            {/* AI Panel - Right Panel */}
            <AIPanel />
        </div>
    );
}
