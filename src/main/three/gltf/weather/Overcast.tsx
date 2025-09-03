import { memo } from "react";
import cloudPng from "../../res/cloud.png";
import * as THREE from "three";
import { Clouds, Cloud } from "@react-three/drei";

const Index = memo(({ color = "#E0E0E0" }: { color?: string }) => {
  return (
    <>
      <Clouds
        material={THREE.MeshBasicMaterial}
        texture={cloudPng}
        position={[0, 0, 0]}
        scale={0.1}
      >
        <Cloud
          segments={40}
          bounds={[10, 2, 2]}
          volume={10}
          color={color}
          speed={1}
        />
      </Clouds>
    </>
  );
});

export default Index;
