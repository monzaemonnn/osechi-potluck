"use client";

import { useEffect, useState } from "react";
import { TierData, FoodColor } from "@/hooks/useOsechi";

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    tiers: TierData[];
}

const EMOJI_MAP: Record<FoodColor, string> = {
    Red: "🔴",
    Green: "🟢",
    Yellow: "🟡",
    White: "⚪",
    Brown: "🟤",
};

export function MenuModal({ isOpen, onClose, tiers }: MenuModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    if (!isOpen) return null;

    // Calculate total dishes
    const totalDishes = tiers.reduce((acc, tier) =>
        acc + tier.slots.filter(s => s !== null).length, 0
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl border border-white/50 transform transition-all scale-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex-shrink-0">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-bold text-primary">
                            Potluck Menu 📜
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Total Dishes: <span className="font-bold text-primary">{totalDishes}</span>
                    </p>
                </div>

                {/* List */}
                <div className="overflow-y-auto p-6 space-y-8">
                    {tiers.map((tier) => {
                        const filledSlots = tier.slots.filter(slot => slot !== null);

                        return (
                            <div key={tier.id}>
                                <h3 className="font-bold text-gray-800 mb-3 pb-1 border-b-2 border-orange-100">
                                    {tier.name}
                                </h3>

                                {filledSlots.length > 0 ? (
                                    <div className="space-y-3">
                                        {filledSlots.map((slot) => (
                                            <div key={slot!.id} className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                                <span className="text-xl" role="img" aria-label={slot!.color}>
                                                    {EMOJI_MAP[slot!.color]}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-800 truncate">
                                                        {slot!.dish}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        by {slot!.user}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        <p className="text-sm text-gray-400 italic">No dishes yet... be the first! 🥢</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Bottom padding/Space */}
                    <div className="h-4"></div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-gray-50/50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Close Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
