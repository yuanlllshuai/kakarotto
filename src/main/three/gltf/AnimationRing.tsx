import { useRef, memo, useEffect } from "react";
import { Ring } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import * as TWEEN from "@tweenjs/tween.js";

const Index = memo(() => {
  const gap = Math.PI / 16; // 定义间隙大小（角度）
  const segmentAngle = (Math.PI * 2 - gap * 4) / 4; // 每段的角度
  const innerRadius = 0.94 * 9;
  const outRadius = 1 * 9;

  const ringRef = useRef<any>();
  const tweenRef = useRef<any>(null);

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
      if (ringRef.current.rotation.z > Math.PI * 2) {
        ringRef.current.rotation.z = 0;
      }
    }
    if (tweenRef.current) {
      tweenRef.current.update();
    }
  });

  useEffect(() => {
    const startPoint = new THREE.Vector3(0, 0, 0);
    const endPoint = new THREE.Vector3(1, 1, 1);
    tweenRef.current = new TWEEN.Tween(startPoint)
      .to(endPoint, 3000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate((scale) => {
        if (ringRef.current) {
          ringRef.current.scale.copy(scale);
        }
      })
      .start();
  }, []);

  return (
    <>
      <group
        position={[0, -0.4, 0]}
        rotation-x={Math.PI / 2}
        ref={ringRef}
        scale={0}
      >
        {new Array(4)
          .fill(1)
          .map((_i, index) => index)
          .map((i, index) => (
            <Ring
              key={i}
              args={[
                innerRadius,
                outRadius,
                32,
                1,
                segmentAngle * index + gap * index,
                segmentAngle,
              ]}
            >
              <meshStandardMaterial
                color="rgba(0 ,191 ,255,1)"
                side={THREE.DoubleSide}
                opacity={0.1}
                transparent={true}
              />
            </Ring>
          ))}
      </group>
    </>
  );
});

export default Index;
