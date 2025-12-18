import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface Lid3DProps {
    isOpen: boolean;
    onClose?: () => void;
}

export function Lid3D({ isOpen, onClose }: Lid3DProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [lidTexture, redLacquer] = useTexture([
        "/textures/lid_texture_horse.jpg",
        "/textures/lacquer_red.png",
    ]);

    // Adjust texture properties
    // Top texture (Snake) - Clamp
    lidTexture.wrapS = lidTexture.wrapT = THREE.ClampToEdgeWrapping;
    lidTexture.repeat.set(1, 1);
    lidTexture.center.set(0.5, 0.5);
    lidTexture.rotation = -Math.PI / 2;

    // Side texture (Red Lacquer) - Repeat
    redLacquer.wrapS = redLacquer.wrapT = THREE.RepeatWrapping;
    redLacquer.repeat.set(2, 0.2); // Adjust repeat for thin sides

    const blackMaterialProps = {
        color: "#151515", // Deep glossy dark grey
        roughness: 0.1,
        metalness: 0.3,
    };

    useFrame((state, delta) => {
        if (groupRef.current) {
            const targetPos = new THREE.Vector3();
            const targetRot = new THREE.Euler();

            if (isOpen) {
                // Lift up and move away
                targetPos.set(5, 5, -5);
                targetRot.set(0, Math.PI / 4, Math.PI / 6);
            } else {
                // Sit on top of the stack (index 0 is at y=2.0, top is 2.3)
                // Lid bottom is at -0.3 relative to center.
                // So target Y = 2.6
                targetPos.set(0, 2.6, 0);
                targetRot.set(0, 0, 0);
            }

            groupRef.current.position.lerp(targetPos, 0.05);
            // Smooth rotation interpolation
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot.x, 0.05);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot.y, 0.05);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot.z, 0.05);
        }
    });

    const handleClick = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        if (onClose) {
            onClose(); // This is actually a toggle function now
        }
    };

    return (
        <group
            ref={groupRef}
            position={[0, 2.6, 0]}
            onClick={handleClick}
            onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
                document.body.style.cursor = "auto";
            }}
        >
            {/* Lid Top - Multi-material mesh */}
            {/* Materials order: Right, Left, Top, Bottom, Front, Back */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.6, 0.2, 3.6]} />
                {/* Right */}
                <meshStandardMaterial attach="material-0" map={redLacquer} roughness={0.1} metalness={0.3} />
                {/* Left */}
                <meshStandardMaterial attach="material-1" map={redLacquer} roughness={0.1} metalness={0.3} />
                {/* Top (Snake) */}
                <meshStandardMaterial attach="material-2" map={lidTexture} roughness={0.1} metalness={0.3} />
                {/* Bottom */}
                <meshStandardMaterial attach="material-3" map={redLacquer} roughness={0.1} metalness={0.3} />
                {/* Front */}
                <meshStandardMaterial attach="material-4" map={redLacquer} roughness={0.1} metalness={0.3} />
                {/* Back */}
                <meshStandardMaterial attach="material-5" map={redLacquer} roughness={0.1} metalness={0.3} />
            </mesh>

            {/* Lid Sides (Rim) - Black Lacquer */}
            <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.5, 0.2, 3.5]} />
                <meshStandardMaterial {...blackMaterialProps} />
            </mesh>
        </group>
    );
}
