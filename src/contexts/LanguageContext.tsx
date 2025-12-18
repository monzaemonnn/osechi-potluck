"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ja" | "fr" | "zh" | "ko";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
];

const TRANSLATIONS = {
    en: {
        appTitle: "Osechi Potluck 2026",
        tagline: "Share your culture in the box!",
        openBox: "✨ Open Osechi",
        closeBox: "📦 Close Box",
        guide: "Guide",
        signIn: "Sign In",
        signOut: "Sign Out",
        authModal: {
            title: "Welcome to Osechi 🍱",
            subtitle: "Before we eat, choose how you want to join.",
            loginBtn: "Sign In (Recommended)",
            loginDesc: "Protect your dishes so nobody else can delete them.",
            guestBtn: "Continue as Guest",
            guestDesc: "Dishes are shared property (anyone can edit)."
        },
        helpModal: {
            title: "Sharehouse Potluck",
            partyTime: "📅 Party Start: Jan 1st, 12:00 PM",
            introTitle: "🎍 What is Osechi?",
            intro: "Osechi Ryori is traditional Japanese New Year food, served in stacked boxes called Jubako. Stacking them symbolizes 'stacking happiness'!",
            tiersTitle: "🍱 The 3 Tiers",
            tier1: "1. Celebration & Sweets",
            tier1Desc: "Appetizers, desserts, or anything festive. (French Macarons? Cantonese fruit?)",
            tier2: "2. Grills & Sea",
            tier2Desc: "Grilled fish (success) and shrimp (long life). Main dishes.",
            tier3: "3. Mountain & Roots",
            tier3Desc: "Substantial sides. Stews, salads, or anything 'grounding'.",
            howTo: "How to Contribute",
            step1: "Click an empty slot",
            step2: "Add a dish from your country",
            step3: "Check other dishes & recipes!",
            btn: "Let's Eat! 😋"
        },
        claimModal: {
            title: "Add a Dish 🍱",
            name: "Your Name",
            dish: "Dish Name",
            category: "Taste / Category",
            origin: "Origin",
            meaning: "Meaning (Why is it lucky?)",
            color: "Primary Color",
            suggestBtn: "👨‍🍳 Suggest Dish",
            generateBtn: "✨ Generate with AI",
            checkRecipe: "📜 Check Recipe",
            submit: "Place Dish 🥢",
            cancel: "Cancel"
        }
    },
    ja: {
        appTitle: "おせち持ち寄りパーティー 2026",
        tagline: "あなたの文化をお重に詰めよう！",
        openBox: "✨ おせちを開ける",
        closeBox: "📦 お重を閉じる",
        guide: "ガイド",
        signIn: "ログイン",
        signOut: "ログアウト",
        authModal: {
            title: "おせちへようこそ 🍱",
            subtitle: "参加方法を選んでください。",
            loginBtn: "ログイン（推奨）",
            loginDesc: "自分の料理を保護します（他人が削除できなくなります）。",
            guestBtn: "ゲストとして参加",
            guestDesc: "料理は「共有財産」となり、誰でも編集できます。"
        },
        helpModal: {
            title: "シェアハウス・ポットラック",
            partyTime: "📅 パーティー開始: 1月1日 12:00 PM",
            introTitle: "🎍 おせちとは？",
            intro: "おせち料理は重箱に詰められた日本の伝統的なお正月料理です。「幸せを積み重ねる」という意味があります！",
            tiersTitle: "🍱 3段のお重",
            tier1: "1. 祝い肴・甘味",
            tier1Desc: "前菜やデザート、お祝いのもの。（マカロン？ フルーツ？）",
            tier2: "2. 焼き物・海の幸",
            tier2Desc: "焼き魚（出世）やエビ（長寿）。メインディッシュ。",
            tier3: "3. 山の幸・煮物",
            tier3Desc: "根菜や煮物、サラダなど。「根付く」料理。",
            howTo: "参加方法",
            step1: "空いている場所をクリック",
            step2: "あなたの国の料理を追加",
            step3: "他の人の料理もチェック！",
            btn: "いただきます！ 😋"
        },
        claimModal: {
            title: "料理を追加 🍱",
            name: "名前",
            dish: "料理名",
            category: "味 / カテゴリ",
            origin: "出身国 / 地域",
            meaning: "意味 / いわれ",
            color: "色",
            suggestBtn: "👨‍🍳 提案してもらう",
            generateBtn: "✨ AIで生成",
            checkRecipe: "📜 レシピを見る",
            submit: "料理を詰める 🥢",
            cancel: "キャンセル"
        }
    },
    fr: {
        appTitle: "Potluck Osechi 2026",
        tagline: "Partagez votre culture dans la boîte !",
        openBox: "✨ Ouvrir",
        closeBox: "📦 Fermer",
        guide: "Guide",
        signIn: "Connexion",
        signOut: "Déconnexion",
        authModal: {
            title: "Bienvenue à Osechi 🍱",
            subtitle: "Choisissez comment rejoindre la fête.",
            loginBtn: "Se connecter (Recommandé)",
            loginDesc: "Protégez vos plats (personne d'autre ne peut les supprimer).",
            guestBtn: "Continuer en Invité",
            guestDesc: "Les plats sont publics (tout le monde peut éditer)."
        },
        helpModal: {
            title: "Potluck de la Colocation",
            partyTime: "📅 Début: 1er Janvier, 12h00",
            introTitle: "🎍 Qu'est-ce que l'Osechi ?",
            intro: "L'Osechi est le repas traditionnel du Nouvel An japonais, servi dans des boîtes empilées (Jubako) pour 'empiler le bonheur' !",
            tiersTitle: "🍱 Les 3 Étages",
            tier1: "1. Célébration & Douceurs",
            tier1Desc: "Apéritifs, desserts, trucs festifs. (Macarons ? Fruits ?)",
            tier2: "2. Grillades & Mer",
            tier2Desc: "Poisson grillé (succès) et crevettes (longévité).",
            tier3: "3. Montagne & Racines",
            tier3Desc: "Plats consistants, ragoûts, salades. Ce qui 'enracine'.",
            howTo: "Comment participer",
            step1: "Cliquez sur une case vide",
            step2: "Ajoutez un plat de votre pays",
            step3: "Découvrez les autres plats !",
            btn: "Bon appétit ! 😋"
        },
        claimModal: {
            title: "Ajouter un Plat 🍱",
            name: "Votre Nom",
            dish: "Nom du Plat",
            category: "Goût / Catégorie",
            origin: "Origine",
            meaning: "Signification (Porte-bonheur ?)",
            color: "Couleur",
            suggestBtn: "👨‍🍳 Suggérer",
            generateBtn: "✨ Générer (IA)",
            checkRecipe: "📜 Recette",
            submit: "Ajouter 🥢",
            cancel: "Annuler"
        }
    },
    zh: {
        appTitle: "御节料理聚餐 2026",
        tagline: "在重箱里分享你的文化！",
        openBox: "✨ 打开重箱",
        closeBox: "📦 关闭重箱",
        guide: "指南",
        signIn: "登录",
        signOut: "登出",
        authModal: {
            title: "欢迎来到御节料理 🍱",
            subtitle: "请选择加入方式。",
            loginBtn: "登录（推荐）",
            loginDesc: "保护您的菜肴（防止他人误删）。",
            guestBtn: "以访客身份继续",
            guestDesc: "菜肴为公共财产（任何人均可编辑）。"
        },
        helpModal: {
            title: "合租房聚餐",
            partyTime: "📅 聚会开始: 1月1日 12:00 PM",
            introTitle: "🎍 什么是御节料理？",
            intro: "御节料理是日本传统的正月料理，装在重箱里，象征着'重叠的幸福'！",
            tiersTitle: "🍱 三层重箱",
            tier1: "1. 祝肴 & 甜点",
            tier1Desc: "开胃菜、甜点或节日食品。（马卡龙？水果？）",
            tier2: "2. 烧烤 & 海味",
            tier2Desc: "烤鱼（出人头地）和虾（长寿）。主菜。",
            tier3: "3. 山珍 & 煮物",
            tier3Desc: "炖菜、沙拉等扎实的配菜。",
            howTo: "如何参与",
            step1: "点击空位",
            step2: "添加来自您家乡的菜肴",
            step3: "查看其他菜肴！",
            btn: "开动了！ 😋"
        },
        claimModal: {
            title: "添加菜肴 🍱",
            name: "您的名字",
            dish: "菜名",
            category: "口味 / 类别",
            origin: "起源",
            meaning: "寓意",
            color: "颜色",
            suggestBtn: "👨‍🍳 推荐菜肴",
            generateBtn: "✨ AI生成",
            checkRecipe: "📜 查看食谱",
            submit: "上菜 🥢",
            cancel: "取消"
        }
    },
    ko: {
        appTitle: "오세치 포트럭 2026",
        tagline: "당신의 문화를 공유하세요!",
        openBox: "✨ 열기",
        closeBox: "📦 닫기",
        guide: "가이드",
        signIn: "로그인",
        signOut: "로그아웃",
        authModal: {
            title: "오세치에 오신 것을 환영합니다 🍱",
            subtitle: "참여 방법을 선택하세요.",
            loginBtn: "로그인 (권장)",
            loginDesc: "자신의 요리를 보호하세요 (다른 사람이 삭제할 수 없음).",
            guestBtn: "게스트로 계속",
            guestDesc: "요리는 공유 재산이 됩니다 (누구나 수정 가능)."
        },
        helpModal: {
            title: "쉐어하우스 포트럭",
            partyTime: "📅 파티 시작: 1월 1일 12:00 PM",
            introTitle: "🎍 오세치가 무엇인가요?",
            intro: "오세치 요리는 일본의 전통 설날 음식으로, 행복을 쌓는다는 의미로 중시에 담습니다!",
            tiersTitle: "🍱 3단 중시",
            tier1: "1. 축하 & 디저트",
            tier1Desc: "에피타이저, 디저트, 축제 음식. (마카롱? 과일?)",
            tier2: "2. 구이 & 해산물",
            tier2Desc: "생선 구이(출세)와 새우(장수). 메인 요리.",
            tier3: "3. 산 & 뿌리채소",
            tier3Desc: "조림, 샐러드 등 든든한 반찬.",
            howTo: "참여 방법",
            step1: "빈 칸을 클릭하세요",
            step2: "당신의 나라 요리를 추가하세요",
            step3: "다른 요리도 확인해보세요!",
            btn: "잘 먹겠습니다! 😋"
        },
        claimModal: {
            title: "요리 추가 🍱",
            name: "이름",
            dish: "요리 이름",
            category: "맛 / 카테고리",
            origin: "기원",
            meaning: "의미",
            color: "색상",
            suggestBtn: "👨‍🍳 추천 받기",
            generateBtn: "✨ AI 생성",
            checkRecipe: "📜 레시피 확인",
            submit: "요리 담기 🥢",
            cancel: "취소"
        }
    }
};

type Translations = typeof TRANSLATIONS.en;

const LanguageContext = createContext<{
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
    dir: "ltr" | "rtl";
} | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("osechi_lang") as Language;
        if (saved && LANGUAGES.some(l => l.code === saved)) {
            setLanguageState(saved);
        }
        setMounted(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("osechi_lang", lang);
    };

    // Fallback to EN if translation missing
    const t = TRANSLATIONS[language] || TRANSLATIONS.en;

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: t as Translations, dir: "ltr" }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
