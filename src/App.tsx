import { Layout } from './components/Layout';
import { FileProvider } from './contexts/FileContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';

function AuthenticatedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <FileProvider>
      <Layout />
    </FileProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
