"use client";

import { signOut, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";

export function LoginButton() {
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
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm pr-1 pl-1 py-1 rounded-full shadow-md border border-white/50">
                {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-8 h-8 rounded-full border border-gray-200"
                    />
                ) : (
                    <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
                        {user.displayName?.charAt(0) || "U"}
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-gray-500 hover:text-red-500 px-2 transition-colors"
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="bg-white/80 hover:bg-white text-gray-700 font-bold py-2 px-4 rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 border border-white/50 flex items-center gap-2"
        >
            <span className="text-lg">🔑</span>
            <span className="hidden sm:inline text-sm">Sign In</span>
        </button>
    );
}
