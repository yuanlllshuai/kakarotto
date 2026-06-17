import { BOX_SIZE, GRID_SIZE } from "../constants/grid";
import type { MeshEntity, Vec3 } from "../types/scene";
import type * as THREE from "three";

export function snapToGrid(value: number) {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function getPlacementY(entities: MeshEntity[], x: number, z: number, excludeId?: string) {
    const stacked = entities.filter(
        (entity) =>
            entity.transform.position[0] === x &&
            entity.transform.position[2] === z &&
            entity.id !== excludeId,
    );
    if (stacked.length === 0) return BOX_SIZE / 2;
    return Math.max(...stacked.map((entity) => entity.transform.position[1])) + BOX_SIZE;
}

export function getPlacementPosition(
    point: THREE.Vector3,
    entities: MeshEntity[],
    excludeId?: string,
): Vec3 {
    const x = snapToGrid(point.x);
    const z = snapToGrid(point.z);
    const y = getPlacementY(entities, x, z, excludeId) + 0.01;
    return [x, y, z];
}
