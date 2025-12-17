# Firebase Setup for Osechi Potluck

To enable real-time multiplayer features, you need to connect this app to a Firebase project.

## 1. Create a Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com/).
2. Create a new project (e.g., "osechi-potluck").
3. Enable **Realtime Database** in test mode (or set rules to allow read/write).

## 2. Get Configuration
1. Go to Project Settings > General.
2. Scroll down to "Your apps" and click the Web icon (</>).
3. Register the app and copy the `firebaseConfig` object values.

## 3. Set Environment Variables
Create a file named `.env.local` in the root directory and add your keys:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 4. Restart Server
Run `npm run dev` again to load the environment variables.
