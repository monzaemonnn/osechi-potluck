import { NextResponse } from "next/server";
import { rateLimit, getClientIdentifier } from "@/lib/rateLimit";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: Request) {
    // Rate limiting: 10 requests per minute per IP
    const clientId = getClientIdentifier(req);
    const { allowed, remaining, resetIn } = rateLimit(`recipe:${clientId}`, { maxRequests: 10, windowMs: 60000 });

    if (!allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please wait a moment." },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(Math.ceil(resetIn / 1000))
                }
            }
        );
    }

    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: "Server missing API Key" }, { status: 500 });
    }

    try {
        const { dish, origin } = await req.json();

        const prompt = `
        You are a Helpful Home Chef living in **Meinohama, Fukuoka, Japan**.
        Write a simple, easy-to-follow recipe for: ${dish} (${origin || "Traditional Style"}).

        **OSECHI CONTEXT**: This dish is for an Osechi (Japanese New Year) box.
        - Must taste good at ROOM TEMPERATURE (Osechi is eaten cold).
        - Must be solid/contained (no runny liquids or soups).
        - Should be presentable in small portions in a bento-style box.
        - If the dish is normally served hot, adapt it to be eaten cold (e.g. suggest serving glazed or chilled).

        CONSTRAINTS:
        1. **Budget**: Total cost must be **under 2000 JPY**.
        2. **Availability**: Use ingredients found in standard Japanese supermarkets.
        3. **Stores**: Brand names ONLY (Sunny, MaxValu, Gyomu, Donki, Kaldi, Jupiter). **DO NOT** mention locations (e.g. "near the station").
        4. **Tone**: Direct. NO INTROS.
        5. **Formatting**: Minimal Markdown. Use Headers (#) for sections. **Avoid using bolding (**) inside sentences** as it renders poorly.

        Structure:
        # 🛒 Shopping List (Meinohama estimates)
        - List key ingredients with prices.
        - Mention store brands for deals.
        - Total Estimated Cost: [Total] JPY.

        # 🥣 Ingredients

        # 👩‍🍳 Steps
        1. Step 1
        2. Step 2...

        # 🎍 Osechi Tip
        (One tip on how to serve this cold or adapt for the New Year box)

        # 🤫 Secret Chef Tip
        (One sentence)
        `;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: `API Error: ${response.status}` }, { status: 500 });
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            throw new Error("No content generated");
        }

        return NextResponse.json({ recipe: generatedText });

    } catch {
        return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
    }
}
