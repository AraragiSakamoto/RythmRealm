
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
  const premade = level.premadePattern || {};

  let passed = true;
  let score = 0;
  let totalCriteria = 0;

  if (mustInclude) {
    Object.entries(mustInclude).forEach(([instType, count]) => {
      totalCriteria++;

      // Calculate active notes (User + Premade)
      let currentTotal = 0;
      Object.keys(grid).forEach(trackId => {
        if (trackId.startsWith(instType)) {
          currentTotal += grid[trackId]?.filter(Boolean).length || 0;
        }
      });

      // Calculate Premade notes for this instrument type
      let premadeCount = 0;
      if (premade[instType]) {
        // If premade is [0, 8] (array of steps)
        if (Array.isArray(premade[instType])) {
          premadeCount = premade[instType].length;
        }
      }

      // Target to be Added by User = Total Required - Premade
      // If result is negative, it means premade already covers it (shouldn't happen in good design), treat as 0 needed.
      const targetAdded = Math.max(0, count - premadeCount);

      // Notes Added by User = Current Total - Premade Total
      // (Clamp at 0 in case user deleted premade notes)
      const userAdded = Math.max(0, currentTotal - premadeCount);

      // If no notes need to be added for this instrument, it passes automatically
      if (targetAdded === 0) {
        score++;
      } else {
        if (userAdded >= targetAdded) {
          score++;
        } else {
          passed = false;
            score += (userAdded / targetAdded);
          }
      }
    });
  }
  
  const finalScore = totalCriteria === 0 ? 100 : Math.round((score / totalCriteria) * 100);
  // Ensure we don't accidentally exceed 100 or drop below 0
  const clampedScore = Math.max(0, Math.min(100, finalScore));

  return { score: clampedScore, completed: passed && clampedScore === 100 };
};
