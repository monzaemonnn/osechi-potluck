"use client";

import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-sm bg-black/60 backdrop-blur-sm border border-amber-500/40 shadow-lg flex items-center justify-center text-xs sm:text-sm hover:bg-black/80 hover:border-amber-400 transition-all text-amber-300 font-medium uppercase tracking-wider"
                title="Change Language"
            >
                {currentLang.code.toUpperCase()}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 z-50 bg-gray-900/95 backdrop-blur-md rounded-sm shadow-xl border border-amber-500/30 p-1 w-36 flex flex-col animate-in slide-in-from-top-2 duration-200">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors ${language === lang.code
                                ? "bg-amber-500/20 text-amber-300"
                                : "hover:bg-white/5 text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            <span className="text-xs uppercase tracking-wider">{lang.code}</span>
                            <span className="text-gray-500">|</span>
                            <span className="text-xs">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
