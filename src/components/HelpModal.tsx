"use client";

import { useEffect, useState } from "react";

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/50 transform transition-all scale-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-primary mb-2">
                        Osechi 2026: Sharehouse Potluck 🌍
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Let's celebrate our diversity! Connect through food.
                    </p>
                </div>

                <div className="space-y-6 mb-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Intro */}
                    <div className="bg-orange-50 p-4 rounded-xl">
                        <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                            🎍 What is Osechi?
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Osechi Ryori (おせち料理) is traditional Japanese New Year food, served in stacked boxes called <em>Jubako</em>.
                            The act of stacking the boxes symbolizes <strong>"stacking happiness and fortune"</strong> for the year ahead!
                        </p>
                    </div>

                    {/* The Tiers */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-800 border-b pb-2">🍱 The 3 Tiers</h3>
                        <p className="text-xs text-gray-500 italic">
                            Traditionally these have specific meanings, but we are interpreting them loosely!
                        </p>
                        <div className="flex gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">1</div>
                            <div>
                                <span className="font-bold text-gray-900">Celebration & Sweets</span>
                                <p className="text-gray-600 text-xs">Appetizers, desserts, or anything festive. (French Macarons? Cantonese fruit?)</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">2</div>
                            <div>
                                <span className="font-bold text-gray-900">Grills & Sea</span>
                                <p className="text-gray-600 text-xs">Middle Tier. Grilled fish (success) and shrimp (long life).</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">3</div>
                            <div>
                                <span className="font-bold text-gray-900">Mountain & Roots</span>
                                <p className="text-gray-600 text-xs">Substantial sides. Stews, salads, or anything "grounding".</p>
                            </div>
                        </div>
                    </div>

                    {/* How to Participate */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="font-bold text-gray-800 mb-2">🥢 How to Contribute</h3>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                            <li><strong>Claim a Spot:</strong> Find an empty box and click it.</li>
                            <li><strong>Share Your Culture:</strong> Add a dish from your home country (or just something you love!).</li>
                            <li><strong>Add Meaning:</strong> Why is this dish special? (e.g. "In Italy, lentils bring money!").</li>
                            <li><strong>Check Recipes:</strong> Click any dish to see how to make it.</li>
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Let's Eat! 😋
                </button>
            </div>
        </div>
    );
}
