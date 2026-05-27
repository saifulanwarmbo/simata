
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PublicDashboardPage from './pages/PublicDashboardPage';
import LoginPage from './components/LoginPage';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';

type ViewState = 'public' | 'login' | 'dashboard';

const App: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>('public');
    const [user, setUser] = useState<User | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setViewState('dashboard');
            } else if (viewState === 'dashboard') {
                setViewState('public');
            }
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, [viewState]);

    const handleLogin = async (username?: string, password?: string): Promise<boolean> => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            alert("Gagal login dengan Google.");
            return false;
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setViewState('public');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navigateToLogin = () => setViewState('login');
    const navigateToPublic = () => setViewState('public');

    const adminEmails = ['saiful.anwarmbo@gmail.com']; // Admin user
    const checkIsAdmin = (user: User | null) => user ? adminEmails.includes(user.email || '') : false; // Only legal admins
    const isAdmin = checkIsAdmin(user);

    if (!isAuthReady) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-100">Memuat...</div>;
    }

    switch (viewState) {
        case 'dashboard':
            return <Dashboard onLogout={handleLogout} isAdmin={isAdmin} />;
        case 'login':
            return <LoginPage onLogin={handleLogin} onBack={navigateToPublic} />;
        case 'public':
        default:
            return <Dashboard onLogout={() => {}} isAdmin={false} onGoToLogin={navigateToLogin} />;
    }
};

export default App;