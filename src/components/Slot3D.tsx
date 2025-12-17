"use client";

import { useRef, useState } from "react";
import { SlotData, FoodColor } from "@/hooks/useOsechi";
import { Text, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Slot3DProps {
    position: [number, number, number];
    data: SlotData | null;
    isOpen: boolean;
    onClick: () => void;
}

const COLOR_MAP: Record<FoodColor, string> = {
    Red: "#D9381E",
    Green: "#4CAF50",
    Yellow: "#F2C94C",
    White: "#FFFFFF",
    Brown: "#8D6E63",
};

const EMOJI_MAP: Record<string, string> = {
    Red: "🔴",
    Green: "🟢",
    Yellow: "🟡",
    White: "⚪",
    Brown: "🟤",
};

export function Slot3D({ position, data, isOpen, onClick }: Slot3DProps) {
    const [hovered, setHover] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);

    const isFilled = !!data;

    useFrame((state) => {
        if (meshRef.current) {
            // Floating animation only when open and empty
            if (isOpen && !isFilled) {
                meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
            } else {
                meshRef.current.position.y = 0;
            }
        }
    });

    // Revert to original light grey
    const color = isFilled ? (data?.color ? COLOR_MAP[data.color] : "#D9381E") : (hovered && isOpen ? "#e0e0e0" : "#f0f0f0");

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isOpen) onClick();
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    if (isOpen) setHover(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHover(false);
                }}
            >
                <boxGeometry args={[0.8, 0.8, 0.8]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {isFilled && data && (
                <>
                    <Text
                        position={[0, 0, 0.5]}
                        fontSize={0.4}
                        color="black"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {EMOJI_MAP[data.color]}
                    </Text>

                    {hovered && isOpen && (
                        <Html position={[0, 1, 0]} center pointerEvents="none">
                            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap backdrop-blur-sm border border-white/20">
                                <p className="font-bold">{data.dish}</p>
                                <p className="opacity-75 text-[10px]">by {data.user}</p>
                            </div>
                        </Html>
                    )}
                </>
            )}

            {!isFilled && hovered && isOpen && (
                <Text
                    position={[0, 0, 0.5]}
                    fontSize={0.4}
                    color="#ddd"
                    anchorX="center"
                    anchorY="middle"
                >
                    +
                </Text>
            )}
        </group>
    );
}
