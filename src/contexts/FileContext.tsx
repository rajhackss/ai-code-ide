import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const STORAGE_KEY = 'ide-files-v5';

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
        id: '1',
        name: 'Welcome.md',
        type: 'file',
        language: 'markdown',
        parentId: undefined, // Top level
        content: `# Welcome to your AI-Based Web IDE

This is a lightweight, AI-Based IDE.

- Create files (.c, .py, .java) 
Start coding by creating a new file`
    }
];

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
    const [files, setFiles] = useState<FileNode[]>(initialFiles);
    const [activeFile, setActiveFile] = useState<FileNode | null>(null);
    const [loaded, setLoaded] = useState(false);

    // Load initial files
    useEffect(() => {
        // Load from LocalStorage
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setFiles(JSON.parse(saved));
            } else {
                setFiles(initialFiles);
            }
        } catch (error) {
            console.error('Failed to load files from storage:', error);
            setFiles(initialFiles);
        }
        setLoaded(true);
    }, []);

    // Save to storage whenever files change
    useEffect(() => {
        if (!loaded) return;

        // Save to LocalStorage
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
        } catch (error) {
            console.error('Failed to save files to storage:', error);
        }
    }, [files, loaded]);

    // Set active file on load
    useEffect(() => {
        if (loaded && !activeFile && files.length > 0) {
            // Find first file
            const firstFile = files.find(f => f.type === 'file') || files[0]?.children?.[0];
            setActiveFile(firstFile || null);
        }
    }, [loaded, files, activeFile]);

    const selectFile = (file: FileNode) => {
        if (file.type === 'file') {
            setActiveFile(file);
        }
    };

    const toggleFolder = (id: string) => {
        setFiles(prev => prev.map(node => {
            if (node.id === id) {
                return { ...node, isOpen: !node.isOpen };
            }
            return node;
        }));
    };

    const updateFileContent = (id: string, newContent: string) => {
        setFiles(prev => {
            return prev.map(node => {
                if (node.id === id && node.type === 'file') {
                    return { ...node, content: newContent };
                }
                if (node.children) {
                    return {
                        ...node,
                        children: node.children.map(file =>
                            file.id === id ? { ...file, content: newContent } : file
                        )
                    };
                }
                return node;
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

    const createFile = (name: string, parentId?: string) => {
        const newFile: FileNode = {
            id: `file-${Date.now()}`,
            name,
            type: 'file',
            language: getLanguageFromName(name),
            parentId,
            content: `// ${name}\n`
        };

        if (!parentId) {
            setFiles(prev => [...prev, newFile]);
            setActiveFile(newFile);
            return;
        }

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
        setFiles(prev => prev.filter(f => f.id !== id).map(folder => {
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
