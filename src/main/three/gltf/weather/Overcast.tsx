import { memo } from "react";
import cloudPng from "../../res/cloud.png";
import * as THREE from "three";
import { Clouds, Cloud } from "@react-three/drei";

const Index = memo(({ position }: { position: THREE.Vector3 }) => {
  return (
    <>
      <Clouds
        material={THREE.MeshBasicMaterial}
        texture={cloudPng}
        position={[position.x, 5, position.z]}
        scale={0.1}
      >
        <Cloud
          segments={40}
          bounds={[10, 2, 2]}
          volume={10}
          color="#E0E0E0"
          speed={1}
        />
      </Clouds>
    </>
  );
});

export default Index;
