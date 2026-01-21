-- ==========================================
-- RHYTHM REALM DATABASE SCHEMA (REFRESHABLE)
-- ==========================================

-- ==========================================
-- 1. PROFILES TABLE (User Data)
-- ==========================================
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255),
    avatar_url TEXT,
    total_score BIGINT DEFAULT 0,
    total_beats_created INTEGER DEFAULT 0,
    total_tutorials_completed INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_played_at TIMESTAMP WITH TIME ZONE,
    rank_title VARCHAR(50) DEFAULT 'Beginner',
    experience_points BIGINT DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_profiles_total_score ON public.profiles(total_score DESC);
CREATE INDEX idx_profiles_level ON public.profiles(level DESC);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'service_role' OR auth.role() = 'authenticated');
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- 2. SCORES TABLE (Game Scores)
-- ==========================================
DROP TABLE IF EXISTS public.scores CASCADE;

CREATE TABLE public.scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    scenario_id INTEGER NOT NULL,
    scenario_name VARCHAR(100),
    score INTEGER NOT NULL DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0,
    tempo INTEGER DEFAULT 100,
    instruments_used TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_scores_user_id ON public.scores(user_id);
CREATE INDEX idx_scores_score ON public.scores(score DESC);

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Scores are viewable by everyone" ON public.scores FOR SELECT USING (true);
CREATE POLICY "Users can insert their own scores" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 3. USER ACHIEVEMENTS TABLE
-- ==========================================
DROP TABLE IF EXISTS public.user_achievements CASCADE;

CREATE TABLE public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are viewable by everyone" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 4. SAVED BEATS TABLE (Cloud Storage)
-- ==========================================
DROP TABLE IF EXISTS public.saved_beats CASCADE;

CREATE TABLE public.saved_beats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    grid JSONB NOT NULL,
    tempo INTEGER DEFAULT 100,
    instruments TEXT[],
    instrument_config JSONB,
    is_public BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.saved_beats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public beats are viewable by everyone" ON public.saved_beats FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert their own beats" ON public.saved_beats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own beats" ON public.saved_beats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own beats" ON public.saved_beats FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 5. DAILY CHALLENGES & COMPLETIONS
-- ==========================================
DROP TABLE IF EXISTS public.daily_challenges CASCADE;
DROP TABLE IF EXISTS public.challenge_completions CASCADE;

CREATE TABLE public.daily_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
    challenge_type VARCHAR(50) NOT NULL,
    challenge_data JSONB,
    reward_xp INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE public.challenge_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    challenge_id UUID REFERENCES public.daily_challenges(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, challenge_id)
);

ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Challenges viewable by everyone" ON public.daily_challenges FOR SELECT USING (true);
CREATE POLICY "Completions viewable by everyone" ON public.challenge_completions FOR SELECT USING (true);
CREATE POLICY "Users insert own completions" ON public.challenge_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 6. FUNCTIONS & TRIGGERS
-- ==========================================

-- Function for Auto-Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'Player_' || LEFT(NEW.id::text, 8)),
        NEW.email
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger (Drop and Recreate)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function for Streaks
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_last_played TIMESTAMP WITH TIME ZONE;
    v_current_streak INTEGER;
    v_longest_streak INTEGER;
BEGIN
    SELECT last_played_at, current_streak, longest_streak 
    INTO v_last_played, v_current_streak, v_longest_streak
    FROM public.profiles WHERE id = p_user_id;
    
    IF v_last_played IS NULL THEN
        UPDATE public.profiles SET current_streak = 1, longest_streak = 1, last_played_at = NOW() WHERE id = p_user_id;
    ELSIF v_last_played::date = CURRENT_DATE THEN
        UPDATE public.profiles SET last_played_at = NOW() WHERE id = p_user_id;
    ELSIF v_last_played::date = CURRENT_DATE - INTERVAL '1 day' THEN
        v_current_streak := v_current_streak + 1;
        IF v_current_streak > v_longest_streak THEN v_longest_streak := v_current_streak; END IF;
        UPDATE public.profiles SET current_streak = v_current_streak, longest_streak = v_longest_streak, last_played_at = NOW() WHERE id = p_user_id;
    ELSE
        UPDATE public.profiles SET current_streak = 1, last_played_at = NOW() WHERE id = p_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. VIEWS
-- ==========================================
DROP VIEW IF EXISTS public.leaderboard;
CREATE VIEW public.leaderboard AS
SELECT 
    id, username, total_score, level, rank_title, total_beats_created, total_tutorials_completed,
    ROW_NUMBER() OVER (ORDER BY total_score DESC) as rank
FROM public.profiles;

GRANT SELECT ON public.leaderboard TO anon, authenticated;