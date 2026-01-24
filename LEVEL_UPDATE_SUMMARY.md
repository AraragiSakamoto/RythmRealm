# Level Design Update: Locked Patterns & Playback Control

## 🚀 New Features Added

### 1. Premade "Locked" Patterns
Levels can now define a `premadePattern` that serves as a starter foundation.
- **Behavior**: These notes are pre-loaded when the level starts.
- **Visuals**: Displayed in gray with a 🔒 lock icon.
- **Interaction**: Players cannot delete these notes; they must build *around* them to complete the objective.
- **Implementation**: Applied to Level 1 (First Beat) as a "Rock Pattern" starter.

### 2. Interactive Playback Slider
A new control strip added above the main transport buttons.
- **Seek**: Click anywhere to jump to that step.
- **Progress**: Real-time playhead tracking.
- **Measures**: Visual markers for bars and beats.
- **Counter**: Beat counter display (e.g., "1.3").

### 3. Updated Level 1 Design
- **Objective**: "Continue the rock beat pattern"
- **Requirements**: Minimum 8 notes total (including the 4 locked ones).
- **Goal**: Teaches players to identify and complete a rhythm rather than starting from a blank canvas.

## 👨‍💻 Technical Details

- Modified `view === 'levelPlay'` render block in `app.jsx`.
- Updated grid `onClick` handler to check `currentLevel.premadePattern`.
- Updated Level Selection `onClick` to pre-seed the `grid` state.
- Added css-in-js styling for the new slider component.

## 🎮 How to Test
1. Go to **Levels** screen.
2. Click **Level 1**.
3. Observe the gray kick/snare notes (cannot be clicked).
4. Hit **Play**.
5. Click on the new slider bar to jump around the loop.
