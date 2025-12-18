import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: Request) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: "Server missing API Key" }, { status: 500 });
    }

    try {
        const { dish, origin } = await req.json();

        const prompt = `
        You are a Helpful Home Chef living in **Meinohama, Fukuoka, Japan**.
        Write a simple, easy-to-follow recipe for: ${dish} (${origin || "Traditional Style"}).

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
