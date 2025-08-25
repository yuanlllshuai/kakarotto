import { useRef, memo, useEffect } from "react";
import { Ring } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import * as TWEEN from "@tweenjs/tween.js";

const gap = Math.PI / 16; // 定义间隙大小（角度）
const segmentAngle = (Math.PI * 2 - gap * 4) / 4; // 每段的角度
const innerRadius = 0.94 * 9;
const outRadius = 1 * 9;

const gap2 = Math.PI / 30; // 定义间隙大小（角度）
const segmentAngle2 = (Math.PI * 2 - gap2 * 5) / 5; // 每段的角度
const innerRadius2 = 0.99 * 11;
const outRadius2 = 1 * 11;

const Index = memo(() => {
  const ringRef = useRef<any>();
  const ringRef2 = useRef<any>();
  const tweenRef = useRef<any>(null);

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
      if (ringRef.current.rotation.z > Math.PI * 2) {
        ringRef.current.rotation.z = 0;
      }
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z -= 0.002;
      if (ringRef2.current.rotation.z < -Math.PI * 2) {
        ringRef2.current.rotation.z = 0;
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
          ringRef2.current.scale.copy(scale);
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
      <group
        position={[0, -0.4, 0]}
        rotation-x={Math.PI / 2}
        ref={ringRef2}
        scale={0}
      >
        {new Array(5)
          .fill(1)
          .map((_i, index) => index)
          .map((i, index) => (
            <Ring
              key={i}
              args={[
                innerRadius2,
                outRadius2,
                32,
                1,
                segmentAngle2 * index + gap2 * index,
                segmentAngle2,
              ]}
            >
              <meshStandardMaterial
                color="rgba(0 ,191 ,255,1)"
                side={THREE.DoubleSide}
                opacity={0.05}
                transparent={true}
              />
            </Ring>
          ))}
      </group>
    </>
  );
});

export default Index;
