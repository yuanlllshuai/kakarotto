import { TransformControls } from "@react-three/drei";
import type { MutableRefObject } from "react";
import type * as THREE from "three";
import type { EditorMode } from "../../types/editor";

const modeMap: Record<"translate" | "rotate" | "scale", "translate" | "rotate" | "scale"> = {
    translate: "translate",
    rotate: "rotate",
    scale: "scale",
};

interface MeshTransformControlsProps {
    objectRef: MutableRefObject<THREE.Object3D>;
    mode: EditorMode;
}

export function MeshTransformControls({ objectRef, mode }: MeshTransformControlsProps) {
    if (mode !== "translate" && mode !== "rotate" && mode !== "scale") {
        return null;
    }

    return <TransformControls object={objectRef} mode={modeMap[mode]}/>;
}
