// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import HomePage from './pages/HomePage';
import CreatePostForm from './components/posts/CreatePostForm';
import PostDetail from './components/posts/PostDetail';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return null;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

function AppContent() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route 
                        path="/posts/new" 
                        element={
                            <ProtectedRoute>
                                <CreatePostForm />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="/posts/:postId" element={<PostDetail />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}