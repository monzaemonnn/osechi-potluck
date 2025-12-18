import { SlotData } from "@/hooks/useOsechi";

interface SlotDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: SlotData | null;
    onClear: () => void;
    onGetRecipe: () => void;
}

export function SlotDetailsModal({ isOpen, onClose, data, onClear, onGetRecipe }: SlotDetailsModalProps) {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-white/50 transform transition-all scale-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full mb-2">
                        {data.category || "Potluck Dish"}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-1">
                        {data.dish}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Brought by <span className="font-bold text-gray-700">{data.user}</span>
                        {data.origin && <span className="text-gray-400"> • {data.origin}</span>}
                    </p>
                </div>

                {/* Meaning (Iware) Section */}
                {data.meaning && (
                    <div className="bg-orange-50/80 p-4 rounded-xl border border-orange-100 mb-6 italic text-gray-700 text-center relative">
                        <span className="absolute -top-3 left-4 text-2xl">❝</span>
                        <p className="px-2 text-sm leading-relaxed">
                            {data.meaning}
                        </p>
                        <span className="absolute -bottom-3 right-4 text-2xl">❞</span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onGetRecipe}
                        className="w-full bg-orange-100 text-orange-700 font-bold py-3 rounded-xl hover:bg-orange-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        📜 Get Recipe
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClear}
                            className="flex-1 bg-red-50 text-red-500 font-bold py-3 rounded-xl hover:bg-red-100 transition-all text-sm"
                        >
                            Delete
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-[2] bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Awesome! 😋
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
