"use client";

import { TierData, SlotData } from "@/hooks/useOsechi";
import { Slot } from "./Slot";

interface TierProps {
    tier: TierData;
    onClaimSlot: (slotIndex: number) => void;
}

export function Tier({ tier, onClaimSlot }: TierProps) {
    return (
        <div className="bg-[#1a1a1a] p-4 rounded-xl border-4 border-[var(--primary)] shadow-xl relative overflow-hidden">
            {/* Lacquerware texture effect */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>

            <h3 className="text-[var(--secondary)] font-bold mb-3 text-center uppercase tracking-widest text-sm border-b border-[var(--secondary)] pb-2">
                {tier.name}
            </h3>
            <div className="grid grid-cols-5 gap-2 relative z-10">
                {tier.slots.map((slot, index) => (
                    <Slot key={index} data={slot} onClick={() => onClaimSlot(index)} />
                ))}
            </div>
        </div>
    );
}
