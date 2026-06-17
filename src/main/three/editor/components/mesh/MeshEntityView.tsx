import { Edges } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useRef } from "react";
import type { MutableRefObject } from "react";
import type * as THREE from "three";
import { BOX_SIZE } from "../../constants/grid";
import type { EditorMode } from "../../types/editor";
import type { MeshEntity } from "../../types/scene";
import { MeshTransformControls } from "../controls/MeshTransformControls";

interface MeshEntityViewProps {
    entity: MeshEntity;
    isSelected: boolean;
    isHovered: boolean;
    mode: EditorMode;
    blockTransform: boolean;
    onPointerDown: (e: ThreeEvent<PointerEvent>) => void;
    onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
    onPointerOut: (e: ThreeEvent<PointerEvent>) => void;
}

export function MeshEntityView({
    entity,
    isSelected,
    isHovered,
    mode,
    blockTransform,
    onPointerDown,
    onPointerOver,
    onPointerOut,
}: MeshEntityViewProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const showTransform =
        isSelected &&
        !blockTransform &&
        (mode === "translate" || mode === "rotate" || mode === "scale");

    return (
        <>
            <mesh
                ref={meshRef}
                position={entity.transform.position}
                rotation={entity.transform.rotation}
                scale={entity.transform.scale}
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
                onPointerDown={onPointerDown}
            >
                <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
                <meshStandardMaterial color={entity.material.color} />
                {(isHovered || isSelected) && (
                    <Edges color="red" threshold={15} scale={1.01} />
                )}
            </mesh>
            {showTransform && (
                <MeshTransformControls
                    objectRef={meshRef as MutableRefObject<THREE.Object3D>}
                    mode={mode}
                />
            )}
        </>
    );
}
