import { supabase } from './supabaseClient';

export const ScoreModel = {
  // Save a score
  async saveScore(userId, scenarioId, scenarioName, score, accuracy, tempo, instrumentsUsed) {
    const { data, error } = await supabase
      .from('scores')
      .insert({
        user_id: userId,
        scenario_id: scenarioId,
        scenario_name: scenarioName,
        score: score,
        accuracy: accuracy,
        tempo: tempo,
        instruments_used: instrumentsUsed,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Update user's total score
    await this.updateUserTotalScore(userId, score);

    return data;
  },

  // Update user's total score and XP
  async updateUserTotalScore(userId, additionalScore) {
    // Get current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_score, experience_points, level')
      .eq('id', userId)
      .single();

    if (profile) {
      const newTotalScore = (profile.total_score || 0) + additionalScore;
      const newXP = (profile.experience_points || 0) + Math.floor(additionalScore / 10);
      const newLevel = Math.floor(newXP / 1000) + 1;
      const rankTitle = this.getRankTitle(newLevel);

      await supabase
        .from('profiles')
        .update({
          total_score: newTotalScore,
          experience_points: newXP,
          level: newLevel,
          rank_title: rankTitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    }
  },

  // Get rank title based on level
  getRankTitle(level) {
    if (level >= 50) return '🎵 Rhythm Master';
    if (level >= 40) return '🎹 Virtuoso';
    if (level >= 30) return '🎸 Rockstar';
    if (level >= 25) return '🎤 Professional';
    if (level >= 20) return '🎧 DJ Pro';
    if (level >= 15) return '🥁 Beat Expert';
    if (level >= 10) return '🎼 Composer';
    if (level >= 7) return '🎶 Musician';
    if (level >= 5) return '🎵 Intermediate';
    if (level >= 3) return '🎹 Apprentice';
    return '🎵 Beginner';
  },

  // Get user's best score for a scenario
  async getUserBestScore(userId, scenarioId) {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .eq('scenario_id', scenarioId)
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Get global leaderboard
  async getGlobalLeaderboard(limit = 100) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, total_score, level, rank_title, total_beats_created')
      .order('total_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get scenario-specific leaderboard
  async getScenarioLeaderboard(scenarioId, limit = 50) {
    const { data, error } = await supabase
      .from('scores')
      .select(`
        id,
        user_id,
        score,
        accuracy,
        created_at,
        profiles (
          username,
          rank_title
        )
      `)
      .eq('scenario_id', scenarioId)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get user's recent scores
  async getUserRecentScores(userId, limit = 10) {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Increment beats created count
  async incrementBeatsCreated(userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_beats_created')
      .eq('id', userId)
      .single();

    if (profile) {
      await supabase
        .from('profiles')
        .update({
          total_beats_created: (profile.total_beats_created || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    }
  },

  // Increment tutorials completed
  async incrementTutorialsCompleted(userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_tutorials_completed')
      .eq('id', userId)
      .single();

    if (profile) {
      await supabase
        .from('profiles')
        .update({
          total_tutorials_completed: (profile.total_tutorials_completed || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    }
  },

  // Get user's level progress (from scores table)
  async getUserLevelProgress(userId) {
    const { data, error } = await supabase
      .from('scores')
      .select('scenario_id, score, accuracy')
      .eq('user_id', userId);

    if (error) throw error;

    // Convert scores to level progress format
    const progress = {};
    if (data) {
      data.forEach(score => {
        const levelId = score.scenario_id;
        const stars = score.score >= 100 ? 3 : score.score >= 75 ? 2 : score.score >= 50 ? 1 : 0;

        // Keep the best score for each level
        if (!progress[levelId] || progress[levelId].bestScore < score.score) {
          progress[levelId] = {
            completed: score.score >= 100,
            stars: stars,
            bestScore: score.score
          };
        }
      });
    }

    return progress;
  },

  // Save level completion to database
  async saveLevelCompletion(userId, levelId, levelName, score, stars) {
    // Save to scores table
    await this.saveScore(userId, levelId, levelName, score, 100, 100, []);

    return { levelId, score, stars };
  }
};
