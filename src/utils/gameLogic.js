
import { GAME_LEVELS } from './constants';

export const getUnlockedLevels = (levelProgress) => {
  return GAME_LEVELS.map(level => {
    // Level 1 is always unlocked. Others depend on previous level completion.
    const isUnlocked = level.id === 1 || (levelProgress && levelProgress[level.id - 1]?.completed);
    return { ...level, unlocked: isUnlocked };
  });
};

export const checkLevelCompletion = (grid, level) => {
  if (!level || !level.requirements) return { score: 100, completed: true };

  const { mustInclude } = level.requirements;
  let passed = true;
  let score = 0;
  let totalCriteria = 0;

  if (mustInclude) {
    Object.entries(mustInclude).forEach(([instType, count]) => {
      totalCriteria++;
      // Aggregate notes from all tracks of this type (e.g., 'kick-1', 'kick-2' for 'kick')
      let current = 0;
      Object.keys(grid).forEach(trackId => {
        if (trackId.startsWith(instType)) {
          current += grid[trackId]?.filter(Boolean).length || 0;
        }
      });

      if (current >= count) {
        score++;
      } else {
        passed = false;
        // Partial score
        score += (current / count); 
      }
    });
  }
  
  const finalScore = totalCriteria === 0 ? 100 : Math.round((score / totalCriteria) * 100);
  return { score: finalScore, completed: passed && finalScore === 100 };
};
