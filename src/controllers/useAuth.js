
import { useState, useEffect } from 'react';
import { supabase, authService } from '../models/supabaseClient';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user || null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user || null);
            if (session?.user) {
                await fetchUserProfile(session.user.id);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId) => {
        const { data, error } = await authService.getUserProfile(userId);
        if (data) {
            setUserProfile(data);
        } else if (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setAuthError(null);
        const { data, error } = await authService.login(email, password);
        if (error) {
            setAuthError(error.message);
            setLoading(false);
            return { error };
        }
        return { data };
    };

    const register = async (email, password, username) => {
        setLoading(true);
        setAuthError(null);
        const { data, error } = await authService.register(email, password, username);
        if (error) {
            setAuthError(error.message);
            setLoading(false);
            return { error };
        }
        return { data };
    };
    
    const logout = async () => {
        await authService.logout();
        setUser(null);
        setSession(null);
        setUserProfile(null);
    };

    return {
        user,
        session,
        userProfile,
        loading,
        authError,
        login,
        register,
        logout,
        fetchUserProfile // expose if needed to refresh
    };
};
