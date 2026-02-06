import { supabase } from './supabaseClient';

export const AuthModel = {
  // Sign up with email and password
  async signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://rythm-realm.vercel.app',
        data: {
          username: username,
          display_name: username
        },
        // Disable email confirmation to avoid rate limit issues
        emailRedirectTo: undefined
      }
    });

    if (error) throw error;

    // Profile is created automatically by database trigger (handle_new_user)
    // No manual creation needed - the trigger uses SECURITY DEFINER to bypass RLS

    return data;
  },

  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Create user profile
  async createUserProfile(userId, username, email) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        username: username,
        email: email,
        total_score: 0,
        total_beats_created: 0,
        total_tutorials_completed: 0,
        current_streak: 0,
        longest_streak: 0,
        rank_title: 'Beginner',
        experience_points: 0,
        level: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error && error.code !== '23505') throw error; // Ignore duplicate key errors
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
