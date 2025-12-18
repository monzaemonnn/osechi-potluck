"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
    const { t } = useLanguage();
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
                        {t.helpModal.title} 🌍
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                        {t.tagline}
                    </p>
                    <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-bold text-sm border border-yellow-200 shadow-sm">
                        {t.helpModal.partyTime}
                    </div>
                </div>

                <div className="space-y-6 mb-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Intro */}
                    <div className="bg-orange-50 p-4 rounded-xl">
                        <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                            {t.helpModal.introTitle}
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {t.helpModal.intro}
                        </p>
                    </div>

                    {/* The Tiers */}
                    <div className="bg-red-50 p-4 rounded-xl space-y-3">
                        <h3 className="font-bold text-red-800 border-b border-red-200 pb-2">{t.helpModal.tiersTitle}</h3>
                        <div className="flex gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-white text-red-600 font-bold border border-red-100 flex items-center justify-center shrink-0 shadow-sm">1</div>
                            <div>
                                <span className="font-bold text-gray-900">{t.helpModal.tier1}</span>
                                <p className="text-gray-600 text-xs">{t.helpModal.tier1Desc}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-white text-red-600 font-bold border border-red-100 flex items-center justify-center shrink-0 shadow-sm">2</div>
                            <div>
                                <span className="font-bold text-gray-900">{t.helpModal.tier2}</span>
                                <p className="text-gray-600 text-xs">{t.helpModal.tier2Desc}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-white text-red-600 font-bold border border-red-100 flex items-center justify-center shrink-0 shadow-sm">3</div>
                            <div>
                                <span className="font-bold text-gray-900">{t.helpModal.tier3}</span>
                                <p className="text-gray-600 text-xs">{t.helpModal.tier3Desc}</p>
                            </div>
                        </div>
                    </div>

                    {/* How to Participate */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="font-bold text-gray-800 mb-2">🥢 {t.helpModal.howTo}</h3>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                            <li><strong>1.</strong> {t.helpModal.step1}</li>
                            <li><strong>2.</strong> {t.helpModal.step2}</li>
                            <li><strong>3.</strong> {t.helpModal.step3}</li>
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    {t.helpModal.btn}
                </button>
            </div>
        </div>
    );
}
