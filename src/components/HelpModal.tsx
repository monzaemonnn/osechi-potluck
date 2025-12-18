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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-gray-900/95 backdrop-blur-md rounded-sm p-6 w-full max-w-md shadow-2xl border border-amber-500/30 transform transition-all scale-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-amber-300 mb-2 tracking-wide">
                        {t.helpModal.title}
                    </h2>
                    <div className="gold-divider mb-4"></div>
                    <p className="text-gray-400 text-sm mb-4">
                        {t.tagline}
                    </p>
                    <div className="inline-block bg-amber-500/10 text-amber-300 px-4 py-2 rounded-sm font-medium text-sm border border-amber-500/30">
                        {t.helpModal.partyTime}
                    </div>
                </div>

                <div className="space-y-4 mb-6 max-h-[55vh] overflow-y-auto pr-2">
                    {/* Intro */}
                    <div className="bg-amber-500/5 p-4 rounded-sm border-l-2 border-amber-500/50">
                        <h3 className="font-bold text-amber-300 mb-2 text-sm uppercase tracking-wider">
                            {t.helpModal.introTitle}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {t.helpModal.intro}
                        </p>
                    </div>

                    {/* The Tiers */}
                    <div className="bg-red-500/5 p-4 rounded-sm border-l-2 border-red-500/50">
                        <h3 className="font-bold text-red-400 mb-3 text-sm uppercase tracking-wider">{t.helpModal.tiersTitle}</h3>
                        <div className="space-y-3">
                            <div className="flex gap-3 text-sm">
                                <div className="w-6 h-6 rounded-sm bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center justify-center shrink-0 text-xs">1</div>
                                <div>
                                    <span className="font-medium text-gray-200">{t.helpModal.tier1}</span>
                                    <p className="text-gray-500 text-xs">{t.helpModal.tier1Desc}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <div className="w-6 h-6 rounded-sm bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center justify-center shrink-0 text-xs">2</div>
                                <div>
                                    <span className="font-medium text-gray-200">{t.helpModal.tier2}</span>
                                    <p className="text-gray-500 text-xs">{t.helpModal.tier2Desc}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <div className="w-6 h-6 rounded-sm bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center justify-center shrink-0 text-xs">3</div>
                                <div>
                                    <span className="font-medium text-gray-200">{t.helpModal.tier3}</span>
                                    <p className="text-gray-500 text-xs">{t.helpModal.tier3Desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How to Participate */}
                    <div className="bg-white/5 p-4 rounded-sm border-l-2 border-gray-500/50">
                        <h3 className="font-bold text-gray-300 mb-2 text-sm uppercase tracking-wider">{t.helpModal.howTo}</h3>
                        <ul className="text-sm text-gray-500 space-y-2">
                            <li><span className="text-amber-400 font-bold">1.</span> {t.helpModal.step1}</li>
                            <li><span className="text-amber-400 font-bold">2.</span> {t.helpModal.step2}</li>
                            <li><span className="text-amber-400 font-bold">3.</span> {t.helpModal.step3}</li>
                        </ul>
                    </div>
                </div>

                <div className="gold-divider mb-4"></div>

                <button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold py-3 px-6 rounded-sm shadow-lg hover:shadow-amber-500/30 hover:shadow-xl transition-all uppercase tracking-wider text-sm"
                >
                    {t.helpModal.btn}
                </button>
            </div>
        </div>
    );
}
