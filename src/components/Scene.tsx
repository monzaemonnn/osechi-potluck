"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Jubako3D } from "./Jubako3D";
import { useOsechi, FoodColor } from "@/hooks/useOsechi";
import { ClaimModal } from "./ClaimModal";
import { SlotDetailsModal } from "./SlotDetailsModal";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useState, useRef, useEffect } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

function CameraController({
    isExploded,
    controlsRef
}: {
    isExploded: boolean;
    controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
    const { camera } = useThree();
    const targetPos = useRef(new THREE.Vector3(7, 7, 12)); // Zoomed out more
    const lookAtPos = useRef(new THREE.Vector3(0, 1, 0)); // Look slightly up to center on lid
    const isAnimating = useRef(false);

    // Trigger animation when view mode changes
    useEffect(() => {
        isAnimating.current = true;
        if (controlsRef.current) controlsRef.current.enabled = false;

        if (isExploded) {
            targetPos.current.set(12, 12, 18); // Zoomed out more to fit all tiers
            lookAtPos.current.set(2.5, 0, 2.5);
        } else {
            targetPos.current.set(7, 7, 12); // Zoomed out more
            lookAtPos.current.set(0, 1, 0); // Center on lid
        }
    }, [isExploded, controlsRef]);

    useFrame(() => {
        if (!isAnimating.current) return;

        // Smoothly interpolate camera position
        camera.position.lerp(targetPos.current, 0.05);

        // Smoothly interpolate controls target
        if (controlsRef.current) {
            // Ensure disabled during animation (in case it reset)
            controlsRef.current.enabled = false;

            controlsRef.current.target.lerp(lookAtPos.current, 0.05);
            controlsRef.current.update();
        }

        // Check if we arrived
        if (camera.position.distanceTo(targetPos.current) < 0.1) {
            isAnimating.current = false;
            if (controlsRef.current) controlsRef.current.enabled = true;
        }
    });

    return null;
}

import { HelpModal } from "./HelpModal";
import { MenuModal } from "./MenuModal";
import { RecipeModal } from "./RecipeModal";
import { LoginButton } from "./LoginButton";
import { AuthChoiceModal } from "./AuthChoiceModal";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

// ... existing imports ...

export function Scene() {
    const { t } = useLanguage();
    const { tiers, claimSlot, clearSlot, error, loading, currentUser } = useOsechi();
    const [claimModalOpen, setClaimModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [helpModalOpen, setHelpModalOpen] = useState(false);
    const [authChoiceOpen, setAuthChoiceOpen] = useState(false);
    const [menuModalOpen, setMenuModalOpen] = useState(false);
    const [recipeModalOpen, setRecipeModalOpen] = useState(false);
    const [tempRecipeTarget, setTempRecipeTarget] = useState<{ dish: string; origin: string } | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<{ tierIndex: number; slotIndex: number } | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isExploded, setIsExploded] = useState(false);
    const controlsRef = useRef<OrbitControlsImpl>(null);

    // Check for first-time visit (Auth Choice)
    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current && !loading) {
            initialized.current = true;
            // logic: If not logged in AND haven't chosen guest mode yet -> Show Choice
            const hasJoined = localStorage.getItem("osechi_joined");

            if (!currentUser && !hasJoined) {
                setAuthChoiceOpen(true);
            } else if (!hasJoined) {
                // If already logged in but no flag (rare), set flag
                localStorage.setItem("osechi_joined", "true");
            }
        }
    }, [loading, currentUser]);

    // Close Auth Choice if user logs in
    useEffect(() => {
        if (currentUser) {
            setAuthChoiceOpen(false);
            localStorage.setItem("osechi_joined", "true");
        }
    }, [currentUser]);

    const handleGuestJoin = () => {
        setAuthChoiceOpen(false);
        localStorage.setItem("osechi_joined", "true");
        // Optional: Open Help after joining as guest?
        setHelpModalOpen(true);
    };

    const handleSlotClick = (tierIndex: number, slotIndex: number) => {
        // ... existing logic ...
        setSelectedSlot({ tierIndex, slotIndex });
        setLocalError(null);

        // Check if slot is already filled
        const slotData = tiers[tierIndex].slots[slotIndex];
        if (slotData) {
            setDetailsModalOpen(true);
        } else {
            setClaimModalOpen(true);
        }
    };



    // ... handleClaim and handleClear ...

    const handleClaim = (data: {
        user: string;
        dish: string;
        color: FoodColor;
        category: string;
        origin: string;
        meaning: string;
    }) => {
        if (selectedSlot) {
            const result = claimSlot(selectedSlot.tierIndex, selectedSlot.slotIndex, data);
            if (result.success) {
                setClaimModalOpen(false);
                setSelectedSlot(null);
            }
            return result; // RETURN RESULT for Modal to handle
        }
        return { success: false, message: "No slot selected" };
    };

    const handleClear = () => {
        if (selectedSlot) {
            const result = clearSlot(selectedSlot.tierIndex, selectedSlot.slotIndex);
            // Typescript check: existing useOsechi might not return type yet, but we updated it.
            // If result is object, check success.
            if (result && !result.success) {
                setLocalError(result.message || "Cannot remove this dish.");
                // Keep modal open so user sees error? Or close?
                // Let's keep detail modal open but show error toast.
            } else {
                setDetailsModalOpen(false);
                setSelectedSlot(null);
            }
        }
    };

    const handleCheckRecipe = (dish: string, origin: string) => {
        setTempRecipeTarget({ dish, origin });
        setRecipeModalOpen(true);
    };

    const handleCloseRecipe = () => {
        setRecipeModalOpen(false);
        setTempRecipeTarget(null);
    };

    return (
        <div className="w-full h-screen relative">
            {/* Error Toast / Alert */}
            {(error || localError) && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-sm">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-lg" role="alert">
                        <strong className="font-bold">Oops! </strong>
                        <span className="block sm:inline">{error || localError}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setLocalError(null)}>
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                        </span>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-primary font-bold animate-pulse">Loading Osechi...</p>
                    </div>
                </div>
            )}

            <div className="absolute top-3 left-3 right-3 z-10 flex gap-1 sm:gap-2 items-center flex-wrap justify-center sm:justify-end">
                <LanguageToggle />

                {/* Auth */}
                <LoginButton />

                {/* Menu List */}
                <button
                    onClick={() => setMenuModalOpen(true)}
                    className="bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 px-2 py-1.5 sm:px-3 sm:py-2 rounded-sm font-medium shadow-lg hover:bg-black/80 hover:border-amber-400 transition-all flex items-center justify-center text-xs sm:text-sm uppercase tracking-wider"
                    title={t.appTitle}
                >
                    Menu
                </button>

                {/* Guide */}
                <button
                    onClick={() => setHelpModalOpen(true)}
                    className="bg-black/60 hover:bg-black/80 text-amber-300 font-medium py-1.5 px-2 sm:py-2 sm:px-4 rounded-sm shadow-lg backdrop-blur-sm transition-all flex items-center gap-2 border border-amber-500/40 hover:border-amber-400 text-xs sm:text-sm uppercase tracking-wider"
                    title={t.guide}
                >
                    {t.guide}
                </button>

                {/* Open/Close Control */}
                <button
                    onClick={() => setIsExploded(!isExploded)}
                    className="bg-gradient-to-r from-amber-600 to-amber-500 text-black px-3 py-1.5 sm:px-5 sm:py-2 rounded-sm font-bold shadow-lg hover:shadow-amber-500/30 hover:shadow-xl transition-all text-xs sm:text-sm uppercase tracking-wider border border-amber-400"
                >
                    {isExploded ? t.closeBox : t.openBox}
                </button>
            </div>

            <Canvas
                camera={{ position: [6, 6, 10], fov: 40 }}
                gl={{ alpha: true }}
                style={{ background: 'transparent' }}
            >
                <CameraController
                    isExploded={isExploded}
                    controlsRef={controlsRef}
                />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Jubako3D tiers={tiers} onClaimSlot={handleSlotClick} expanded={isExploded} onToggle={() => setIsExploded(!isExploded)} />

                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={40} blur={2} far={20} resolution={512} />
                <OrbitControls
                    ref={controlsRef}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                />
                <Environment preset="city" background={false} />
            </Canvas>

            <ClaimModal
                isOpen={claimModalOpen}
                onClose={() => setClaimModalOpen(false)}
                onSubmit={handleClaim}
                currentDishes={tiers.flatMap(t => t.slots)
                    .filter(s => s !== null)
                    .map(s => ({ dish: s!.dish, color: s!.color, category: s!.category }))}
                onGetRecipe={handleCheckRecipe}
                tierName={selectedSlot ? tiers[selectedSlot.tierIndex].name : undefined}
            />


            <SlotDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                data={selectedSlot ? tiers[selectedSlot.tierIndex].slots[selectedSlot.slotIndex] : null}
                onClear={handleClear}
                onGetRecipe={() => setRecipeModalOpen(true)}
            />

            <RecipeModal
                isOpen={recipeModalOpen}
                onClose={handleCloseRecipe}
                dish={tempRecipeTarget ? tempRecipeTarget.dish : (selectedSlot && tiers[selectedSlot.tierIndex].slots[selectedSlot.slotIndex]
                    ? tiers[selectedSlot.tierIndex].slots[selectedSlot.slotIndex]!.dish
                    : "")}
                origin={tempRecipeTarget ? tempRecipeTarget.origin : (selectedSlot && tiers[selectedSlot.tierIndex].slots[selectedSlot.slotIndex]
                    ? tiers[selectedSlot.tierIndex].slots[selectedSlot.slotIndex]!.origin
                    : undefined)}
            />

            <HelpModal
                isOpen={helpModalOpen}
                onClose={() => setHelpModalOpen(false)}
            />

            <MenuModal
                isOpen={menuModalOpen}
                onClose={() => setMenuModalOpen(false)}
                tiers={tiers}
            />

            <AuthChoiceModal
                isOpen={authChoiceOpen}
                onGuest={handleGuestJoin}
            />



            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-amber-200/30 pointer-events-none uppercase tracking-widest">
                <p>Drag to rotate • Click lid to open • Click slot to claim</p>
            </div>
        </div>
    );
}
