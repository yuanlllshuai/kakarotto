import type { ThreeEvent } from "@react-three/fiber";
import type * as THREE from "three";
import type { EditorRefs } from "../context/EditorContext";
import type { EditorAppDispatch, EditorRootState } from "../store";
import type { Vec3 } from "../types/scene";

export interface ToolContext {
    dispatch: EditorAppDispatch;
    getState: () => EditorRootState;
    refs: EditorRefs;
    raycast: {
        getGridPosition: (clientX: number, clientY: number, excludeId?: string) => Vec3 | null;
        getGridPositionFromPoint: (point: THREE.Vector3, excludeId?: string) => Vec3;
    };
    setOrbitEnabled: (enabled: boolean) => void;
    dragSession: {
        entityId: string | null;
        hasMoved: boolean;
        startX: number;
        startY: number;
    };
}

export interface EditorTool {
    onPlanePointerDown?: (ctx: ToolContext, e: ThreeEvent<PointerEvent>) => void;
    onEntityPointerDown?: (ctx: ToolContext, e: ThreeEvent<PointerEvent>, entityId: string) => void;
    onPointerMove?: (ctx: ToolContext, e: PointerEvent) => void;
    onPointerUp?: (ctx: ToolContext, e: PointerEvent) => void;
}
