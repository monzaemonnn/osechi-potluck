# Deploying Osechi Potluck to Netlify

## 1. Push to GitHub
1. Create a new repository on GitHub (e.g., `osechi-potluck`).
2. Run the following commands in your terminal (replace `YOUR_USERNAME` and `REPO_NAME`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2. Connect to Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** > **"Import from existing project"**.
3. Select **GitHub** and choose your `osechi-potluck` repository.

## 3. Configure Build Settings
Netlify should auto-detect Next.js:
- **Build command**: `npm run build`
- **Publish directory**: `.next`

## 4. Add Environment Variables (CRITICAL)
Before clicking "Deploy", click **"Show advanced"** or go to **Site settings > Environment variables** after creation.
Add the same keys from your `.env.local`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 5. Deploy
Click **"Deploy site"**. Netlify will build your app and give you a live URL!
