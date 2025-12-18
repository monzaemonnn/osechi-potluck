# Firebase Setup Guide 🔥

## 1. Setting up Authentication (Google Sign-In)
To make the "Sign In" button work, you need to enable it in your Firebase Console.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Open your project (**osechi-potluck**).
3.  In the left sidebar, click **Build** -> **Authentication**.
4.  Click **Get started** (if you haven't already).
5.  Click the **Sign-in method** tab.
6.  Click **Add new provider** and select **Google**.
7.  Toggle the **Enable** switch in the top right.
8.  Enter a **Project support email** (select your email).
9.  Click **Save**.

### ⚠️ Important: Authorized Domains
If you are testing on `localhost`, it should work automatically.
If you deploy to **Netlify** or **Vercel**, you MUST add your domain here:
1.  Go to **Authentication** -> **Settings** -> **Authorized domains**.
2.  Click **Add domain**.
3.  Enter your app's URL (e.g., `my-osechi-app.netlify.app`).

---

## 2. Realtime Database vs. Firestore
You asked: *"I have a realtime database? What's the difference from firebase database?"*

Firebase actually has **two** databases. Confusion is common!

### A. Realtime Database (We are using this! ✅)
*   **What it is**: A giant JSON tree synced in real-time.
*   **Best for**: "Presence" (who is online), simple chats, and **collaborative apps** like our Osechi box where everyone needs to see updates instantly.
*   **Why we chose it**: It's simpler and faster for syncing the 27 slots in our box.

### B. Cloud Firestore (The "New" Database)
*   **What it is**: A scalable NoSQL document database (Collections & Documents).
*   **Best for**: Complex queries, user profiles, huge data sets (like an e-commerce catalog).
*   **Why not?**: It's overkill for our simple potluck.

**Note:** In your code (`src/lib/firebase.ts`), `getDatabase(app)` connects specifically to the **Realtime Database**. If we wanted the other one, we would have used `getFirestore(app)`.
