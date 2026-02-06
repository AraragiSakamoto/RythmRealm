
import { useState, useEffect } from 'react';
import { beatStorageService, scoreService, achievementService } from '../models/supabaseClient';

export const useGameData = (user) => {
    const [savedBeats, setSavedBeats] = useState([]);
    const [levelProgress, setLevelProgress] = useState({});
    const [userAchievements, setUserAchievements] = useState([]);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [achievementsData, setAchievementsData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        // Load local saved beats
        const localSaved = localStorage.getItem('rhythmRealm_savedBeats');
        if (localSaved) {
            try {
                setSavedBeats(JSON.parse(localSaved));
            } catch (e) {
                console.error("Error loading local beats:", e);
            }
        }
        
        // Load achievements metadata
        loadAchievementsMetadata();
        
        // Load level progress from local storage as fallback/initial
        const localProgress = localStorage.getItem('rhythmRealm_levelProgress');
        if (localProgress) {
            try {
                setLevelProgress(JSON.parse(localProgress));
            } catch (e) {}
        }
    }, []);

    // Load user specific data when user changes
    useEffect(() => {
        if (user) {
            loadUserBeats();
            loadUserProgress();
            loadUserAchievements();
        }
    }, [user]);
    
    const loadAchievementsMetadata = async () => {
        const { data } = await achievementService.getAllAchievements();
        if (data) setAchievementsData(data);
    };

    const loadUserBeats = async () => {
        if (!user) return;
        const cloudBeats = await beatStorageService.getUserBeats(user.id);
        if (cloudBeats) {
             const formattedBeats = cloudBeats.map(b => ({
                id: b.id,
                name: b.name,
                date: new Date(b.created_at).toLocaleDateString(),
                grid: b.grid,
                tempo: b.tempo,
                activeInstrumentIds: b.instruments,
                instrumentConfig: b.instrument_config,
                cloudSaved: true,
                favorite: b.favorite || false
            }));
            
            // Merge logic (prefer cloud)
            setSavedBeats(prev => {
                const localOnly = prev.filter(p => !p.cloudSaved && !formattedBeats.some(f => f.name === p.name)); // Simple merge strategy
                const merged = [...formattedBeats, ...localOnly];
                localStorage.setItem('rhythmRealm_savedBeats', JSON.stringify(merged));
                return merged;
            });
        }
    };
    
    const loadUserProgress = async () => {
        if (!user) return;
        const { data } = await scoreService.getUserLevels(user.id);
        if (data) {
            const progress = {};
            data.forEach(l => {
                progress[l.level_id] = { completed: true, score: l.score, accuracy: l.accuracy };
            });
            setLevelProgress(progress);
            localStorage.setItem('rhythmRealm_levelProgress', JSON.stringify(progress));
        }
    };
    
    const loadUserAchievements = async () => {
        if (!user) return;
        const { data } = await achievementService.getUserAchievements(user.id);
        if (data) setUserAchievements(data);
    };

    const saveBeat = async (beat, isPublic = false) => {
        const newBeat = {
            ...beat,
            id: Date.now(), // Temporary ID until cloud save
            date: new Date().toLocaleDateString(),
        };

        if (user) {
            try {
                const saved = await beatStorageService.saveBeat(user.id, {
                    name: beat.name,
                    grid: beat.grid,
                    tempo: beat.tempo,
                    activeInstrumentIds: beat.activeInstrumentIds,
                    instrumentConfig: beat.instrumentConfig,
                    isPublic
                });
                
                newBeat.id = saved.id;
                newBeat.cloudSaved = true;
            } catch (e) {
                console.error("Cloud save failed:", e);
                // Fallback handled by keeping it local
            }
        }
        
        setSavedBeats(prev => {
            const updated = [...prev, newBeat];
            localStorage.setItem('rhythmRealm_savedBeats', JSON.stringify(updated));
            return updated;
        });
        
        return newBeat;
    };

    const deleteBeat = async (beatId) => {
        const beat = savedBeats.find(b => b.id === beatId);
        if (user && beat?.cloudSaved) {
            await beatStorageService.deleteBeat(beatId, user.id);
        }
        
        setSavedBeats(prev => {
            const updated = prev.filter(b => b.id !== beatId);
            localStorage.setItem('rhythmRealm_savedBeats', JSON.stringify(updated));
            return updated;
        });
    };
    
    const completeLevel = async (levelId, score, accuracy) => {
        // Update local state
        const newProgress = { ...levelProgress, [levelId]: { completed: true, score, accuracy } };
        setLevelProgress(newProgress);
        localStorage.setItem('rhythmRealm_levelProgress', JSON.stringify(newProgress));
        
        if (user) {
            await scoreService.submitScore(user.id, levelId, score, accuracy);
            // Refresh user profile/stats could be triggered here or by caller
        }
    };
    
    // Check and unlock achievements
    const checkAchievements = async (type, value) => {
        if (!user) return null;
        const { newUnlock } = await achievementService.checkAndUnlock(user.id, type, value);
        if (newUnlock) {
            loadUserAchievements(); // Refresh list
            return newUnlock;
        }
        return null;
    };

    return {
        savedBeats,
        levelProgress,
        userAchievements,
        achievementsData,
        leaderboardData,
        loading,
        saveBeat,
        deleteBeat,
        completeLevel,
        checkAchievements,
        loadUserBeats
    };
};
