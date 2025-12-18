"use client";

import { signOut, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LoginButton() {
    const { t } = useLanguage();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed! Please try again.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (user) {
        return (
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm pr-2 pl-2 py-1 rounded-sm shadow-lg border border-amber-500/40">
                {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-7 h-7 rounded-sm border border-amber-500/30"
                    />
                ) : (
                    <span className="w-7 h-7 rounded-sm bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-300">
                        {user.displayName?.charAt(0) || "U"}
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-gray-500 hover:text-red-400 px-1 transition-colors uppercase tracking-wider"
                >
                    {t.signOut}
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="bg-black/60 hover:bg-black/80 text-amber-300 font-medium py-1.5 px-2 sm:py-2 sm:px-4 rounded-sm shadow-lg backdrop-blur-sm transition-all border border-amber-500/40 hover:border-amber-400 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
        >
            {t.signIn}
        </button>
    );
}
