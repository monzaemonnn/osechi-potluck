import { useState } from "react";
import { FoodColor } from "@/hooks/useOsechi";
import { useLanguage } from "@/contexts/LanguageContext";

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
    }) => { success: boolean; message?: string };
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
    const { t } = useLanguage();
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
        const result = onSubmit({ user, dish, color, category, origin, meaning });

        if (result.success) {
            setUser("");
            setDish("");
            setColor("Red");
            setCategory(CATEGORIES[0]);
            setOrigin("");
            setMeaning("");
        } else {
            alert(result.message || "Something went wrong. Please try again.");
        }
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
                    userOrigin: origin,
                    avoidDish: dish,
                    tierName,
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
                            {t.claimModal.title}
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
                            t.claimModal.suggestBtn
                        )}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t.claimModal.name}</label>
                            <input
                                type="text"
                                required
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/50 font-bold"
                                placeholder={t.claimModal.name}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t.claimModal.dish}</label>
                            <input
                                type="text"
                                required
                                value={dish}
                                onChange={(e) => setDish(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/50 font-bold"
                                placeholder={t.claimModal.dish}
                            />
                        </div>
                    </div>

                    {/* Category & Origin */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t.claimModal.category}</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/50"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t.claimModal.origin}</label>
                            <input
                                type="text"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/50"
                                placeholder={t.claimModal.origin}
                            />
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t.claimModal.color}</label>
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
                                {t.claimModal.meaning}
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
                                    t.claimModal.generateBtn
                                )}
                            </button>
                        </div>
                        <textarea
                            value={meaning}
                            onChange={(e) => setMeaning(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/50 text-sm h-20 resize-none"
                            placeholder={t.claimModal.meaning}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-100 text-gray-600 font-bold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all text-sm"
                        >
                            {t.claimModal.cancel}
                        </button>
                        <button
                            type="button"
                            onClick={() => onGetRecipe(dish, origin)}
                            disabled={!dish}
                            className="flex-1 bg-orange-100 text-orange-700 font-bold py-3 rounded-xl hover:bg-orange-200 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-1"
                        >
                            {t.claimModal.checkRecipe}
                        </button>
                        <button
                            type="submit"
                            className="flex-[1.5] bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {t.claimModal.submit}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
