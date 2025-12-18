"use client";

import { useEffect, useState } from "react";
import { TierData, FoodColor } from "@/hooks/useOsechi";

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    tiers: TierData[];
}

const COLOR_MAP: Record<FoodColor, string> = {
    Red: "bg-red-500",
    Green: "bg-emerald-500",
    Yellow: "bg-amber-400",
    White: "bg-gray-200",
    Brown: "bg-amber-800",
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-gray-900/95 backdrop-blur-md rounded-sm w-full max-w-md shadow-2xl border border-amber-500/30 transform transition-all scale-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-amber-500/20 flex-shrink-0">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-amber-300 uppercase tracking-wider">
                            Menu
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-300 transition-colors text-lg"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Total: <span className="font-bold text-amber-300">{totalDishes}</span> dishes
                    </p>
                </div>

                {/* List */}
                <div className="overflow-y-auto p-6 space-y-6">
                    {tiers.map((tier) => {
                        const filledSlots = tier.slots.filter(slot => slot !== null);

                        return (
                            <div key={tier.id}>
                                <h3 className="font-bold text-gray-400 mb-3 pb-1 border-b border-amber-500/20 text-sm uppercase tracking-wider">
                                    {tier.name}
                                </h3>

                                {filledSlots.length > 0 ? (
                                    <div className="space-y-2">
                                        {filledSlots.map((slot) => (
                                            <div key={slot!.id} className="flex items-center gap-3 bg-black/30 p-3 rounded-sm border border-amber-500/10">
                                                <div className={`w-3 h-3 rounded-sm ${COLOR_MAP[slot!.color]}`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-200 truncate text-sm">
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
                                    <div className="text-center py-4 bg-black/20 rounded-sm border border-dashed border-amber-500/20">
                                        <p className="text-sm text-gray-600 italic">Empty</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-amber-500/20 flex-shrink-0 bg-black/30">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold py-3 px-6 rounded-sm shadow-lg hover:shadow-amber-500/30 transition-all uppercase tracking-wider text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
