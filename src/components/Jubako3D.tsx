"use client";

import { useRef } from "react";
import { TierData } from "@/hooks/useOsechi";
import { Tier3D } from "./Tier3D";
import { Lid3D } from "./Lid3D";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Jubako3DProps {
    tiers: TierData[];
    onClaimSlot: (tierIndex: number, slotIndex: number) => void;
    expanded: boolean;
}

export function Jubako3D({ tiers, onClaimSlot, expanded }: Jubako3DProps) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Rotate the whole box slightly for better 3D effect
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;

            // Smoothly interpolate positions
            groupRef.current.children.forEach((child, index) => {
                // Skip the last child if it's the Lid (Lid is added last)
                if (index >= tiers.length) return;

                let targetPos = new THREE.Vector3(0, (2 - index) * 1.5, 0);

                if (expanded) {
                    // Staircase layout: Offset X and Z for lower tiers
                    // Top (0): [0, 2, 0]
                    // Middle (1): [2.5, 0, 2.5]
                    // Bottom (2): [5.0, -2, 5.0]
                    const offset = index * 2.5;
                    targetPos.set(offset, (2 - index) * 1.5, offset);
                } else {
                    // Closed Stack: Tiers stacked vertically
                    // Ensure they are close together
                    targetPos.set(0, (2 - index) * 1.0, 0); // 1.0 spacing for perfect stack
                }

                child.position.lerp(targetPos, 0.1);
            });
        }
    });

    return (
        <group ref={groupRef}>
            {tiers.map((tier, index) => (
                <Tier3D
                    key={tier.id}
                    position={[0, (2 - index) * 1.0, 0]} // Initial position matches closed state
                    tier={tier}
                    isOpen={expanded}
                    onClaimSlot={(slotIndex) => onClaimSlot(index, slotIndex)}
                />
            ))}
            <Lid3D isOpen={expanded} />
        </group>
    );
}
