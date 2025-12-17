"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SlotData, FoodColor } from "@/hooks/useOsechi";

interface SlotDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: SlotData | null;
    onClear: () => void;
}

const EMOJI_MAP: Record<string, string> = {
    Red: "🔴",
    Green: "🟢",
    Yellow: "🟡",
    White: "⚪",
    Brown: "🟤",
};

export function SlotDetailsModal({ isOpen, onClose, data, onClear }: SlotDetailsModalProps) {
    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-[#FFF9F0] border-2 border-primary">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary text-center">
                        {EMOJI_MAP[data.color]} {data.dish}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 text-center space-y-4">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Brought by</p>
                        <p className="text-xl font-medium">{data.user}</p>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-sm text-gray-600 italic">
                            "Looks delicious!"
                        </p>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between gap-2">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                        Close
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (confirm("Are you sure you want to remove this dish?")) {
                                onClear();
                                onClose();
                            }
                        }}
                        className="w-full sm:w-auto"
                    >
                        Remove Dish
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
