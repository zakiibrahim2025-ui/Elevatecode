import { useAuth } from '@/lib/AuthContext';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div key={user ? 'dashboard' : 'login'} className="page-transition">
      {user ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;
