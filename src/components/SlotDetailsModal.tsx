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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-gray-900/95 backdrop-blur-md rounded-sm p-6 w-full max-w-sm shadow-2xl border border-amber-500/30 transform transition-all scale-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-block px-3 py-1 bg-amber-500/10 text-amber-300 text-xs font-medium rounded-sm mb-3 border border-amber-500/20 uppercase tracking-wider">
                        {data.category || "Dish"}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">
                        {data.dish}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        by <span className="font-medium text-amber-300">{data.user}</span>
                        {data.origin && <span className="text-gray-600"> — {data.origin}</span>}
                    </p>
                </div>

                {/* Meaning (Iware) Section */}
                {data.meaning && (
                    <div className="bg-amber-500/5 p-4 rounded-sm border-l-2 border-amber-500/50 mb-6 text-gray-400 text-sm leading-relaxed italic">
                        {data.meaning}
                    </div>
                )}

                <div className="gold-divider mb-4"></div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onGetRecipe}
                        className="w-full bg-amber-500/10 text-amber-300 font-medium py-3 rounded-sm hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 border border-amber-500/30 uppercase tracking-wider text-sm"
                    >
                        Get Recipe
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClear}
                            className="flex-1 bg-red-500/10 text-red-400 font-medium py-3 rounded-sm hover:bg-red-500/20 transition-all text-sm border border-red-500/20 uppercase tracking-wider"
                        >
                            Delete
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-[2] bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold py-3 rounded-sm shadow-lg hover:shadow-amber-500/30 transition-all uppercase tracking-wider text-sm"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
