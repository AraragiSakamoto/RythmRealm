import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://jxgiffkpcvbmfqxdgvje.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Z2lmZmtwY3ZibWZxeGRndmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MjA2NDcsImV4cCI6MjA4NDA5NjY0N30.Gu_x_H4HSxeBKK0Vn8mu-YqnfHG5uBCJw1GjLF8ZdyM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const authService = {
    login: async (email, password) => {
        return await supabase.auth.signInWithPassword({ email, password });
    },
    register: async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });
        return { data, error };
    },
    logout: async () => {
        return await supabase.auth.signOut();
    },
    getUserProfile: async (userId) => {
        // Attempt to get profile from 'profiles' table
        return await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
    }
};

export const scoreService = {
    getUserLevels: async (userId) => {
        return await supabase
            .from('user_levels')
            .select('*')
            .eq('user_id', userId);
    },
    submitScore: async (userId, levelId, score, accuracy) => {
        return await supabase
            .from('user_levels')
            .upsert({ user_id: userId, level_id: levelId, score, accuracy });
    }
};

export const beatStorageService = {
    getUserBeats: async (userId) => {
        const { data } = await supabase
            .from('beats')
            .select('*')
            .eq('user_id', userId);
        return data;
    },
    saveBeat: async (userId, beatData) => {
        const { data, error } = await supabase
            .from('beats')
            .insert({ ...beatData, user_id: userId })
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    deleteBeat: async (beatId, userId) => {
        return await supabase
            .from('beats')
            .delete()
            .eq('id', beatId)
            .eq('user_id', userId);
    }
};

export const achievementService = {
    getAllAchievements: async () => {
        return await supabase.from('achievements').select('*');
    },
    getUserAchievements: async (userId) => {
        const { data } = await supabase
            .from('user_achievements')
            .select('*, achievements(*)')
            .eq('user_id', userId);
        return { data };
    },
    checkAndUnlock: async (userId, type, value) => {
        // Mock implementation for build
        return { newUnlock: null };
    }
};
