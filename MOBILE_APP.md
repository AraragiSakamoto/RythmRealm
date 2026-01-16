# Rhythm Realm - Mobile App Setup

Your app is now configured as a **Progressive Web App (PWA)**! 

## How to Install on Mobile

### On iPhone/iPad (iOS):
1. Open Safari and go to your app URL
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it "Rhythm Realm" and tap **Add**

### On Android:
1. Open Chrome and go to your app URL
2. You'll see a popup saying "Add to Home Screen" - tap **Install**
3. Or tap the **three dots menu** → **"Install app"** or **"Add to Home Screen"**

## Testing on Mobile

### Option 1: Same WiFi Network
1. Run `npm run dev` on your computer
2. Find your computer's local IP address:
   - Windows: Open CMD and type `ipconfig` (look for IPv4 Address)
   - It will look like `192.168.1.XXX`
3. On your phone, open browser and go to: `http://192.168.1.XXX:5173`

### Option 2: Deploy Online
Deploy to Vercel, Netlify, or GitHub Pages for a public URL:

```bash
# Build the app
npm run build

# Deploy to Vercel (if you have Vercel CLI)
npx vercel

# Or deploy to Netlify
npx netlify deploy --prod --dir=dist
```

## Generate App Icons

To generate proper PNG icons from the SVG, you can use an online tool:
1. Go to https://realfavicongenerator.net/
2. Upload the SVG from `public/icons/icon.svg`
3. Download the generated icons
4. Place them in the `public/icons/` folder

Or use this Node.js script (requires `sharp` package):
```bash
npm install sharp
node generate-icons.js
```

## Features

✅ **Installable** - Add to home screen on any device
✅ **Offline Support** - Works without internet after first load
✅ **Full Screen** - No browser UI when launched from home screen
✅ **Native Feel** - Smooth touch interactions, no text selection
✅ **Safe Areas** - Supports notched phones (iPhone X+, etc.)

## Native App Alternative (Capacitor)

If you want to publish to the App Store or Play Store:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "Rhythm Realm" "com.rhythmrealm.app"

# Add platforms
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# Build and sync
npm run build
npx cap sync

# Open in Xcode/Android Studio
npx cap open ios
npx cap open android
```

This will wrap your web app in a native container!
