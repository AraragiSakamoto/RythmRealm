const fs = require('fs');
const path = 'C:/Users/Jared A. Cariaso/MusicApp/app.jsx';

let content = fs.readFileSync(path, 'utf8');

// Remove BOM if present
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}

// Create replacement from hex codes
function hex(badHex, goodHex) {
  const bad = Buffer.from(badHex, 'hex').toString('utf8');
  const good = Buffer.from(goodHex, 'hex').toString('utf8');
  return [bad, good];
}

const replacements = [
  // Country Flags - each flag is 2 regional indicators
  // US flag
  hex('c3b0c5b8c2a1c2bac3b0c5b8c2a1c2b8', 'f09f87baf09f87b8'),
  // Spain ES  
  hex('c3b0c5b8c2a1c2aac3b0c5b8c2a1c2b8', 'f09f87aaf09f87b8'),
  // France FR
  hex('c3b0c5b8c2a1c2abc3b0c5b8c2a1c2b7', 'f09f87abf09f87b7'),
  // Germany DE
  hex('c3b0c5b8c2a1c2a9c3b0c5b8c2a1c2aa', 'f09f87a9f09f87aa'),
  // Italy IT
  hex('c3b0c5b8c2a1c2aec3b0c5b8c2a1c2b9', 'f09f87aef09f87b9'),
  // Brazil BR
  hex('c3b0c5b8c2a1c2a7c3b0c5b8c2a1c2b7', 'f09f87a7f09f87b7'),
  // Japan JP
  hex('c3b0c5b8c2a1c2afc3b0c5b8c2a1c2b5', 'f09f87aff09f87b5'),
  // Korea KR
  hex('c3b0c5b8c2a1c2b0c3b0c5b8c2a1c2b7', 'f09f87b0f09f87b7'),
  // China CN
  hex('c3b0c5b8c2a1c2a8c3b0c5b8c2a1c2b3', 'f09f87a8f09f87b3'),
  // Philippines PH
  hex('c3b0c5b8c2a1c2b5c3b0c5b8c2a1c2ad', 'f09f87b5f09f87ad'),
  // India IN
  hex('c3b0c5b8c2a1c2aec3b0c5b8c2a1c2b3', 'f09f87aef09f87b3'),
  // Saudi Arabia SA
  hex('c3b0c5b8c2a1c2b8c3b0c5b8c2a1c2a6', 'f09f87b8f09f87a6'),
  
  // Spanish name: Espanol with tilde
  hex('457370614ec3b14e6f6c', '457370616e6f6c'), // Basic fix
  
  // More language name fixes
  ['EspaÃ±ol', 'Espanol'],
  ['FranÃ§ais', 'Francais'],  
  ['PortuguÃªs', 'Portugues'],
  
  // Broken Asian text - replace with romanized versions for now
  ['æ—¥æœ¬èªž', 'Nihongo'],
  ['í•œêµ­ì–´', 'Hangugeo'],
  ['ä¸­æ–‡', 'Zhongwen'],
  ['à¤¹à¤¿à¤¨à¥à¤¦à¥€', 'Hindi'],
  ['Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©', 'Arabiya'],
  
  // Common emoji patterns
  hex('c3b0c5b8e2809ce280b0', 'f09f93b0'), // corrupted disc pattern
  hex('c3b0c5b8c28fc5bdefb88f', 'f09f8f9cefb88f'), // desert
  hex('c3b0c5b8e28098c286', 'f09f9186'), // point up
  hex('c3b0c5b8e28098c28f', 'f09f918f'), // clap
  hex('c3b0c5b8e28098c28a', 'f09f918a'), // fist
  hex('c3b0c5b8e28098c29f', 'f09f919f'), // shoe
  hex('c3b0c5b8e28099c283', 'f09f9283'), // dancer
  hex('c3b0c5b8e2809cc2ba', 'f09f9582'), // man dancing
  hex('c3b0c5b8c2a4e2809c', 'f09fa496'), // robot
  
  // Keyboard emoji
  hex('c3a2c28cc2a8efb88f', 'e28ca8efb88f'), // keyboard
  
  // Accessibility symbol
  hex('c3a2c299c2bf', 'e299bf'), // wheelchair
  
  // Info symbol
  hex('c3a2c284c2b9', 'e28489'), // info
  
  // Check and X marks
  hex('c3a2c593c294', 'e29c94'), // checkmark
  hex('c3a2c593c295', 'e29c95'), // x mark
  
  // Sparkles
  hex('c3a2c593c2a8', 'e29ca8'), // sparkles
  
  // Star
  hex('c3a2c2adcb86', 'e2ad90'), // star
  
  // Lightning
  hex('c3a2c5a1c2a1', 'e29aa1'), // lightning
  
  // Arrows
  hex('c3a2c286c294', 'e28694'), // left-right arrow
  hex('c3a2c286c2a9', 'e286a9'), // return arrow
  
  // Rewind
  hex('c3a2c2aac2aa', 'e2aa'), // rewind
  
  // Timer
  hex('c3a2c2b1efb88f', 'e2b1efb88f'), // timer
];

let fixCount = 0;

for (const [bad, good] of replacements) {
  if (!bad || !good) continue;
  let count = 0;
  while (content.includes(bad)) {
    content = content.replace(bad, good);
    count++;
  }
  if (count > 0) {
    console.log('Fixed ' + count + 'x: ' + good);
    fixCount += count;
  }
}

// Write with BOM
fs.writeFileSync(path, '\uFEFF' + content, 'utf8');
console.log('\nTotal: ' + fixCount + ' fixes applied');
