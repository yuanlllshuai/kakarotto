import { useCallback, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEditorRefs } from "../context/EditorContext";
import { getPlacementPosition } from "../utils/grid";
import type { MeshEntity, Vec3 } from "../types/scene";
import { useAppSelector } from "../store/hooks";

export function usePlaneRaycast() {
    const { planeRef } = useEditorRefs();
    const entities = useAppSelector((state) => state.scene.entities);
    const { raycaster, camera, gl } = useThree();
    const pointer = useMemo(() => new THREE.Vector2(), []);

    const getGridPosition = useCallback(
        (clientX: number, clientY: number, excludeId?: string): Vec3 | null => {
            if (!planeRef.current) return null;
            const rect = gl.domElement.getBoundingClientRect();
            pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObject(planeRef.current);
            if (hits.length === 0) return null;
            return getPlacementPosition(hits[0].point, entities as MeshEntity[], excludeId);
        },
        [camera, entities, gl, pointer, planeRef, raycaster],
    );

    const getGridPositionFromPoint = useCallback(
        (point: THREE.Vector3, excludeId?: string): Vec3 => {
            return getPlacementPosition(point, entities as MeshEntity[], excludeId);
        },
        [entities],
    );

    return { getGridPosition, getGridPositionFromPoint };
}
