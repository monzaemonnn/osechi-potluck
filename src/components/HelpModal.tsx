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
                    <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">
                        Welcome to Osechi 2026! 🍱
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Join our digital potluck! Here's how it works:
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4 p-3 rounded-lg bg-orange-50/50 hover:bg-orange-50 transition-colors">
                        <div className="w-10 h-10 flex-shrink-0 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                            🖱️
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Explore</h3>
                            <p className="text-sm text-gray-600">Drag to rotate the box and see it from all angles.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 rounded-lg bg-red-50/50 hover:bg-red-50 transition-colors">
                        <div className="w-10 h-10 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center text-2xl">
                            👆
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Open & Claim</h3>
                            <p className="text-sm text-gray-600">Click <strong>"Open Osechi"</strong> to see inside, then click any empty slot to add your dish!</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-[var(--primary)] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Let's Eat! 😋
                </button>
            </div>
        </div>
    );
}
