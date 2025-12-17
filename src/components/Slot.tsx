"use client";

import { SlotData } from "@/hooks/useOsechi";
import { Plus } from "lucide-react";

interface SlotProps {
    data: SlotData | null;
    onClick: () => void;
}

const EMOJI_MAP: Record<string, string> = {
    Red: "🔴",
    Green: "🟢",
    Yellow: "🟡",
    White: "⚪",
    Brown: "🟤",
};

export function Slot({ data, onClick }: SlotProps) {
    if (data) {
        return (
            <div className="aspect-square bg-white rounded-lg border-2 border-gray-200 p-2 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="text-2xl mb-1">{EMOJI_MAP[data.color]}</div>
                <div className="font-bold text-xs truncate w-full">{data.dish}</div>
                <div className="text-[10px] text-gray-500 truncate w-full">{data.user}</div>
            </div>
        );
    }

    return (
        <button
            onClick={onClick}
            className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
        >
            <Plus className="w-6 h-6" />
        </button>
    );
}
