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
  uid?: string;      // NEW: Owner ID
  photoURL?: string; // NEW: Owner Avatar
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
    // ... (Existing DB Listener Logic)
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
    }, (error) => {
      console.error("Firebase read error:", error);
      setError("Failed to connect to the Osechi box. Check your internet connection.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Remove duplicate useEffect code if I pasted over it, checking below block

  const claimSlot = (tierIndex: number, slotIndex: number, data: Omit<SlotData, "id" | "uid" | "photoURL">) => {
    setError(null);

    // Default: Allow guests but prefer auth
    // Note: If you want to FORCE login, uncomment next section
    /*
    if (!currentUser) {
        return { success: false, message: "🔒 Please Sign In to add a dish!" };
    }
    */

    // 1. Strict Duplicate Check (Any Dish)
    const dishLower = data.dish.toLowerCase().trim();
    const isDuplicate = tiers.some((tier) =>
      tier.slots.some((slot) => slot?.dish.toLowerCase().trim() === dishLower)
    );

    if (isDuplicate) {
      if (dishLower.includes("potato salad")) {
        return { success: false, message: "⚠️ ALERT: Too much Potato Salad! Please make something else." };
      }
      return { success: false, message: `⚠️ Someone is already bringing ${data.dish}! Please choose something else.` };
    }

    // 2. Brown Food Ban
    if (data.color === "Brown") {
      // ... (Existing Brown logic)
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
      if (brownSlots / totalSlots > 0.5) {
        return { success: false, message: "The Osechi is too ugly! We need Red or Green foods only." };
      }
    }

    const newTiers = [...tiers];
    newTiers[tierIndex].slots[slotIndex] = {
      ...data,
      id: crypto.randomUUID(),
      uid: currentUser?.uid,
      photoURL: currentUser?.photoURL || undefined
    };

    set(ref(db, "osechi/tiers"), newTiers).catch((err) => {
      console.error("Firebase write error:", err);
      setError("Failed to save your dish. Please try again.");
    });

    return { success: true };
  };

  const clearSlot = (tierIndex: number, slotIndex: number) => {
    const slot = tiers[tierIndex].slots[slotIndex];

    // SECURITY: Ownership Check
    if (slot?.uid && currentUser?.uid !== slot.uid) {
      // If dish has an owner, and you are not them -> Block
      return { success: false, message: "🚫 You can only remove your own dishes!" };
    }

    // Note: If slot.uid is undefined (legacy dish), allow anyone to delete it (Community Property)

    const newTiers = [...tiers];
    newTiers[tierIndex].slots[slotIndex] = null;

    set(ref(db, "osechi/tiers"), newTiers).catch((err) => {
      console.error("Firebase write error:", err);
      setError("Failed to remove dish. Please try again.");
    });

    return { success: true };
  };

  return { tiers, claimSlot, clearSlot, error, loading, currentUser };
}
