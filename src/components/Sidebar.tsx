import { useState } from 'react';
import { Files, Folder, FileCode, Plus, Search, ChevronRight, ChevronDown, Trash2, X, LogOut } from 'lucide-react';
import { useFileContext, type FileNode } from '../contexts/FileContext';
import { useAuth } from '../contexts/AuthContext';

// ... (FileItem component remains unchanged)

const FileItem = ({ node, depth, activeFileId, onSelect, onToggle, onDelete }: {
    node: FileNode;
    depth: number;
    activeFileId: string | undefined;
    onSelect: (node: FileNode) => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}) => {
    const isSelected = activeFileId === node.id;
    const [showDelete, setShowDelete] = useState(false);

    return (
        <div>
            <div
                className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer select-none text-sm transition-colors group
                    ${isSelected ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}
                `}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={() => node.type === 'folder' ? onToggle(node.id) : onSelect(node)}
                onMouseEnter={() => setShowDelete(true)}
                onMouseLeave={() => setShowDelete(false)}
            >
                {node.type === 'folder' && (
                    <span className="text-gray-500">
                        {node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}
                {node.type === 'folder' ? (
                    <Folder size={16} className="text-blue-400 shrink-0" />
                ) : (
                    <FileCode size={16} className="text-gray-400 shrink-0" />
                )}
                <span className="truncate flex-1">{node.name}</span>

                {node.type === 'file' && showDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
                        className="p-0.5 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-400"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>

            {node.type === 'folder' && node.isOpen && node.children && (
                <div>
                    {node.children.map(child => (
                        <FileItem
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            activeFileId={activeFileId}
                            onSelect={onSelect}
                            onToggle={onToggle}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export function Sidebar() {
    const { files, activeFile, selectFile, toggleFolder, createFile, deleteFile } = useFileContext();
    const { user, logout } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [newFileName, setNewFileName] = useState('');

    const handleCreateFile = () => {
        if (newFileName.trim()) {
            createFile(newFileName.trim());
            setNewFileName('');
            setShowModal(false);
        }
    };

    return (
        <div className="h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col relative">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <span className="font-semibold text-gray-200 flex items-center gap-2">
                    <Files size={18} /> Explorer
                </span>
                <button
                    onClick={() => setShowModal(true)}
                    className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="p-2">
                <div className="relative mb-4">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search files..."
                        className="w-full bg-gray-950 border border-gray-800 rounded px-8 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <nav className="space-y-0.5">
                    {files.map(node => (
                        <FileItem
                            key={node.id}
                            node={node}
                            depth={0}
                            activeFileId={activeFile?.id}
                            onSelect={selectFile}
                            onToggle={toggleFolder}
                            onDelete={deleteFile}
                        />
                    ))}
                </nav>
            </div>

            {/* Create File Modal */}
            {showModal && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-4 w-56 shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-200">New File</span>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="filename.js"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
                            className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500 mb-3"
                            autoFocus
                        />
                        <button
                            onClick={handleCreateFile}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
                        >
                            Create
                        </button>
                    </div>
                </div>
            )}

            {/* User Section */}
            <div className="mt-auto p-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white uppercase shrink-0">
                            {user?.email?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
                        </div>
                        <div className="text-xs truncate">
                            <div className="font-medium text-gray-200">{user?.displayName || 'User'}</div>
                            <div className="text-gray-500 truncate">{user?.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-red-400 transition-colors"
                        title="Sign out"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
