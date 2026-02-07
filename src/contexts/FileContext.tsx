import { createContext, useContext, useState, type ReactNode } from 'react';

export type FileType = 'file' | 'folder';

export interface FileNode {
    id: string;
    name: string;
    type: FileType;
    content?: string; // Only for files
    language?: string; // e.g., 'typescript', 'css'
    children?: FileNode[]; // Only for folders
    parentId?: string;
    isOpen?: boolean; // For folders
}

interface FileContextType {
    files: FileNode[];
    activeFile: FileNode | null;
    selectFile: (file: FileNode) => void;
    updateFileContent: (id: string, newContent: string) => void;
    toggleFolder: (id: string) => void;
    createFile: (name: string, parentId?: string) => void;
    deleteFile: (id: string) => void;
}

// Initial Mock Data
const initialFiles: FileNode[] = [
    {
        id: 'root',
        name: 'src',
        type: 'folder',
        isOpen: true,
        children: [
            {
                id: '1',
                name: 'App.tsx',
                type: 'file',
                language: 'typescript',
                parentId: 'root',
                content: `import React from 'react';

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Hello World</h1>
    </div>
  );
}`
            },
            {
                id: '2',
                name: 'index.css',
                type: 'file',
                language: 'css',
                parentId: 'root',
                content: `@import "tailwindcss";

body {
  @apply bg-gray-950 text-white;
}`
            },
            {
                id: '3',
                name: 'utils.ts',
                type: 'file',
                language: 'typescript',
                parentId: 'root',
                content: `export function add(a: number, b: number) {
  return a + b;
}`
            },
            {
                id: '4',
                name: 'hello.py',
                type: 'file',
                language: 'python',
                parentId: 'root',
                content: `# Python Example
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
print("2 + 2 =", 2 + 2)`
            },
            {
                id: '5',
                name: 'script.js',
                type: 'file',
                language: 'javascript',
                parentId: 'root',
                content: `// JavaScript Example
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
    console.log(fibonacci(i));
}`
            }
        ]
    }
];

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
    const [files, setFiles] = useState<FileNode[]>(initialFiles);
    const [activeFile, setActiveFile] = useState<FileNode | null>(initialFiles[0].children![0]);

    const selectFile = (file: FileNode) => {
        if (file.type === 'file') {
            setActiveFile(file);
        }
    };

    const toggleFolder = (id: string) => {
        // Basic recursive toggle logic or assume flat for now if simplified
        // Supporting 1 level deep for demo
        setFiles(prev => prev.map(node => {
            if (node.id === id) {
                return { ...node, isOpen: !node.isOpen };
            }
            return node;
        }));
    };

    const updateFileContent = (id: string, newContent: string) => {
        setFiles(prev => {
            // Implementation for deep update would be recursive
            // For this mock, we know structure is Root -> Files
            return prev.map(folder => {
                if (folder.children) {
                    return {
                        ...folder,
                        children: folder.children.map(file =>
                            file.id === id ? { ...file, content: newContent } : file
                        )
                    };
                }
                return folder;
            });
        });

        // Also update active file if it matches
        if (activeFile?.id === id) {
            setActiveFile(prev => prev ? { ...prev, content: newContent } : null);
        }
    };

    // Helper to detect language from file extension
    const getLanguageFromName = (name: string): string => {
        const ext = name.split('.').pop()?.toLowerCase();
        const langMap: Record<string, string> = {
            ts: 'typescript', tsx: 'typescript',
            js: 'javascript', jsx: 'javascript',
            py: 'python',
            css: 'css',
            html: 'html',
            json: 'json',
            java: 'java',
            cpp: 'cpp', c: 'c',
            rs: 'rust',
            go: 'go',
            php: 'php',
            rb: 'ruby',
            cs: 'csharp'
        };
        return langMap[ext || ''] || 'plaintext';
    };

    const createFile = (name: string, parentId: string = 'root') => {
        const newFile: FileNode = {
            id: `file-${Date.now()}`,
            name,
            type: 'file',
            language: getLanguageFromName(name),
            parentId,
            content: `// ${name}\n`
        };

        setFiles(prev => prev.map(folder => {
            if (folder.id === parentId && folder.children) {
                return { ...folder, children: [...folder.children, newFile] };
            }
            return folder;
        }));

        // Auto-select newly created file
        setActiveFile(newFile);
    };

    const deleteFile = (id: string) => {
        setFiles(prev => prev.map(folder => {
            if (folder.children) {
                return { ...folder, children: folder.children.filter(f => f.id !== id) };
            }
            return folder;
        }));

        // Clear active file if it was deleted
        if (activeFile?.id === id) {
            setActiveFile(null);
        }
    };

    return (
        <FileContext.Provider value={{ files, activeFile, selectFile, updateFileContent, toggleFolder, createFile, deleteFile }}>
            {children}
        </FileContext.Provider>
    );
}

export function useFileContext() {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
}
