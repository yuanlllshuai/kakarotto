import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const Index = ({ progress }: { progress: any }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (cameraRef.current) {
      const position = new THREE.Vector3(
        0,
        0,
        // progress.current,
        -1.4 + progress.current * 7,
      );
      cameraRef.current.position.copy(position);
      cameraRef.current.lookAt(0, 0, -10);
      // cameraRef.current.lookAt(0, progress.current, -10);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      args={[75, window.innerWidth / window.innerHeight, 0.1, 1000]}
      position={[0, 0, -1.8]}
    />
  );
};

export default Index;
