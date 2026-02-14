import { supabase } from './supabaseClient';
import { ScoreModel } from './ScoreModel';

export const ACHIEVEMENTS = [
  // Beginner achievements
  { id: 'first_beat', name: 'First Beat', description: 'Create your first beat', icon: '🎵', xp: 50, category: 'beginner' },
  { id: 'first_play', name: 'Press Play', description: 'Play a beat for the first time', icon: '▶️', xp: 25, category: 'beginner' },
  { id: 'first_tutorial', name: 'Student', description: 'Complete your first tutorial', icon: '📚', xp: 100, category: 'beginner' },
  { id: 'first_level', name: 'Level Up!', description: 'Complete your first level', icon: '🎮', xp: 75, category: 'beginner' },

  // Level achievements
  { id: 'level_5', name: 'Rising Rhythm', description: 'Complete 5 levels', icon: '📈', xp: 200, category: 'level' },
  { id: 'level_all', name: 'Level Master', description: 'Complete all 10 levels', icon: '🏆', xp: 1000, category: 'level' },
  { id: 'perfect_level', name: 'Flawless', description: 'Get 3 stars on any level', icon: '⭐', xp: 150, category: 'level' },

  // Creation achievements
  { id: 'beat_creator_10', name: 'Beat Creator', description: 'Create 10 beats', icon: '🥁', xp: 200, category: 'creation' },
  { id: 'beat_creator_50', name: 'Beat Master', description: 'Create 50 beats', icon: '🎹', xp: 500, category: 'creation' },
  { id: 'beat_creator_100', name: 'Prolific Producer', description: 'Create 100 beats', icon: '🎼', xp: 1000, category: 'creation' },

  // Tutorial achievements
  { id: 'tutorial_5', name: 'Quick Learner', description: 'Complete 5 tutorials', icon: '🎓', xp: 250, category: 'tutorial' },
  { id: 'tutorial_all', name: 'Master Student', description: 'Complete all tutorials', icon: '🏆', xp: 1000, category: 'tutorial' },

  // Score achievements
  { id: 'perfect_score', name: 'Perfectionist', description: 'Get 100% accuracy on a tutorial', icon: '💯', xp: 300, category: 'score' },
  { id: 'score_1000', name: 'Thousand Club', description: 'Reach 1,000 total score', icon: '🌟', xp: 200, category: 'score' },
  { id: 'score_10000', name: 'Score Champion', description: 'Reach 10,000 total score', icon: '⭐', xp: 500, category: 'score' },
  { id: 'score_100000', name: 'Rhythm Legend', description: 'Reach 100,000 total score', icon: '🌠', xp: 2000, category: 'score' },

  // Instrument achievements
  { id: 'use_all_instruments', name: 'Full Orchestra', description: 'Use all 12 instruments in a single beat', icon: '🎻', xp: 400, category: 'instrument' },
  { id: 'drum_master', name: 'Drum Master', description: 'Create 20 beats using only drums', icon: '🥁', xp: 300, category: 'instrument' },
  { id: 'synth_wizard', name: 'Synth Wizard', description: 'Create 20 beats using synth', icon: '🎹', xp: 300, category: 'instrument' },

  // Tempo achievements
  { id: 'speed_demon', name: 'Speed Demon', description: 'Create a beat at 180+ BPM', icon: '⚡', xp: 200, category: 'tempo' },
  { id: 'slow_groove', name: 'Slow Groove', description: 'Create a beat at 60 BPM or slower', icon: '🐌', xp: 150, category: 'tempo' },

  // Genre achievements
  { id: 'genre_explorer', name: 'Genre Explorer', description: 'Complete tutorials from 5 different genres', icon: '🗺️', xp: 500, category: 'genre' },
  { id: 'genre_master', name: 'Genre Master', description: 'Get 100% on tutorials from all genres', icon: '🎭', xp: 1500, category: 'genre' },

  // Social/Leaderboard achievements
  { id: 'top_100', name: 'Rising Star', description: 'Reach top 100 on the global leaderboard', icon: '📈', xp: 500, category: 'social' },
  { id: 'top_10', name: 'Elite Performer', description: 'Reach top 10 on the global leaderboard', icon: '🔥', xp: 1000, category: 'social' },
  { id: 'top_1', name: 'Rhythm Champion', description: 'Reach #1 on the global leaderboard', icon: '👑', xp: 2000, category: 'social' },

  // Streak achievements
  { id: 'streak_7', name: 'Week Warrior', description: 'Play for 7 days in a row', icon: '📅', xp: 300, category: 'streak' },
  { id: 'streak_30', name: 'Month Master', description: 'Play for 30 days in a row', icon: '🗓️', xp: 1000, category: 'streak' },

  // Special achievements
  { id: 'night_owl', name: 'Night Owl', description: 'Create a beat after midnight', icon: '🦉', xp: 100, category: 'special' },
  { id: 'early_bird', name: 'Early Bird', description: 'Create a beat before 6 AM', icon: '🐦', xp: 100, category: 'special' },
  { id: 'dj_debut', name: 'DJ Debut', description: 'Use DJ Mode for the first time', icon: '🎧', xp: 150, category: 'special' },
];

export const AchievementModel = {
  // Get user's achievements
  async getUserAchievements(userId) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  // Unlock an achievement
  async unlockAchievement(userId, achievementId) {
    // Check if already unlocked
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    if (existing) return null; // Already unlocked

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return null;

    // Unlock the achievement
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Add XP for the achievement
    const { data: profile } = await supabase
      .from('profiles')
      .select('experience_points, level')
      .eq('id', userId)
      .single();

    if (profile) {
      const newXP = (profile.experience_points || 0) + achievement.xp;
      const newLevel = Math.floor(newXP / 1000) + 1;
      const rankTitle = ScoreModel.getRankTitle(newLevel);

      await supabase
        .from('profiles')
        .update({
          experience_points: newXP,
          level: newLevel,
          rank_title: rankTitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    }

    return { achievement, data };
  },

  // Check and unlock achievements based on conditions
  async checkAchievements(userId, stats) {
    const unlockedAchievements = [];
    const userAchievements = await this.getUserAchievements(userId);
    const unlockedIds = new Set(userAchievements.map(a => a.achievement_id));

    // Check each achievement condition
    const checkAndUnlock = async (id, condition) => {
      if (!unlockedIds.has(id) && condition) {
        try {
          const result = await this.unlockAchievement(userId, id);
          if (result && result.achievement) {
            unlockedAchievements.push(result.achievement);
          }
        } catch (e) {
          console.log('Failed to unlock achievement:', id, e);
        }
      }
    };

    // Beginner achievements
    await checkAndUnlock('first_beat', stats.totalBeatsCreated >= 1);
    await checkAndUnlock('first_play', stats.hasPlayed);
    await checkAndUnlock('first_tutorial', stats.tutorialsCompleted >= 1);
    await checkAndUnlock('first_level', stats.levelsCompleted >= 1);

    // Level achievements
    await checkAndUnlock('level_5', stats.levelsCompleted >= 5);
    await checkAndUnlock('level_all', stats.levelsCompleted >= 10);
    await checkAndUnlock('perfect_level', stats.threeStarLevels >= 1);

    // Creation achievements
    await checkAndUnlock('beat_creator_10', stats.totalBeatsCreated >= 10);
    await checkAndUnlock('beat_creator_50', stats.totalBeatsCreated >= 50);
    await checkAndUnlock('beat_creator_100', stats.totalBeatsCreated >= 100);

    // Tutorial achievements
    await checkAndUnlock('tutorial_5', stats.tutorialsCompleted >= 5);
    await checkAndUnlock('tutorial_all', stats.tutorialsCompleted >= 10);

    // Score achievements
    await checkAndUnlock('perfect_score', stats.accuracy === 100);
    await checkAndUnlock('score_1000', stats.totalScore >= 1000);
    await checkAndUnlock('score_10000', stats.totalScore >= 10000);
    await checkAndUnlock('score_100000', stats.totalScore >= 100000);

    // Instrument achievements
    await checkAndUnlock('use_all_instruments', stats.instrumentsUsed >= 12);

    // Tempo achievements
    await checkAndUnlock('speed_demon', stats.tempo >= 180);
    await checkAndUnlock('slow_groove', stats.tempo <= 60);

    // Time-based achievements
    const hour = new Date().getHours();
    await checkAndUnlock('night_owl', hour >= 0 && hour < 5);
    await checkAndUnlock('early_bird', hour >= 4 && hour < 6);

    // DJ Mode achievement
    await checkAndUnlock('dj_debut', stats.usedDJMode);

    // Leaderboard achievements
    if (stats.leaderboardRank) {
      await checkAndUnlock('top_100', stats.leaderboardRank <= 100);
      await checkAndUnlock('top_10', stats.leaderboardRank <= 10);
      await checkAndUnlock('top_1', stats.leaderboardRank === 1);
    }

    return unlockedAchievements;
  },

  // Get achievement progress
  getAchievementProgress(achievementId, stats) {
    switch (achievementId) {
      case 'beat_creator_10': return { current: stats.totalBeatsCreated, target: 10 };
      case 'beat_creator_50': return { current: stats.totalBeatsCreated, target: 50 };
      case 'beat_creator_100': return { current: stats.totalBeatsCreated, target: 100 };
      case 'tutorial_5': return { current: stats.tutorialsCompleted, target: 5 };
      case 'tutorial_all': return { current: stats.tutorialsCompleted, target: 10 };
      case 'score_1000': return { current: stats.totalScore, target: 1000 };
      case 'score_10000': return { current: stats.totalScore, target: 10000 };
      case 'score_100000': return { current: stats.totalScore, target: 100000 };
      case 'streak_7': return { current: stats.currentStreak, target: 7 };
      case 'streak_30': return { current: stats.currentStreak, target: 30 };
      default: return null;
    }
  }
};
