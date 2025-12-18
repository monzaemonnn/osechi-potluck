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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-gray-900/95 backdrop-blur-md rounded-sm w-full max-w-lg shadow-2xl border border-amber-500/30 transform transition-all scale-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-amber-500/20 flex-shrink-0 flex justify-between items-center bg-amber-500/5">
                    <div>
                        <h2 className="text-xl font-bold text-amber-300 uppercase tracking-wider">
                            Recipe
                        </h2>
                        <p className="text-sm text-gray-400">{dish} {origin && `— ${origin}`}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(recipe);
                                alert("Recipe copied to clipboard!");
                            }}
                            className="bg-black/50 hover:bg-black/70 text-amber-300 px-3 py-1.5 rounded-sm text-xs font-medium border border-amber-500/30 transition-all uppercase tracking-wider"
                            disabled={loading || !recipe}
                        >
                            Copy
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors text-xl">
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-grow text-gray-300 leading-relaxed">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 animate-pulse text-sm uppercase tracking-wider">Consulting the chef...</p>
                        </div>
                    ) : (
                        <div className="text-sm">
                            {recipe.split('\n').map((line, i) => {
                                const parts = line.split(/(\*\*.*?\*\*)/g);
                                return (
                                    <p key={i} className={`mb-2 ${line.startsWith('#') ? 'font-bold text-base text-amber-300 mt-4 border-b border-amber-500/20 pb-1' : ''}`}>
                                        {parts.map((part, j) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                return <strong key={j} className="text-amber-200">{part.slice(2, -2)}</strong>;
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
                <div className="p-4 border-t border-amber-500/20 flex-shrink-0 bg-black/30">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold py-3 px-6 rounded-sm shadow-lg hover:shadow-amber-500/30 transition-all uppercase tracking-wider text-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
