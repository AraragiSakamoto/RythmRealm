const fs = require('fs');
const path = 'C:/Users/Jared A. Cariaso/MusicApp/app.jsx';

let content = fs.readFileSync(path, 'utf8');

// Remove BOM
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}

// Direct text replacements for remaining corrupted emojis
const textReplacements = [
  // Desert
  ['Desert Sunset \u00f0\u0178\u0153\ufe0f', 'Desert Sunset \uD83C\uDFDC\uFE0F'],
  // Lock emoji
  ['\u00f0\u0178\u201d\u201d', '\uD83D\uDD12'],
  // Trophy
  ['\u00f0\u0178\u2020', '\uD83C\uDFC6'],
  // Medal
  ['\u00f0\u0178\u0152\u02dc\ufe0f', '\uD83C\uDF96\uFE0F'],
  // Chart bar
  ['\u00f0\u0178\u201d\u0160', '\uD83D\uDCCA'],
  // CD/disc
  ['\u00f0\u0178\u201d\u20ac', '\uD83D\uDCBF'],
  // Graduation cap
  ['\u00f0\u0178\u0152\u201c', '\uD83C\uDF93'],
  // Smiley
  ['\u00f0\u0178\u02dc\u0160', '\uD83D\uDE0A'],
  // Relaxed
  ['\u00f0\u0178\u02dc\u0152', '\uD83D\uDE0C'],
  // Brightness
  ['\u00f0\u0178\u201d\u2020', '\uD83D\uDD06'],
  // Mic
  ['\u00f0\u0178\u0152\u2122\ufe0f', '\uD83C\uDF99\uFE0F'],
  // Globe
  ['\u00f0\u0178\u0152\u0152', '\uD83C\uDF0D'],
  // Imp/Devil
  ['\u00f0\u0178\u02dc\u02c6', '\uD83D\uDE08'],
  // Heart beating
  ['\u00f0\u0178\u2019\u201c', '\uD83D\uDC93'],
  // Thumbs up
  ['\u00f0\u0178\u2019\u0152', '\uD83D\uDC4D'],
  // Butterfly
  ['\u00f0\u0178\u00a6\u2039', '\uD83E\uDD8B'],
  // Dragon
  ['\u00f0\u0178\u0090\u2030', '\uD83D\uDC09'],
  // Horn
  ['\u00f0\u0178\u201d\u00af', '\uD83D\uDCEF'],
  // Purple heart
  ['\u00f0\u0178\u2019\u0153', '\uD83D\uDC9C'],
];

let fixCount = 0;

for (const [bad, good] of textReplacements) {
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

// Now do hex-based replacements for anything still corrupted
function fixHex(badHex, goodHex) {
  const bad = Buffer.from(badHex, 'hex').toString('utf8');
  const good = Buffer.from(goodHex, 'hex').toString('utf8');
  let count = 0;
  while (content.includes(bad)) {
    content = content.replace(bad, good);
    count++;
  }
  if (count > 0) {
    console.log('Fixed hex ' + count + 'x: ' + good);
    fixCount += count;
  }
}

// Desert emoji
fixHex('c3b0c5b8c28fc5bdefb88f', 'f09f8f9cefb88f');
// Lock
fixHex('c3b0c5b8e2809de28098', 'f09f9492');
// Trophy  
fixHex('c3b0c5b8c28fc286', 'f09f8f86');
// Medal
fixHex('c3b0c5b8c5bde2809cefb88f', 'f09f8e96efb88f');
// Chart
fixHex('c3b0c5b8e2809dc5a0', 'f09f938a');
// Disc
fixHex('c3b0c5b8e2809de282ac', 'f09f92bf');
// Graduation
fixHex('c3b0c5b8c5bde2809c', 'f09f8e93');
// Smiley face
fixHex('c3b0c5b8cb9cc5a0', 'f09f988a');
// Relaxed face
fixHex('c3b0c5b8cb9cc592', 'f09f988c');
// Brightness
fixHex('c3b0c5b8e2809de280a0', 'f09f9486');
// Microphone
fixHex('c3b0c5b8c5bde284a2efb88f', 'f09f8e99efb88f');
// Globe
fixHex('c3b0c5b8c592c592', 'f09f8c8d');
// Imp/devil
fixHex('c3b0c5b8cb9ccb86', 'f09f9888');
// Heart pulse
fixHex('c3b0c5b8e28099e2809c', 'f09f9293');
// Thumbs up (simple)
fixHex('c3b0c5b8e28099c592', 'f09f918d');
// Butterfly
fixHex('c3b0c5b8c2a6e280b9', 'f09fa68b');
// Dragon
fixHex('c3b0c5b8c290e280b0', 'f09f9089');
// Postal horn
fixHex('c3b0c5b8e2809dc2af', 'f09f94ef');
// Purple heart
fixHex('c3b0c5b8e28099c593', 'f09f929c');

fs.writeFileSync(path, '\uFEFF' + content, 'utf8');
console.log('\nTotal: ' + fixCount + ' fixes');
