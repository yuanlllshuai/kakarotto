import { useState, useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const OriginPoint = memo(({ position }: any) => {
  const [radius, setRadius] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const circleRef = useRef<any>();
  const countRef = useRef(0);

  useFrame(() => {
    if (circleRef.current) {
      countRef.current += 0.02;
      const r = 0 + (countRef.current % 2);
      const o = 1 - ((countRef.current / 2) % 1);
      setRadius(r);
      setOpacity(o);
    }
  });
  return (
    <mesh
      ref={circleRef}
      position={[position.x, 0.6, position.z]}
      rotation-x={Math.PI / 2}
    >
      <circleGeometry args={[radius, 32]} />
      <meshBasicMaterial
        color="#00CED1"
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
});

export default OriginPoint;
