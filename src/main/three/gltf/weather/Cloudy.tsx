import { memo } from "react";
import cloudPng from "../../res/cloud.png";
import * as THREE from "three";
import { Clouds, Cloud } from "@react-three/drei";
import Sun from "./Sun";

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
          color="white"
          speed={1}
        />
      </Clouds>
      <Sun
        position={new THREE.Vector3(position.x + 0.3, 5.3, position.z + 0.1)}
        scale={0.7}
      />
    </>
  );
});

export default Index;
