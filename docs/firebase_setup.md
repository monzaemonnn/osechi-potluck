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

---

## 3. Security Rules (IMPORTANT!)

By default, your database is **wide open**. Anyone could bypass your UI and directly write garbage to your database using DevTools.

### Setting Up Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Open your project → **Build** → **Realtime Database**
3. Click the **Rules** tab
4. Copy the contents of `database.rules.json` from the project root
5. Paste and click **Publish**

### What the Rules Do

```
✅ Anyone can READ all slots
✅ Anyone can WRITE to empty slots
✅ Anyone can EDIT slots with no owner (uid == null)
✅ Only the OWNER can edit/delete their own slots
✅ Validates required fields (id, user, dish, color)
✅ Validates string lengths (user ≤ 30, dish ≤ 50)
❌ Cannot modify tier names or IDs
```

### Testing Rules

After publishing, test by:
1. Creating a slot while logged in
2. Logging out
3. Trying to delete that slot → Should fail!

⚠️ **Note**: Guest entries (no login) have `uid: null`, so anyone can still edit those. This is intentional for the potluck's community vibe!
