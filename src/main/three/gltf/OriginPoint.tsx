import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const OriginPoint = memo(({ position }: any) => {
  const circleRef = useRef<any>();
  const countRef = useRef(0);
  const materialRef = useRef<any>();

  useFrame(() => {
    if (circleRef.current) {
      countRef.current += 0.01;
      const r = 0 + (countRef.current % 2);
      const o = 1 - ((countRef.current / 2) % 1);
      circleRef.current.scale.set(r, r, r);
      materialRef.current.opacity = o;
    }
  });
  return (
    <mesh
      ref={circleRef}
      position={[position.x, 0.6, position.z]}
      rotation-x={Math.PI / 2}
    >
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#00CED1"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
});

export default OriginPoint;
