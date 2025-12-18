"use client";

import { useRef, useState } from "react";
import { TierData } from "@/hooks/useOsechi";
import { Slot3D } from "./Slot3D";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface Tier3DProps {
    position: [number, number, number];
    tier: TierData;
    isOpen: boolean;
    onClaimSlot: (slotIndex: number) => void;
}

export function Tier3D({ position, tier, isOpen, onClaimSlot }: Tier3DProps) {
    const [redLacquer] = useTexture([
        "/textures/lacquer_red.png",
    ]);

    // Adjust texture properties for realism
    redLacquer.wrapS = redLacquer.wrapT = THREE.RepeatWrapping;
    redLacquer.repeat.set(2, 2);

    const blackMaterialProps = {
        color: "#151515", // Deep glossy dark grey
        roughness: 0.1,
        metalness: 0.3,
    };

    return (
        <group position={position}>
            {/* Container Box (Lacquerware style) */}

            {/* Rim for Seam Visibility */}
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.55, 0.05, 3.55]} />
                <meshStandardMaterial {...blackMaterialProps} />
            </mesh>

            {/* Base - Black Outside */}
            <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.5, 0.2, 3.5]} />
                <meshStandardMaterial {...blackMaterialProps} />
            </mesh>
            {/* North Wall - Black Outside */}
            <mesh position={[0, -0.1, -1.65]} castShadow receiveShadow>
                <boxGeometry args={[3.5, 0.8, 0.2]} />
                <meshStandardMaterial {...blackMaterialProps} />
            </mesh>
            {/* South Wall */}
            <mesh position={[0, -0.1, 1.65]} castShadow receiveShadow>
                <boxGeometry args={[3.5, 0.8, 0.2]} />
                <meshStandardMaterial {...blackMaterialProps} />
            </mesh>
            {/* East Wall */}
            <mesh position={[1.65, -0.1, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 0.8, 3.1]} />
                <meshStandardMaterial {...blackMaterialProps} />
            </mesh>
            {/* West Wall */}
            <mesh position={[-1.65, -0.1, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 0.8, 3.1]} />
                <meshStandardMaterial {...blackMaterialProps} />
            </mesh>

            {/* Labels on all 4 sides - Only visible when open */}
            {isOpen && (
                <>
                    {/* North Label */}
                    <Text
                        position={[0, -0.05, -1.76]}
                        rotation={[0, Math.PI, 0]}
                        fontSize={0.22}
                        color="#F2C94C"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {tier.name}
                    </Text>
                    {/* South Label */}
                    <Text
                        position={[0, -0.05, 1.76]}
                        fontSize={0.22}
                        color="#F2C94C"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {tier.name}
                    </Text>
                    {/* East Label */}
                    <Text
                        position={[1.76, -0.05, 0]}
                        rotation={[0, Math.PI / 2, 0]}
                        fontSize={0.22}
                        color="#F2C94C"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {tier.name}
                    </Text>
                    {/* West Label */}
                    <Text
                        position={[-1.76, -0.05, 0]}
                        rotation={[0, -Math.PI / 2, 0]}
                        fontSize={0.22}
                        color="#F2C94C"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {tier.name}
                    </Text>
                </>
            )}

            {/* Slots */}
            {(tier.slots || []).map((slot, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                return (
                    <Slot3D
                        key={index}
                        // Grid layout: 3 rows, 3 cols. Centered.
                        // x: (col - 1) * 1.0
                        // z: (row - 1) * 1.0
                        position={[(col - 1) * 1.0, 0, (row - 1) * 1.0]}
                        data={slot}
                        isOpen={isOpen}
                        onClick={() => onClaimSlot(index)}
                    />
                );
            })}
        </group>
    );
}
