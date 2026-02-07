import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

export function Login() {
    const { signInWithGoogle, error } = useAuth();

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome to AI IDE</h1>
                <p className="text-gray-400 mb-8">Sign in to start coding</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-4 text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={signInWithGoogle}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-3"
                >
                    <LogIn className="w-5 h-5" />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
}
