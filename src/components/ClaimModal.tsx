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
    { value: "Red", label: "Red — Joy", bg: "bg-red-500" },
    { value: "White", label: "White — Purity", bg: "bg-gray-200" },
    { value: "Yellow", label: "Yellow — Wealth", bg: "bg-amber-400" },
    { value: "Green", label: "Green — Health", bg: "bg-emerald-500" },
    { value: "Brown", label: "Brown — Stability", bg: "bg-amber-800" },
];

const CATEGORIES = [
    "Savory",
    "Sweet",
    "Sour",
    "Spicy",
    "Alcohol",
    "Other"
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
                alert(`Suggestion: ${data.dish}\n\n${data.reason}`);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to get suggestion.");
        } finally {
            setIsSuggesting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-gray-900/95 backdrop-blur-md rounded-sm p-6 w-full max-w-md shadow-2xl border border-amber-500/30 transform transition-all scale-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-amber-300 uppercase tracking-wider">
                            {t.claimModal.title}
                        </h2>
                        {tierName && <p className="text-xs text-amber-500 font-medium">{tierName}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={handleSuggest}
                        disabled={isSuggesting}
                        className="text-xs bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-3 py-2 rounded-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 transition-all uppercase tracking-wider"
                    >
                        {isSuggesting ? "..." : t.claimModal.suggestBtn}
                    </button>
                </div>

                <div className="gold-divider mb-4"></div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t.claimModal.name}</label>
                            <input
                                type="text"
                                required
                                maxLength={30}
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                className="w-full px-3 py-2 rounded-sm border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-black/50 text-gray-200 font-medium text-sm"
                                placeholder={t.claimModal.name}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t.claimModal.dish}</label>
                            <input
                                type="text"
                                required
                                maxLength={50}
                                value={dish}
                                onChange={(e) => setDish(e.target.value)}
                                className="w-full px-3 py-2 rounded-sm border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-black/50 text-gray-200 font-medium text-sm"
                                placeholder={t.claimModal.dish}
                            />
                        </div>
                    </div>

                    {/* Category & Origin */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t.claimModal.category}</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-sm border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-black/50 text-gray-200 text-sm"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t.claimModal.origin}</label>
                            <input
                                type="text"
                                maxLength={30}
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="w-full px-3 py-2 rounded-sm border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-black/50 text-gray-200 text-sm"
                                placeholder={t.claimModal.origin}
                            />
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">{t.claimModal.color}</label>
                        <div className="flex justify-between gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setColor(c.value)}
                                    className={`w-10 h-10 rounded-sm transition-all shadow-sm ${c.bg} ${color === c.value
                                        ? "ring-2 ring-offset-2 ring-offset-gray-900 ring-amber-500 scale-110"
                                        : "hover:scale-105 opacity-70"
                                        }`}
                                    title={c.label}
                                />
                            ))}
                        </div>
                        <p className="text-center text-xs text-gray-600 mt-1">
                            {COLORS.find(c => c.value === color)?.label}
                        </p>
                    </div>

                    {/* Meaning (AI Section) */}
                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.claimModal.meaning}
                            </label>
                            <button
                                type="button"
                                onClick={handleGenerateMeaning}
                                disabled={!dish || isGenerating}
                                className="text-xs bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-2 py-1 rounded-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 transition-all uppercase tracking-wider"
                            >
                                {isGenerating ? "..." : t.claimModal.generateBtn}
                            </button>
                        </div>
                        <textarea
                            maxLength={200}
                            value={meaning}
                            onChange={(e) => setMeaning(e.target.value)}
                            className="w-full px-3 py-2 rounded-sm border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-black/50 text-gray-200 text-sm h-20 resize-none"
                            placeholder={t.claimModal.meaning}
                        />
                    </div>

                    <div className="gold-divider"></div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-800 text-gray-400 font-medium py-2.5 px-4 rounded-sm hover:bg-gray-700 transition-all text-xs uppercase tracking-wider border border-gray-700"
                        >
                            {t.claimModal.cancel}
                        </button>
                        <button
                            type="button"
                            onClick={() => onGetRecipe(dish, origin)}
                            disabled={!dish}
                            className="flex-1 bg-amber-500/10 text-amber-300 font-medium py-2.5 rounded-sm hover:bg-amber-500/20 transition-all disabled:opacity-50 text-xs uppercase tracking-wider border border-amber-500/30"
                        >
                            {t.claimModal.checkRecipe}
                        </button>
                        <button
                            type="submit"
                            className="flex-[1.5] bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold py-2.5 rounded-sm shadow-lg hover:shadow-amber-500/30 transition-all text-xs uppercase tracking-wider"
                        >
                            {t.claimModal.submit}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
