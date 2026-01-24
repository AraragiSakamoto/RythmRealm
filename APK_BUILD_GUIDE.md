# Building an APK for Rhythm Realm Music App

This guide provides a complete step-by-step process to build an Android APK from this web application using Capacitor.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required Software
1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Java Development Kit (JDK)** (version 11 or higher)
   - Download from: https://adoptium.net/
   - Verify installation: `java -version`
   - Set JAVA_HOME environment variable

4. **Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API level 33 or higher recommended)
   - Set ANDROID_HOME environment variable

### Environment Variables Setup (Windows)

1. **JAVA_HOME**:
   - Right-click "This PC" → Properties → Advanced System Settings → Environment Variables
   - Add new System Variable:
     - Name: `JAVA_HOME`
     - Value: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x` (your JDK path)

2. **ANDROID_HOME**:
   - Add new System Variable:
     - Name: `ANDROID_HOME`
     - Value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`

3. **PATH**:
   - Add to Path:
     - `%JAVA_HOME%\bin`
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\tools`

---

## Step-by-Step Build Process

### Step 1: Install Project Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This installs all required packages including React, Vite, Capacitor, and dependencies.

---

### Step 2: Build the Web Application

Build the optimized production version of your web app:

```bash
npm run build
```

This creates a `dist` folder with your compiled web assets.

**What happens**: Vite bundles your React app, optimizes assets, and creates production-ready files.

---

### Step 3: Initialize Capacitor (if not already done)

If this is your first time building, initialize Capacitor:

```bash
npx cap init
```

You'll be prompted for:
- **App name**: Rhythm Realm (or your preferred name)
- **App ID**: com.rhythmrealm.app (reverse domain notation)
- **Web asset directory**: dist (already configured in capacitor.config.json)

**Note**: This project is already initialized, so you can skip this if `capacitor.config.json` exists.

---

### Step 4: Add Android Platform

Add the Android platform to your project:

```bash
npx cap add android
```

This creates an `android` folder with a complete Android Studio project.

**What happens**: Capacitor generates native Android project files and links them to your web app.

---

### Step 5: Sync Web Assets to Android

Sync your built web app to the Android project:

```bash
npx cap sync
```

This copies files from `dist` to `android/app/src/main/assets/public`.

**Important**: Run this command every time you rebuild your web app!

---

### Step 6: Configure Android Manifest (Optional but Recommended)

#### Enable Landscape Orientation

Edit `android/app/src/main/AndroidManifest.xml`:

Find the `<activity>` tag for MainActivity and add:

```xml
<activity
    android:name=".MainActivity"
    android:screenOrientation="landscape"
    android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
    ...>
```

#### Set App Permissions

Add any required permissions before the `<application>` tag:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.VIBRATE" />
```

---

### Step 7: Build the APK

You have two options:

#### Option A: Using Android Studio (Recommended for beginners)

1. Open Android Studio:
   ```bash
   npx cap open android
   ```

2. Wait for Gradle sync to complete (first time takes several minutes)

3. Build the APK:
   - Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Or use the toolbar: Click the hammer icon 🔨

4. Find your APK:
   - Location: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Android Studio will show a notification with "locate" link

#### Option B: Using Command Line (Faster for experienced users)

1. Navigate to android folder:
   ```bash
   cd android
   ```

2. Build debug APK:
   ```bash
   ./gradlew assembleDebug
   ```
   
   On Windows (if gradlew.bat exists):
   ```bash
   gradlew.bat assembleDebug
   ```

3. Find your APK:
   - Location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

### Step 8: Install APK on Device

#### Via USB (ADB)

1. Enable Developer Options on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times

2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging

3. Connect device via USB

4. Install APK:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

#### Via File Transfer

1. Copy `app-debug.apk` to your phone
2. Open the file on your device
3. Allow installation from unknown sources if prompted
4. Tap "Install"

---

## Building a Release APK (For Production)

### Step 1: Generate a Signing Key

```bash
keytool -genkey -v -keystore rhythm-realm-release.keystore -alias rhythm-realm -keyalg RSA -keysize 2048 -validity 10000
```

Follow the prompts and **remember your passwords**!

### Step 2: Configure Gradle Signing

Create `android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=rhythm-realm
storeFile=../rhythm-realm-release.keystore
```

Edit `android/app/build.gradle`, add before `android {`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Inside `android {`, add:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### Step 3: Build Release APK

```bash
cd android
./gradlew assembleRelease
```

Find at: `android/app/build/outputs/apk/release/app-release.apk`

---

## Troubleshooting

### Common Issues

**1. "JAVA_HOME is not set"**
- Solution: Set JAVA_HOME environment variable (see Prerequisites)

**2. "SDK location not found"**
- Solution: Create `android/local.properties`:
  ```
  sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
  ```

**3. "Gradle build failed"**
- Solution: Update Gradle wrapper:
  ```bash
  cd android
  ./gradlew wrapper --gradle-version 8.0
  ```

**4. "App crashes on launch"**
- Check: Did you run `npm run build` and `npx cap sync`?
- Check: Are there any console errors in Android Studio Logcat?

**5. "White screen on app launch"**
- Solution: Verify `capacitor.config.json` has correct `webDir: "dist"`
- Rebuild: `npm run build && npx cap sync`

---

## Quick Reference Commands

```bash
# Full build workflow
npm install                    # Install dependencies
npm run build                  # Build web app
npx cap sync                   # Sync to Android
npx cap open android           # Open in Android Studio

# Or build via command line
cd android
./gradlew assembleDebug        # Build debug APK
./gradlew assembleRelease      # Build release APK

# Install on connected device
adb install app-debug.apk
```

---

## File Locations Reference

- **Web build output**: `dist/`
- **Android project**: `android/`
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **Android Manifest**: `android/app/src/main/AndroidManifest.xml`
- **App Icons**: `android/app/src/main/res/mipmap-*/`

---

## Next Steps

1. **Test thoroughly** on multiple devices
2. **Optimize app size** by enabling minification in release builds
3. **Add app icons** in `android/app/src/main/res/`
4. **Publish to Google Play Store** (requires Google Play Console account)

---

## Additional Resources

- Capacitor Documentation: https://capacitorjs.com/docs
- Android Developer Guide: https://developer.android.com/guide
- Vite Documentation: https://vitejs.dev/guide/

---

**Last Updated**: January 2026
**App Version**: 1.0.0
