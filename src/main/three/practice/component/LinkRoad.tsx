import * as THREE from "three";
import Highlight from "./Highlight";
import { useEffect, useState } from "react";

const Index = () => {
  const [arrow, setArrow] = useState<THREE.Mesh>();

  useEffect(() => {
    createArrow();
  }, []);

  const createArrow = () => {
    const arrowVertices = new Float32Array([
      0,
      0,
      -0.2,
      0.5,
      0,
      0,
      0,
      0,
      -Math.sqrt(3) / 2,
      0,
      0,
      -Math.sqrt(3) / 2,
      -0.5,
      0,
      0,
      0,
      0,
      -0.2,
    ]);
    const arrowGeometry = new THREE.BufferGeometry();
    arrowGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(arrowVertices, 3)
    );
    const material = new THREE.MeshStandardMaterial({
      color: "#FFF",
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      opacity: 0.5,
      // emissive: "#FFF",
      // emissiveIntensity: 0.1,
    });
    const mesh = new THREE.Mesh(arrowGeometry, material);
    setArrow(mesh);
  };
  return (
    <>
      <mesh rotation-x={Math.PI / 2}>
        <planeGeometry args={[0.3, 1.5]}></planeGeometry>
        <meshBasicMaterial
          transparent={true}
          opacity={0.1}
          color="#00FFFF"
          side={THREE.DoubleSide}
        />
      </mesh>
      <Highlight
        meshProps={{ "rotation-x": Math.PI / 2 }}
        planProps={{ args: [0.3, 1.5] }}
        color="#9bf8f8"
      />
      {arrow && (
        <primitive
          object={arrow}
          position={[0, 0, 0]}
          scale={0.1}
          // rotation-y={getRotationY()}
        />
      )}
    </>
  );
};

export default Index;
