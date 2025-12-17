import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, set, get } from "firebase/database";

export type FoodColor = "Red" | "Green" | "Yellow" | "White" | "Brown";

export interface SlotData {
  id: string;
  user: string;
  dish: string;
  color: FoodColor;
}

export interface TierData {
  id: string;
  name: string;
  slots: (SlotData | null)[];
}

const INITIAL_STATE: TierData[] = [
  { id: "tier-1", name: "Tier 1: Starters (Iwai-zakana)", slots: Array(9).fill(null) },
  { id: "tier-2", name: "Tier 2: Main (Yakimono)", slots: Array(9).fill(null) },
  { id: "tier-3", name: "Tier 3: Sides (Nimono)", slots: Array(9).fill(null) },
];

export function useOsechi() {
  const [tiers, setTiers] = useState<TierData[]>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from Firebase Realtime Database
  useEffect(() => {
    const tiersRef = ref(db, "osechi/tiers");

    const unsubscribe = onValue(tiersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Sanitize data: Ensure slots is always an array of 9 items
        // Firebase omits empty arrays or sparse arrays
        const sanitizedData = (data as TierData[]).map(tier => ({
          ...tier,
          slots: Array.from({ length: 9 }, (_, i) => tier.slots ? tier.slots[i] || null : null)
        }));
        setTiers(sanitizedData);
      } else {
        // If no data exists yet (first run), set initial state
        set(tiersRef, INITIAL_STATE);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase read error:", error);
      setError("Failed to connect to the Osechi box. Check your internet connection.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const claimSlot = (tierIndex: number, slotIndex: number, data: Omit<SlotData, "id">) => {
    setError(null);

    // 1. Strict Duplicate Check (Any Dish)
    const dishLower = data.dish.toLowerCase().trim();
    const isDuplicate = tiers.some((tier) =>
      tier.slots.some((slot) => slot?.dish.toLowerCase().trim() === dishLower)
    );

    if (isDuplicate) {
      // Funny message for Potato Salad still, generic for others
      if (dishLower.includes("potato salad")) {
        return { success: false, message: "⚠️ ALERT: Too much Potato Salad! Please make something else." };
      }
      return { success: false, message: `⚠️ Someone is already bringing ${data.dish}! Please choose something else.` };
    }

    // 2. Brown Food Ban
    if (data.color === "Brown") {
      let totalSlots = 0;
      let brownSlots = 0;
      tiers.forEach((tier) => {
        tier.slots.forEach((slot) => {
          if (slot) {
            totalSlots++;
            if (slot.color === "Brown") brownSlots++;
          }
        });
      });

      // Add current attempt
      totalSlots++;
      brownSlots++;

      if (brownSlots / totalSlots > 0.5) {
        return { success: false, message: "The Osechi is too ugly! We need Red or Green foods only." };
      }
    }

    // Optimistic update (optional, but Firebase is fast enough usually)
    // We'll just write to DB and let the listener update the UI
    const newTiers = [...tiers];
    newTiers[tierIndex].slots[slotIndex] = { ...data, id: crypto.randomUUID() };

    set(ref(db, "osechi/tiers"), newTiers).catch((err) => {
      console.error("Firebase write error:", err);
      setError("Failed to save your dish. Please try again.");
    });

    return { success: true };
  };

  const clearSlot = (tierIndex: number, slotIndex: number) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].slots[slotIndex] = null;

    set(ref(db, "osechi/tiers"), newTiers).catch((err) => {
      console.error("Firebase write error:", err);
      setError("Failed to remove dish. Please try again.");
    });
  };

  return { tiers, claimSlot, clearSlot, error, loading };
}
