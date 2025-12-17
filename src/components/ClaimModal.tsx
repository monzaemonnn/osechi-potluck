"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FoodColor } from "@/hooks/useOsechi";

interface ClaimModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { user: string; dish: string; color: FoodColor }) => void;
}

const COLORS: { label: string; value: FoodColor; hex: string }[] = [
    { label: "Red", value: "Red", hex: "#D9381E" },
    { label: "Green", value: "Green", hex: "#4CAF50" },
    { label: "Yellow", value: "Yellow", hex: "#F2C94C" },
    { label: "White", value: "White", hex: "#FFFFFF" },
    { label: "Brown", value: "Brown", hex: "#8D6E63" },
];

export function ClaimModal({ isOpen, onClose, onSubmit }: ClaimModalProps) {
    const [user, setUser] = useState("");
    const [dish, setDish] = useState("");
    const [color, setColor] = useState<FoodColor>("Red");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ user, dish, color });
        // Reset form
        setUser("");
        setDish("");
        setColor("Red");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-[#FFF9F0] border-2 border-primary">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary text-center">🍱 Bento Rules</DialogTitle>
                </DialogHeader>
                <div className="bg-white p-4 rounded-md border border-dashed border-gray-300 mb-4 text-sm text-gray-600">
                    <p>⚠️ Must be tasty cold.</p>
                    <p>⚠️ No raw food.</p>
                    <p>⚠️ No soup.</p>
                </div>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            className="col-span-3"
                            required
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dish" className="text-right">
                            Dish
                        </Label>
                        <Input
                            id="dish"
                            value={dish}
                            onChange={(e) => setDish(e.target.value)}
                            className="col-span-3"
                            required
                            placeholder="e.g. Datemaki"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Color</Label>
                        <div className="col-span-3 flex gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setColor(c.value)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c.value ? "border-black scale-110 ring-2 ring-offset-1 ring-black" : "border-transparent"
                                        }`}
                                    style={{ backgroundColor: c.hex }}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-primary hover:bg-[#b92b14] text-white w-full">
                            Done
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
