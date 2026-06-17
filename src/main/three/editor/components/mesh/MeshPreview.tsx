import { BOX_SIZE } from "../../constants/grid";
import type { MeshEntity } from "../../types/scene";

interface MeshPreviewProps {
    entity: MeshEntity;
}

export function MeshPreview({ entity }: MeshPreviewProps) {
    return (
        <mesh position={entity.transform.position}>
            <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
            <meshStandardMaterial
                color={entity.material.color}
                transparent
                opacity={0.4}
                depthWrite={false}
            />
        </mesh>
    );
}
