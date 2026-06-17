import type { ThreeEvent } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { PLANE_SIZE } from "../../constants/grid";
import { useEditorRefs } from "../../context/EditorContext";

interface GroundPlaneProps {
    onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
    pointerEnabled?: boolean;
}

const disableRaycast = () => {};

export function GroundPlane({ onPointerDown, pointerEnabled = true }: GroundPlaneProps) {
    const { planeRef } = useEditorRefs();
    const texture = useLoader(THREE.TextureLoader, "/gltf_models/common/checker.png");

    const planeTexture = useMemo(() => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.repeat.set(8, 8);
        return texture;
    }, [texture]);

    return (
        <mesh
            ref={planeRef}
            rotation={[-Math.PI / 2, 0, 0]}
            {...(pointerEnabled ? {} : { raycast: disableRaycast })}
            onPointerDown={pointerEnabled ? onPointerDown : undefined}
        >
            <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
            <meshStandardMaterial map={planeTexture} side={THREE.DoubleSide} />
        </mesh>
    );
}
