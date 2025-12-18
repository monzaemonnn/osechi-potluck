import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;
// Note: Switched to gemini-3-flash-preview as requested.
// If this is also rate-limited, we can fallback to 'gemini-1.5-flash'.

export async function POST(req: Request) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: "Server missing API Key" }, { status: 500 });
    }

    try {
        const { dish, origin, category } = await req.json();

        const prompt = `
        You are a traditional Japanese Osechi Master with a sense of humor.
        Your task is to invent a traditional-sounding "meaning" (iware / いわれ) for a dish in a New Year's box.

        Dish: ${dish}
        Category: ${category}
        Origin: ${origin || "Unknown"}

        Rules:
        1. Connect the dish's shape, color, or name to a positive outcome (Longevity, Wealth, Joy, etc.).
        2. If the dish is non-traditional (e.g. Pizza), use "bullshit logic" to make it sound profound.
        3. Keep it to ONE short sentence (max 20 words).
        4. Do not include quotes.

        Example (Pizza): "The never-ending circle represents eternal harmony, and the melted cheese binds our relationships together."
        Example (Gyoza): "Shaped like ancient silver coins, eating these guarantees a year of financial proseperity."
        `;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error Status:", response.status);
            console.error("Gemini API Error Body:", errorText);
            return NextResponse.json({
                error: `Gemini API Error: ${response.status}`,
                details: errorText
            }, { status: 500 });
        }

        const data = await response.json();
        console.log("Gemini API Success:", JSON.stringify(data).substring(0, 100) + "...");
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            throw new Error("No content generated");
        }

        return NextResponse.json({ meaning: generatedText.trim() });

    } catch (error) {
        console.error("Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate meaning" }, { status: 500 });
    }
}
