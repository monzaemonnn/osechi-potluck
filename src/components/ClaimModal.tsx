import { useState } from "react";
import { FoodColor } from "@/hooks/useOsechi";

interface ClaimModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        user: string;
        dish: string;
        color: FoodColor;
        category: string;
        origin: string;
        meaning: string;
    }) => void;
    currentDishes: { dish: string; color: string; category?: string }[];
    onGetRecipe: (dish: string, origin: string) => void;
    tierName?: string;
}

const COLORS: { value: FoodColor; label: string; bg: string }[] = [
    { value: "Red", label: "Red (Joy/Protection)", bg: "bg-[#D9381E]" },
    { value: "White", label: "White (Purity)", bg: "bg-white border-2 border-gray-200" },
    { value: "Yellow", label: "Yellow (Wealth)", bg: "bg-[#F2C94C]" },
    { value: "Green", label: "Green (Health)", bg: "bg-[#4CAF50]" },
    { value: "Brown", label: "Brown (Stability)", bg: "bg-[#8D6E63]" },
];

const CATEGORIES = [
    "Savory 🧂",
    "Sweet 🍬",
    "Sour 🍋",
    "Spicy 🌶️",
    "Alcohol 🍶",
    "Other 🥢"
];

export function ClaimModal({ isOpen, onClose, onSubmit, currentDishes, onGetRecipe, tierName }: ClaimModalProps) {
    const [user, setUser] = useState("");
    const [dish, setDish] = useState("");
    const [color, setColor] = useState<FoodColor>("Red");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [origin, setOrigin] = useState("");
    const [meaning, setMeaning] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ user, dish, color, category, origin, meaning });
        // Reset form
        setUser("");
        setDish("");
        setColor("Red");
        setCategory(CATEGORIES[0]);
        setOrigin("");
        setMeaning("");
    };

    const handleGenerateMeaning = async () => {
        if (!dish) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/generate-meaning", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dish, origin, category }),
            });
            const data = await res.json();
            if (data.meaning) {
                setMeaning(data.meaning);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to connect to AI. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSuggest = async () => {
        setIsSuggesting(true);
        try {
            const res = await fetch("/api/suggest-dish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentDishes,
                    userOrigin: origin, // Send current origin input
                    avoidDish: dish,    // Send current dish to avoid repetition
                    tierName,           // SEND TIER CONTEXT
                }),
            });
            const data = await res.json();
            if (data.dish) {
                setDish(data.dish);
                if (data.color) setColor(data.color);
                if (data.category) setCategory(data.category);
                if (data.origin) setOrigin(data.origin);
                if (data.meaning) setMeaning(data.meaning);
                alert(`💡 Suggestion: ${data.dish}\n\nWhy: ${data.reason}`);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to get suggestion. The AI Chef is busy!");
        } finally {
            setIsSuggesting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/50 transform transition-all scale-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                            Add a Dish 🍱
                        </h2>
                        {tierName && <p className="text-xs text-orange-600 font-bold">{tierName}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={handleSuggest}
                        disabled={isSuggesting}
                        className="text-xs bg-gradient-to-r from-green-500 to-teal-600 text-white px-3 py-2 rounded-lg font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-1 active:scale-95"
                    >
                        {isSuggesting ? (
                            <span className="animate-spin">👨‍🍳</span>
                        ) : (
                            "👨‍🍳 Suggest Dish"
                        )}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                            <input
                                type="text"
                                required
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/50 font-bold"
                                placeholder="Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Dish Name</label>
                            <input
                                type="text"
                                required
                                value={dish}
                                onChange={(e) => setDish(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/50 font-bold"
                                placeholder="e.g. Sushi"
                            />
                        </div>
                    </div>

                    {/* Category & Origin */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Taste / Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/50"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Origin</label>
                            <input
                                type="text"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/50"
                                placeholder="e.g. Italy"
                            />
                            <p className="text-[10px] text-gray-400 mt-1 ml-1">
                                💡 Tip: Type a country here to get specific suggestions!
                            </p>
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Primary Color</label>
                        <div className="flex justify-between gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setColor(c.value)}
                                    className={`w-10 h-10 rounded-full transition-all shadow-sm ${c.bg} ${color === c.value
                                        ? "ring-4 ring-offset-2 ring-orange-400 scale-110"
                                        : "hover:scale-105 opacity-80"
                                        }`}
                                    title={c.label}
                                />
                            ))}
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-1 font-medium">
                            {COLORS.find(c => c.value === color)?.label}
                        </p>
                    </div>

                    {/* Meaning (AI Section) */}
                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <label className="block text-sm font-bold text-gray-700">
                                Meaning (Iware/いわれ)
                            </label>
                            <button
                                type="button"
                                onClick={handleGenerateMeaning}
                                disabled={!dish || isGenerating}
                                className="text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2 py-1 rounded-lg font-bold shadow-sm hover:shadow-md disabled:opacity-50 transition-all flex items-center gap-1"
                            >
                                {isGenerating ? (
                                    <span className="animate-spin">✨</span>
                                ) : (
                                    "✨ Generate with AI"
                                )}
                            </button>
                        </div>
                        <textarea
                            value={meaning}
                            onChange={(e) => setMeaning(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/50 text-sm h-20 resize-none"
                            placeholder="Why is this lucky? (Or let AI invent a reason!)"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-100 text-gray-600 font-bold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onGetRecipe(dish, origin)}
                            disabled={!dish}
                            className="flex-1 bg-orange-100 text-orange-700 font-bold py-3 rounded-xl hover:bg-orange-200 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-1"
                        >
                            📜 Check Recipe
                        </button>
                        <button
                            type="submit"
                            className="flex-[1.5] bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Place Dish 🥢
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
