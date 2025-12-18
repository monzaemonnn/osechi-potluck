"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthChoiceModalProps {
    isOpen: boolean;
    onGuest: () => void;
}

export function AuthChoiceModal({ isOpen, onGuest }: AuthChoiceModalProps) {
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    if (!isOpen) return null;

    const handleLogin = async () => {
        setIsLoggingIn(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // Auth state change will handle the close logic in parent (or we can just close here)
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Please try again or continue as guest.");
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white/95 rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-white/50 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Osechi 🍱</h2>
                <p className="text-gray-600 mb-8">Before we eat, choose how you want to join.</p>

                <div className="grid grid-cols-1 gap-4">
                    {/* Option 1: Login */}
                    <button
                        onClick={handleLogin}
                        disabled={isLoggingIn}
                        className="group relative flex flex-col items-center p-6 rounded-xl border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white hover:border-orange-300 hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🛡️</span>
                        <span className="text-lg font-bold text-gray-900">Sign In (Recommended)</span>
                        <span className="text-sm text-gray-500 mt-1">
                            Protect your dishes so nobody else can delete them.
                        </span>
                        {isLoggingIn && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl">
                                <span className="animate-spin text-2xl">⏳</span>
                            </div>
                        )}
                    </button>

                    <div className="flex items-center gap-4 text-xs text-gray-400 my-2">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        OR
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    {/* Option 2: Guest */}
                    <button
                        onClick={onGuest}
                        className="group flex flex-col items-center p-4 rounded-xl border border-transparent hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-600"
                    >
                        <span className="font-bold underline decoration-dotted">Continue as Guest</span>
                        <span className="text-xs mt-1">
                            Dishes become "Community Property" (anyone can edit).
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
