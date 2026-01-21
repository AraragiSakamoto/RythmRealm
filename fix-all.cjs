const fs = require('fs');
const path = 'C:/Users/Jared A. Cariaso/MusicApp/app.jsx';

let content = fs.readFileSync(path, 'utf8');

// Remove BOM
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}

// Fix the LANGUAGES section by finding and replacing the whole block
const langStart = content.indexOf('const LANGUAGES = {');
const langEnd = content.indexOf('};', langStart) + 2;

if (langStart !== -1 && langEnd !== -1) {
  const newLangs = `const LANGUAGES = {
    en: { code: 'en-US', name: 'English', flag: 'US' },
    es: { code: 'es-ES', name: 'Espa\u00f1ol', flag: 'ES' },
    fr: { code: 'fr-FR', name: 'Fran\u00e7ais', flag: 'FR' },
    de: { code: 'de-DE', name: 'Deutsch', flag: 'DE' },
    it: { code: 'it-IT', name: 'Italiano', flag: 'IT' },
    pt: { code: 'pt-BR', name: 'Portugu\u00eas', flag: 'BR' },
    ja: { code: 'ja-JP', name: '\u65e5\u672c\u8a9e', flag: 'JP' },
    ko: { code: 'ko-KR', name: '\ud55c\uad6d\uc5b4', flag: 'KR' },
    zh: { code: 'zh-CN', name: '\u4e2d\u6587', flag: 'CN' },
    tl: { code: 'fil-PH', name: 'Tagalog', flag: 'PH' },
    hi: { code: 'hi-IN', name: 'Hindi', flag: 'IN' },
    ar: { code: 'ar-SA', name: 'Arabic', flag: 'SA' },
  }`;
  
  content = content.substring(0, langStart) + newLangs + content.substring(langEnd);
  console.log('Fixed LANGUAGES block');
}

// Now fix common corrupted emoji patterns using hex replacement
function fixHex(badHex, goodHex) {
  const bad = Buffer.from(badHex, 'hex').toString('utf8');
  const good = Buffer.from(goodHex, 'hex').toString('utf8');
  let count = 0;
  while (content.includes(bad)) {
    content = content.replace(bad, good);
    count++;
  }
  if (count > 0) console.log('Fixed ' + count + 'x: ' + good);
}

// Fix remaining corrupted emojis
// Point up finger
fixHex('c3b0c5b8e28098c286', 'f09f9186');
// Clap
fixHex('c3b0c5b8e28098c28f', 'f09f918f');
// Fist
fixHex('c3b0c5b8e28098c28a', 'f09f918a');
// Running shoe
fixHex('c3b0c5b8e28098c29f', 'f09f919f');
// Dancer
fixHex('c3b0c5b8e28099c283', 'f09f9283');
// Man dancing
fixHex('c3b0c5b8e2809cc2ba', 'f09f9582');
// Robot
fixHex('c3b0c5b8c2a4e2809c', 'f09fa496');
// Disc/CD
fixHex('c3b0c5b8e2809ce280b0', 'f09f93bf');
// Desert
fixHex('c3b0c5b8c28fc5bd', 'f09f8f9c');
// House
fixHex('c3b0c5b8c28fc2a0', 'f09f8fa0');
// Game controller
fixHex('c3b0c5b8c5bdc2ae', 'f09f8eae');
// Keyboard music
fixHex('c3b0c5b8c5bdc2b9', 'f09f8eb9');
// Guitar
fixHex('c3b0c5b8c5bdc2b8', 'f09f8eb8');
// Microphone
fixHex('c3b0c5b8c5bdc2a4', 'f09f8ea4');
// Headphones  
fixHex('c3b0c5b8c5bdc2a7', 'f09f8ea7');
// Music note
fixHex('c3b0c5b8c5bdc2b5', 'f09f8eb5');
// Notes
fixHex('c3b0c5b8c5bdc2b6', 'f09f8eb6');
// Level slider
fixHex('c3b0c5b8c5bdc5a1', 'f09f8e9a');
// Control knobs
fixHex('c3b0c5b8c5bdc5b8', 'f09f8e9b');
// Graduation cap
fixHex('c3b0c5b8c5bdc2a0', 'f09f8e93');
// Paint palette
fixHex('c3b0c5b8c5bdc2a8', 'f09f8ea8');
// Party
fixHex('c3b0c5b8c5bdc289', 'f09f8e89');
// Moon
fixHex('c3b0c5b8c592e284a2', 'f09f8c99');
// Leaves
fixHex('c3b0c5b8c692c28f', 'f09f8d83');
// Eagle
fixHex('c3b0c5b8c2a6c285', 'f09fa685');
// Banjo
fixHex('c3b0c5b8c2aae28094', 'f09faa95');
// Book
fixHex('c3b0c5b8e2809cc5a1', 'f09f939a');
// Megaphone/horn
fixHex('c3b0c5b8e2809dc2a3', 'f09f93e3');
// Loudspeaker
fixHex('c3b0c5b8e2809dc28a', 'f09f948a');
// Chart decreasing (for decay)
fixHex('c3b0c5b8e2809ce28098', 'f09f93c9');
// Shield (for reverb)  
fixHex('c3b0c5b8c5a2c2a1', 'f09f9ba1');

// Symbol fixes
// Keyboard
fixHex('c3a2c28cc2a8', 'e28ca8');
// Wheelchair
fixHex('c3a2c299c2bf', 'e299bf');
// Timer
fixHex('c3a2c2b1', 'e2b1');
// Plus sign
fixHex('c3a2c29e', 'e29e95');
// Check mark
fixHex('c3a2c593c294', 'e29c94');
// X mark  
fixHex('c3a2c593c295', 'e29c95');
// Star
fixHex('c3a2c2adcb86', 'e2ad90');
// Lightning
fixHex('c3a2c5a1c2a1', 'e29aa1');
// Arrows
fixHex('c3a2c286c294', 'e28694');
// Rewind
fixHex('c3a2c2aa', 'e2aa');
// Sparkles
fixHex('c3a2c593c2a8', 'e29ca8');
// Info
fixHex('c3a2c284c2b9', 'e28489');

// Write with BOM
fs.writeFileSync(path, '\uFEFF' + content, 'utf8');
console.log('\nFile saved!');
