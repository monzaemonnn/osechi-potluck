import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { User, onAuthStateChanged } from "firebase/auth";

export type FoodColor = "Red" | "Green" | "Yellow" | "White" | "Brown";

export interface SlotData {
  id: string;
  user: string;
  dish: string;
  color: FoodColor;
  category?: string;
  origin?: string;
  meaning?: string;
  uid?: string | null;      // NEW: Owner ID
  photoURL?: string | null; // NEW: Owner Avatar
}

// ... (TierData interface remains same)
export interface TierData {
  id: string;
  name: string;
  slots: (SlotData | null)[];
}

const INITIAL_STATE: TierData[] = [
  { id: "tier-1", name: "Tier 1: Celebration & Sweets (Iwai)", slots: Array(9).fill(null) },
  { id: "tier-2", name: "Tier 2: Grills & Sea (Yakimono)", slots: Array(9).fill(null) },
  { id: "tier-3", name: "Tier 3: Mountain & Roots (Nimono)", slots: Array(9).fill(null) },
];

export function useOsechi() {
  const [tiers, setTiers] = useState<TierData[]>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load from Firebase Realtime Database
  useEffect(() => {
    const tiersRef = ref(db, "osechi/tiers");
    const unsubscribe = onValue(tiersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sanitizedData = (data as TierData[]).map(tier => ({
          ...tier,
          slots: Array.from({ length: 9 }, (_, i) => tier.slots ? tier.slots[i] || null : null)
        }));
        setTiers(sanitizedData);
      } else {
        set(tiersRef, INITIAL_STATE);
      }
      setLoading(false);
    }, () => {
      setError("Failed to connect to the Osechi box. Check your internet connection.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const claimSlot = (tierIndex: number, slotIndex: number, data: Omit<SlotData, "id" | "uid" | "photoURL">) => {
    setError(null);

    // SECURITY: Input validation and sanitization
    const sanitize = (str: string, maxLen: number) =>
      str.trim().slice(0, maxLen).replace(/[<>]/g, '');

    const validColors: FoodColor[] = ["Red", "Green", "Yellow", "White", "Brown"];
    if (!validColors.includes(data.color)) {
      return { success: false, message: "Invalid color selection." };
    }

    const sanitizedDish = sanitize(data.dish, 50);
    const sanitizedUser = sanitize(data.user, 30);

    if (!sanitizedDish || !sanitizedUser) {
      return { success: false, message: "Name and dish are required." };
    }

    // 1. Strict Duplicate Check (Any Dish)
    const dishLower = sanitizedDish.toLowerCase();
    const isDuplicate = tiers.some((tier) =>
      tier.slots.some((slot) => slot?.dish.toLowerCase().trim() === dishLower)
    );

    if (isDuplicate) {
      if (dishLower.includes("potato salad")) {
        return { success: false, message: "⚠️ ALERT: Too much Potato Salad! Please make something else." };
      }
      return { success: false, message: `⚠️ Someone is already bringing ${sanitizedDish}! Please choose something else.` };
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
      totalSlots++;
      brownSlots++;
      // Only enforce variety after 3 selections to avoid frustration for early birds
      if (totalSlots > 3 && brownSlots / totalSlots > 0.5) {
        return { success: false, message: "The Osechi is too ugly! We need Red or Green foods only." };
      }
    }

    // Update using specific path to avoid undefined errors in full tree write
    const newSlot: SlotData = {
      id: crypto.randomUUID(),
      user: sanitizedUser,
      dish: sanitizedDish,
      color: data.color,
      uid: currentUser?.uid || null,
      photoURL: currentUser?.photoURL || null,
      category: sanitize(data.category || "", 30),
      origin: sanitize(data.origin || "", 30),
      meaning: sanitize(data.meaning || "", 200)
    };

    set(ref(db, `osechi/tiers/${tierIndex}/slots/${slotIndex}`), newSlot).catch(() => {
      setError("Failed to save your dish. Please try again.");
    });

    return { success: true };
  };

  const clearSlot = (tierIndex: number, slotIndex: number) => {
    const slot = tiers[tierIndex].slots[slotIndex];

    // SECURITY: Ownership Check
    if (slot?.uid && currentUser?.uid !== slot.uid) {
      return { success: false, message: "🚫 You can only remove your own dishes!" };
    }

    // Note: If slot.uid is undefined (legacy dish), allow anyone to delete it (Community Property)

    set(ref(db, `osechi/tiers/${tierIndex}/slots/${slotIndex}`), null).catch(() => {
      setError("Failed to remove dish. Please try again.");
    });

    return { success: true };
  };

  return { tiers, claimSlot, clearSlot, error, loading, currentUser };
}
