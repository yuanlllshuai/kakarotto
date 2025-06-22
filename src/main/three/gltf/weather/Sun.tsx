import { memo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

const Index = memo(
  ({ position, scale = 1 }: { position: THREE.Vector3; scale?: number }) => {
    return (
      <RoundedBox
        position={position}
        args={[1, 1, 1]} // Width, height, depth. Default is [1, 1, 1]
        radius={0.5} // Radius of the rounded corners. Default is 0.05
        steps={1} // Extrusion steps. Default is 1
        smoothness={4} // The number of curve segments. Default is 4
        bevelSegments={4} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
        creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
        scale={scale}
      >
        <meshPhongMaterial
          color="orange"
          emissive={[255, 185, 15]}
          emissiveIntensity={0.01}
        />
      </RoundedBox>
    );
  }
);

export default Index;
