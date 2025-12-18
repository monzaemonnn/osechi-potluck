# Osechi Potluck 2026

A 3D interactive New Year's potluck sign-up app for a sharehouse party.

## 🎯 What is This?

Sign up for the Sharehouse New Year's Potluck! Click on the 3D Osechi box to claim a slot and add your dish. The app suggests dishes, generates meanings, and even provides recipes.

**Live App:** [osechi-potluck.netlify.app](https://osechi-potluck.netlify.app) *(or your deployment URL)*

---

## 🍱 How to Participate

1. **Click the lid** to open the box
2. **Click an empty slot** in one of the 3 tiers
3. **Add your dish** with details (name, origin, color, meaning)
4. Use the **AI Suggest** button if you need ideas
5. Check **recipes** before cooking

### The 3 Tiers

| Tier | Name | What to Bring |
|------|------|---------------|
| 1 | Celebration & Sweets | Appetizers, desserts, festive items |
| 2 | Grills & Sea | Main proteins, grilled fish, shrimp |
| 3 | Mountain & Roots | Stews, salads, root vegetables |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **3D Rendering** | [React Three Fiber](https://r3f.docs.pmnd.rs/) + [Three.js](https://threejs.org) |
| **3D Helpers** | [@react-three/drei](https://github.com/pmndrs/drei) (OrbitControls, Text, Textures) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) |
| **Database** | [Firebase Realtime Database](https://firebase.google.com/docs/database) |
| **Auth** | [Firebase Auth](https://firebase.google.com/docs/auth) (Google Sign-In) |
| **AI** | [Google Gemini API](https://ai.google.dev) (gemini-3-flash-preview) |
| **Hosting** | [Netlify](https://netlify.com) |
| **Language** | TypeScript |

### Architecture Highlights

- **Real-time sync**: All dish claims are synced instantly via Firebase Realtime Database
- **Serverless AI**: Next.js API routes handle Gemini AI calls for dish suggestions, meanings, and recipes
- **3D Jubako**: Interactive lacquerware box with lid animation, tier explosion, and clickable slots
- **i18n**: 5 languages (EN, JA, FR, ZH, KO) with client-side switching
- **Mobile-first**: Responsive buttons, touch-friendly 3D controls

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY and Firebase config

# Run development server
npm run dev
```

## 📦 Deployment

```bash
# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod
```

---

## 🔒 Security Notes

- API keys stored in `.env.local` (gitignored)
- Firebase security rules restrict database access
- Gemini API calls proxied through Next.js API routes (keys never exposed to client)

---

## 📄 License

MIT License - Feel free to fork for your own potluck!
