import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";

interface AuthChoiceModalProps {
    isOpen: boolean;
    onGuest: () => void;
}

export function AuthChoiceModal({ isOpen, onGuest }: AuthChoiceModalProps) {
    const { t, language, setLanguage } = useLanguage();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    if (!isOpen) return null;

    const handleLogin = async () => {
        setIsLoggingIn(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Please try again or continue as guest.");
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-gray-900/95 rounded-sm p-8 w-full max-w-lg shadow-2xl border border-amber-500/30 text-center">
                {/* Language Selector */}
                <div className="flex items-center justify-center gap-2 mb-6 text-sm">
                    <span className="text-gray-500 uppercase tracking-wider text-xs">Language:</span>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as typeof language)}
                        className="bg-black/50 border border-amber-500/30 rounded-sm px-3 py-1.5 font-medium text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer text-sm"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.code.toUpperCase()} — {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="gold-divider mb-6"></div>

                <h2 className="text-2xl font-bold text-amber-300 mb-2 tracking-wide">{t.authModal.title}</h2>
                <p className="text-gray-500 mb-8 text-sm">{t.authModal.subtitle}</p>

                <div className="grid grid-cols-1 gap-4">
                    {/* Login Option */}
                    <button
                        onClick={handleLogin}
                        disabled={isLoggingIn}
                        className="group relative flex flex-col items-center p-6 rounded-sm border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 transition-all"
                    >
                        <span className="text-amber-300 text-2xl mb-2">◆</span>
                        <span className="text-lg font-bold text-amber-300 uppercase tracking-wider">{t.authModal.loginBtn}</span>
                        <span className="text-sm text-gray-500 mt-1">
                            {t.authModal.loginDesc}
                        </span>
                        {isLoggingIn && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-sm">
                                <span className="animate-pulse text-amber-300">Loading...</span>
                            </div>
                        )}
                    </button>

                    <div className="flex items-center gap-4 text-xs text-gray-600 my-2">
                        <div className="h-px bg-gray-700 flex-1"></div>
                        <span className="uppercase tracking-wider">or</span>
                        <div className="h-px bg-gray-700 flex-1"></div>
                    </div>

                    {/* Guest Option */}
                    <button
                        onClick={onGuest}
                        className="group flex flex-col items-center p-4 rounded-sm border border-transparent hover:bg-white/5 transition-all text-gray-500 hover:text-gray-300"
                    >
                        <span className="font-medium underline decoration-dotted uppercase tracking-wider text-sm">{t.authModal.guestBtn}</span>
                        <span className="text-xs mt-1">
                            {t.authModal.guestDesc}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
