# Build Android APK (Capacitor)

This project is a Vite + React PWA. The repository already includes a manifest and service worker.

Prerequisites (on your machine):
- Node.js (v18+ recommended)
- npm
- Java JDK (11+)
- Android SDK and Android Studio (or command-line sdk/gradle tools)

Quick steps to produce an Android APK locally:

1. Install dependencies

```bash
npm install
```

2. Build the web assets

```bash
npm run build:web
```

3. Install Capacitor CLI (if not present) and add Android

```bash
npx cap init
# or if already initialized, continue
npx cap add android
```

4. Sync web assets into the native project

```bash
npx cap sync
```

5. Open Android Studio (recommended) or build from command line

```bash
npx cap open android
```

- In Android Studio: Open the project, let it index, then select `Build > Generate Signed Bundle / APK...` and follow the wizard.
- From command line (requires Android SDK & Gradle):

```bash
cd android
./gradlew assembleRelease
# APK will be in android/app/build/outputs/apk/release/
```

Notes:
- Capacitor needs `capacitor.config.json` with `webDir` pointing to the Vite `dist` folder. That file is included in the repo.
- If you want to support Android deep links, status bar, or permissions, configure `AndroidManifest.xml` in the `android/app/src/main/AndroidManifest.xml` file after adding the Android platform.
- Building on CI requires installing Android SDK and configuring `ANDROID_HOME` and related environment variables.

If you want, I can:
- Scaffold the Capacitor Android project here (requires `npx cap add android` which will run locally in this environment), but building an actual APK requires Android SDK which isn't available in this execution environment.
- Or I can prepare a minimal GitHub Actions workflow to build the APK in CI using an Android runner.

Tell me which option you prefer.
