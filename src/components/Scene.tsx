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
    const targetPos = useRef(new THREE.Vector3(5, 4, 8)); // Start angled
    const lookAtPos = useRef(new THREE.Vector3(0, 0, 0));
    const isAnimating = useRef(false);

    // Trigger animation when view mode changes
    useEffect(() => {
        isAnimating.current = true;
        if (controlsRef.current) controlsRef.current.enabled = false;

        if (isExploded) {
            targetPos.current.set(8, 8, 12);
            lookAtPos.current.set(2.5, 0, 2.5);
        } else {
            targetPos.current.set(5, 4, 8); // Return to angled view when closed
            lookAtPos.current.set(0, 0, 0);
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

// ... existing imports ...

export function Scene() {
    const { tiers, claimSlot, clearSlot, error, loading } = useOsechi();
    const [claimModalOpen, setClaimModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [helpModalOpen, setHelpModalOpen] = useState(false);
    const [menuModalOpen, setMenuModalOpen] = useState(false);
    const [recipeModalOpen, setRecipeModalOpen] = useState(false);
    const [tempRecipeTarget, setTempRecipeTarget] = useState<{ dish: string; origin: string } | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<{ tierIndex: number; slotIndex: number } | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isExploded, setIsExploded] = useState(false);
    const controlsRef = useRef<OrbitControlsImpl>(null);

    // Check for first-time visit
    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            const hasVisited = localStorage.getItem("osechi_visited");
            if (!hasVisited) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setHelpModalOpen(true);
                localStorage.setItem("osechi_visited", "true");
            }
        }
    }, []);

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
        <div className="w-full h-[600px] relative">
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

            <div className="absolute top-4 right-4 z-10 flex gap-3 items-center">
                {/* Auth */}
                <LoginButton />

                {/* Menu List */}
                <button
                    onClick={() => setMenuModalOpen(true)}
                    className="bg-white/80 backdrop-blur-sm border-2 border-primary text-primary w-10 h-10 rounded-full font-bold shadow-md hover:bg-white transition-all flex items-center justify-center text-xl active:scale-95"
                    title="View Full Menu"
                >
                    📜
                </button>

                {/* Guide */}
                <button
                    onClick={() => setHelpModalOpen(true)}
                    className="bg-white/80 hover:bg-white text-gray-700 font-bold py-2 px-4 rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-white/50"
                    title="Osechi Guide"
                >
                    <span className="text-lg">🍱</span>
                    <span className="hidden sm:inline">Guide</span>
                </button>

                {/* Open/Close Control */}
                <button
                    onClick={() => setIsExploded(!isExploded)}
                    className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-sm sm:text-base border-2 border-primary"
                >
                    {isExploded ? "📦 Close Box" : "✨ Open Osechi"}
                </button>
            </div>

            <Canvas camera={{ position: [5, 4, 8], fov: 50 }}>
                <CameraController
                    isExploded={isExploded}
                    controlsRef={controlsRef}
                />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Jubako3D tiers={tiers} onClaimSlot={handleSlotClick} expanded={isExploded} />

                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={40} blur={2} far={20} resolution={512} />
                <OrbitControls
                    ref={controlsRef}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                />
                <Environment preset="city" />
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



            <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-400 pointer-events-none">
                <p>Drag to rotate • Click slot to claim</p>
            </div>
        </div>
    );
}
