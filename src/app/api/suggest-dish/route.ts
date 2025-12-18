import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: Request) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: "Server missing API Key" }, { status: 500 });
    }

    try {
        const { currentDishes, userOrigin, avoidDish, tierName } = await req.json();

        const prompt = `
        You are an expert Osechi Potluck Coordinator.
        Here is the list of dishes currently in the box:
        ${JSON.stringify(currentDishes)}

        Your task is to suggest ONE new dish.
        
        Constraints:
        1. **TIER THEME (Context):** The user is filling **"${tierName || "General"}"**.
           - If Tier 1 ("Celebration & Sweets"): Suggest appetizers, sweet rolled omelets (Datemaki), chestnuts, or desserts.
           - If Tier 2 ("Grills & Sea"): Suggest grilled fish, shrimp, roast beef, or main proteins.
           - If Tier 3 ("Mountain & Roots"): Suggest simmered vegetables (Nishime), salads, or hearty sides.
        2. OSECHI RULES (Crucial): 
           - NO Soups or Liquids (Must be solid/contained).
           - Must taste good at ROOM TEMPERATURE (Osechi is often eaten cold).
           - Must be fit for a bento box (not messy).
        3. User Preference (Origin/Style): "${userOrigin || "Any"}". 
           - IF provided, you MUST suggest a dish matching this origin (e.g. if "Italy", suggest Italian).
           - IF empty, focus purely on balancing the box.
        3. Avoid: Do NOT suggest "${avoidDish}".
        4. Balance: Look for missing Colors (Red, White, Yellow, Green, Brown) and Flavors.
        5. Variety: Don't suggest something that already exists in the box.

        Return strictly valid JSON with this format:
        {
            "dish": "Dish Name",
            "category": "Taste Category",
            "color": "Color (Red, White, Yellow, Green, or Brown)",
            "origin": "Country/Region",
            "reason": "Why you chose this (e.g. 'Balances the missing Green'). Sent to user as a tip.",
            "meaning": "Traditional-sounding symbolic meaning (Iware). (e.g. 'The green represents health and vitality'). This is saved to the database."
        }
        `;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
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

        const suggestion = JSON.parse(generatedText);
        return NextResponse.json(suggestion);

    } catch {
        return NextResponse.json({ error: "Failed to suggest dish" }, { status: 500 });
    }
}
