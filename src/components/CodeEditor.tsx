import { useState, useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { useFileContext } from '../contexts/FileContext';
import { generateAIResponse } from '../lib/ai';
import { Wand2, Loader2 } from 'lucide-react';

export function CodeEditor() {
    const { activeFile, updateFileContent } = useFileContext();
    const [isFixing, setIsFixing] = useState(false);
    const [fixStatus, setFixStatus] = useState<string | null>(null);
    const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // C/C++ Snippets & Keywords
        const cKeywords = [
            'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extern',
            'float', 'for', 'goto', 'if', 'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
            'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while', 'printf', 'scanf', 'include',
            'define', 'main'
        ];

        const createDependencyProposals = (range: any) => {
            return [
                {
                    label: 'main',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    documentation: 'Main function',
                    insertText: 'int main() {\n\t${1}\n\treturn 0;\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: range
                },
                {
                    label: 'include',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    documentation: 'Include standard library',
                    insertText: '#include <${1:stdio.h}>',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: range
                },
                {
                    label: 'printf',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    documentation: 'Print to stdout',
                    insertText: 'printf("${1:%s}\\n", ${2});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: range
                },
                {
                    label: 'for',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    documentation: 'For loop',
                    insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {\n\t${3}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: range
                }
            ];
        };

        // Register C/C++ Provider
        monaco.languages.registerCompletionItemProvider('c', {
            provideCompletionItems: (model: any, position: any) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                const keywords = cKeywords.map(k => ({
                    label: k,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: k,
                    range: range
                }));

                return { suggestions: [...keywords, ...createDependencyProposals(range)] };
            }
        });

        monaco.languages.registerCompletionItemProvider('cpp', {
            provideCompletionItems: (model: any, position: any) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                const keywords = [...cKeywords, 'class', 'public', 'private', 'protected', 'template', 'std::cout', 'std::cin', 'namespace', 'using'].map(k => ({
                    label: k,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: k,
                    range: range
                }));
                return { suggestions: [...keywords, ...createDependencyProposals(range)] };
            }
        });


        // Python Snippets
        monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: (model: any, position: any) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                return {
                    suggestions: [
                        {
                            label: 'def',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: 'def ${1:function_name}(${2:args}):\n\t${3:pass}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            range: range
                        },
                        {
                            label: 'print',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: 'print(${1})',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            range: range
                        },
                        {
                            label: 'if',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: 'if ${1:condition}:\n\t${2:pass}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            range: range
                        },
                        {
                            label: 'main',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: 'if __name__ == "__main__":\n\t${1:main()}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            range: range
                        }
                    ]
                };
            }
        });

        // Java Snippets
        monaco.languages.registerCompletionItemProvider('java', {
            provideCompletionItems: (model: any, position: any) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                return {
                    suggestions: [
                        {
                            label: 'psvm',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            documentation: 'public static void main',
                            insertText: 'public static void main(String[] args) {\n\t${1}\n}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            range: range
                        },
                        {
                            label: 'sout',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            documentation: 'System.out.println',
                            insertText: 'System.out.println(${1});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            range: range
                        },
                        {
                            label: 'class',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: 'public class ${1:ClassName} {\n\t${2}\n}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            range: range
                        }
                    ]
                };
            }
        });
    };

    const handleFixErrors = async () => {
        if (!activeFile || !activeFile.content) return;

        setIsFixing(true);
        setFixStatus('Analyzing code...');

        try {
            const prompt = `You are a code fixer. Analyze the following ${activeFile.language || 'code'} and fix ALL errors, bugs, and issues. 
Return ONLY the corrected code without any explanation or markdown formatting. Do not include \`\`\` backticks.
If the code is already correct, return it unchanged.

CODE TO FIX:
${activeFile.content}`;

            const response = await generateAIResponse(prompt, []);

            if (response.error) {
                setFixStatus(`Error: ${response.error}`);
                setTimeout(() => setFixStatus(null), 3000);
            } else if (response.content) {
                // Clean up the response (remove any markdown code blocks if present)
                let fixedCode = response.content.trim();
                if (fixedCode.startsWith('```')) {
                    fixedCode = fixedCode.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
                }
                updateFileContent(activeFile.id, fixedCode);
                setFixStatus('✓ Code fixed!');
                setTimeout(() => setFixStatus(null), 2000);
            }
        } catch (error) {
            setFixStatus('Failed to fix code');
            setTimeout(() => setFixStatus(null), 3000);
        } finally {
            setIsFixing(false);
        }
    };

    if (!activeFile) {
        return (
            <div className="flex-1 h-full bg-[#1e1e1e] flex items-center justify-center text-gray-500">
                Select a file to edit
            </div>
        );
    }

    return (
        <div className="flex-1 h-full bg-[#1e1e1e] flex flex-col">
            {/* Editor Toolbar */}
            <div className="h-10 bg-gray-900 border-b border-gray-800 px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-gray-500">{activeFile.name}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-600">{activeFile.language}</span>
                </div>
                <div className="flex items-center gap-2">
                    {fixStatus && (
                        <span className={`text-xs ${fixStatus.startsWith('✓') ? 'text-green-400' : fixStatus.startsWith('Error') ? 'text-red-400' : 'text-gray-400'}`}>
                            {fixStatus}
                        </span>
                    )}
                    <button
                        onClick={handleFixErrors}
                        disabled={isFixing}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 rounded text-white transition-colors"
                    >
                        {isFixing ? (
                            <Loader2 size={12} className="animate-spin" />
                        ) : (
                            <Wand2 size={12} />
                        )}
                        Fix Errors
                    </button>
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
                <Editor
                    height="100%"
                    path={activeFile.id}
                    language={activeFile.language || 'typescript'}
                    value={activeFile.content}
                    theme="vs-dark"
                    onMount={handleEditorDidMount}
                    onChange={(value) => updateFileContent(activeFile.id, value || '')}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono, monospace',
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16 }
                    }}
                />
            </div>
        </div>
    );
}
