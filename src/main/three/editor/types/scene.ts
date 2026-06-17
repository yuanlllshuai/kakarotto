export type Vec3 = [number, number, number];

export interface Transform {
    position: Vec3;
    rotation: Vec3;
    scale: Vec3;
}

export type MeshType = "box";

export interface MeshEntity {
    id: string;
    type: MeshType;
    transform: Transform;
    material: { color: string };
    visible: boolean;
}

export interface SceneDocument {
    entities: MeshEntity[];
}

export const DEFAULT_TRANSFORM: Transform = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
};

export function createBoxEntity(
    position: Vec3,
    color: string,
    id = `${Date.now()}`,
): MeshEntity {
    return {
        id,
        type: "box",
        transform: {
            ...DEFAULT_TRANSFORM,
            position,
        },
        material: { color },
        visible: true,
    };
}
