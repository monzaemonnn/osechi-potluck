"use client";

import { useOsechi, FoodColor } from "@/hooks/useOsechi";
import { Tier } from "./Tier";
import { ClaimModal } from "./ClaimModal";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

export function JubakoBox() {
    const { tiers, claimSlot, error } = useOsechi();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ tierIndex: number; slotIndex: number } | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSlotClick = (tierIndex: number, slotIndex: number) => {
        setSelectedSlot({ tierIndex, slotIndex });
        setModalOpen(true);
        setLocalError(null);
    };

    const handleClaim = (data: { user: string; dish: string; color: FoodColor }) => {
        if (selectedSlot) {
            const result = claimSlot(selectedSlot.tierIndex, selectedSlot.slotIndex, data);
            if (result.success) {
                setModalOpen(false);
                setSelectedSlot(null);
            } else {
                setLocalError(result.message || "Error claiming slot");
            }
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6 p-4">
            {/* Error Toast / Alert */}
            {(error || localError) && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-sm">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-lg" role="alert">
                        <strong className="font-bold">Oops! </strong>
                        <span className="block sm:inline">{error || localError}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setLocalError(null)}>
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                        </span>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {tiers.map((tier, index) => (
                    <Tier key={tier.id} tier={tier} onClaimSlot={(slotIndex) => handleSlotClick(index, slotIndex)} />
                ))}
            </div>

            <ClaimModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleClaim}
            />
        </div>
    );
}
