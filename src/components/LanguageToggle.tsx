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
                className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-md flex items-center justify-center text-xl hover:scale-105 active:scale-95 transition-all"
                title="Change Language"
            >
                {currentLang.flag}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 z-50 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/50 p-2 w-40 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${language === lang.code
                                    ? "bg-orange-100 text-orange-800"
                                    : "hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
