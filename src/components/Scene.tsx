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

function CameraController({ isExploded, controlsRef }: { isExploded: boolean; controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
    const { camera } = useThree();
    const [isAnimating, setIsAnimating] = useState(false);
    const targetPos = useRef(new THREE.Vector3(5, 4, 8)); // Start angled
    const lookAtPos = useRef(new THREE.Vector3(0, 0, 0));

    // Trigger animation when view mode changes
    useEffect(() => {
        setIsAnimating(true);
        if (isExploded) {
            targetPos.current.set(8, 8, 12);
            lookAtPos.current.set(2.5, 0, 2.5);
        } else {
            targetPos.current.set(5, 4, 8); // Return to angled view when closed
            lookAtPos.current.set(0, 0, 0);
        }
    }, [isExploded]);

    useFrame((state, delta) => {
        if (!isAnimating) return;

        // Smoothly interpolate camera position
        camera.position.lerp(targetPos.current, 0.05);

        // Smoothly interpolate controls target
        if (controlsRef.current) {
            controlsRef.current.target.lerp(lookAtPos.current, 0.05);
            controlsRef.current.update();
        }

        // Check if we arrived
        if (camera.position.distanceTo(targetPos.current) < 0.1) {
            setIsAnimating(false);
        }
    });

    return null;
}

export function Scene() {
    const { tiers, claimSlot, clearSlot, error, loading } = useOsechi();
    const [claimModalOpen, setClaimModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ tierIndex: number; slotIndex: number } | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isExploded, setIsExploded] = useState(false);
    const controlsRef = useRef<OrbitControlsImpl>(null);

    const handleSlotClick = (tierIndex: number, slotIndex: number) => {
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

    const handleClaim = (data: { user: string; dish: string; color: FoodColor }) => {
        if (selectedSlot) {
            const result = claimSlot(selectedSlot.tierIndex, selectedSlot.slotIndex, data);
            if (result.success) {
                setClaimModalOpen(false);
                setSelectedSlot(null);
            } else {
                setLocalError(result.message || "Error claiming slot");
            }
        }
    };

    const handleClear = () => {
        if (selectedSlot) {
            clearSlot(selectedSlot.tierIndex, selectedSlot.slotIndex);
            setDetailsModalOpen(false);
            setSelectedSlot(null);
        }
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
                        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-[var(--primary)] font-bold animate-pulse">Loading Osechi...</p>
                    </div>
                </div>
            )}

            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => setIsExploded(!isExploded)}
                    className="bg-white/80 backdrop-blur-sm border-2 border-[var(--primary)] text-[var(--primary)] px-4 py-2 rounded-full font-bold shadow-md hover:bg-white transition-all"
                >
                    {isExploded ? "📦 Close Box" : "🍱 Open Osechi"}
                </button>
            </div>

            <Canvas camera={{ position: [5, 4, 8], fov: 50 }}>
                <CameraController isExploded={isExploded} controlsRef={controlsRef} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Jubako3D tiers={tiers} onClaimSlot={handleSlotClick} expanded={isExploded} />

                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={1.5} far={4.5} />
                <OrbitControls ref={controlsRef} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
                <Environment preset="city" />
            </Canvas>

            <ClaimModal
                isOpen={claimModalOpen}
                onClose={() => setClaimModalOpen(false)}
                onSubmit={handleClaim}
            />

            <SlotDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                data={selectedSlot ? tiers[selectedSlot.tierIndex].slots[selectedSlot.slotIndex] : null}
                onClear={handleClear}
            />

            <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-400 pointer-events-none">
                <p>Drag to rotate • Click slot to claim</p>
            </div>
        </div>
    );
}
