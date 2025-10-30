
import { useAuth } from './context/AuthContext';
import  Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return user.role === "admin" ? <AdminDashboard /> : <StudentDashboard />;
}

function App() {
  return (
      <AppContent />
  );
}

export default App;
