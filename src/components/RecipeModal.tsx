import { useState, useEffect } from "react";

interface RecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    dish: string;
    origin?: string;
}

export function RecipeModal({ isOpen, onClose, dish, origin }: RecipeModalProps) {
    const [recipe, setRecipe] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchedDish, setFetchedDish] = useState("");

    useEffect(() => {
        if (isOpen && dish && dish !== fetchedDish) {
            fetchRecipe();
        }
    }, [isOpen, dish]);

    const fetchRecipe = async () => {
        setLoading(true);
        setRecipe("");
        try {
            const res = await fetch("/api/generate-recipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dish, origin }),
            });
            const data = await res.json();
            if (data.recipe) {
                setRecipe(data.recipe);
                setFetchedDish(dish);
            }
        } catch (error) {
            console.error(error);
            setRecipe("Failed to load recipe. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-lg shadow-2xl border border-white/50 transform transition-all scale-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex-shrink-0 flex justify-between items-center bg-orange-50/50 rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Recipe: {dish} 🍳
                        </h2>
                        {origin && <p className="text-sm text-gray-500">{origin} Style</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(recipe);
                                // Optional: You could add a temporary "Copied!" state here if you want to be fancy, 
                                // but for now a simple click effect is fine or we can assume user knows.
                                // Let's adding a simple alert or just rely on the UI feedback of the click.
                                alert("Recipe copied to clipboard! 📋");
                            }}
                            className="bg-white/80 hover:bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-bold border border-orange-200 shadow-sm transition-all"
                            disabled={loading || !recipe}
                        >
                            Copy 📋
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">
                            &times;
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-grow text-gray-700 leading-relaxed font-medium">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="animate-spin text-4xl">👨‍🍳</div>
                            <p className="text-gray-500 animate-pulse">Consulting the AI Chef...</p>
                        </div>
                    ) : (
                        <div className="prose prose-orange p-2">
                            {/* Simple markdown rendering */}
                            {recipe.split('\n').map((line, i) => {
                                // Basic bold parser: **text** -> <strong>text</strong>
                                const parts = line.split(/(\*\*.*?\*\*)/g);
                                return (
                                    <p key={i} className={`mb-2 ${line.startsWith('#') ? 'font-bold text-lg text-primary mt-4 border-b border-orange-100 pb-1' : ''}`}>
                                        {parts.map((part, j) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                return <strong key={j}>{part.slice(2, -2)}</strong>;
                                            }
                                            return part.replace(/^#+\s/, '');
                                        })}
                                    </p>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-gray-50/50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Got it! 👩‍🍳
                    </button>
                </div>
            </div>
        </div>
    );
}
