import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const createGradient = (gradient: any, color: string) => {
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.01, color);
  gradient.addColorStop(0.05, "rgba(148, 0, 211,0.1)");
  gradient.addColorStop(0.1, "rgba(148, 0, 211,0.05)");
  gradient.addColorStop(0.3, "rgba(255,255,255,0)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0)");
  gradient.addColorStop(0.6, "rgba(255,255,255,0)");
  gradient.addColorStop(0.7, "rgba(255,255,255,0)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
};

const FlyLine = ({ position }: any) => {
  const linrOffset = 1;

  const [curve, setCurve] = useState<any>();
  const [texture, setTexture] = useState<any>();

  const countRef = useRef(0);

  useEffect(() => {
    if (position) {
      const x = position.x / 2;
      const z = (position.z / position.x) * x;
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, 5, z),
        new THREE.Vector3(position.x, 0, position.z)
      );
      setCurve(curve);
      createGradientTexture(100, 1);
    }
  }, [position]);

  const createGradientTexture = (width: number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, width, 0);
    // createGradient(gradient,'#00BFFF');
    createGradient(gradient, "rgba(148, 0, 211,0.3)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.offset.x = -linrOffset; // 初始偏移量
    texture.repeat.set(-0.5, 0); // 防止重复
    texture.wrapS = THREE.RepeatWrapping; // 防止拉伸
    texture.wrapT = THREE.RepeatWrapping; // 防止拉伸
    setTexture(texture);
  };

  useFrame(() => {
    if (texture) {
      countRef.current += 0.005;
      texture.offset.x = -linrOffset + (countRef.current % linrOffset);
    }
  });
  return (
    <>
      <mesh position={[0, 0.6, 0]}>
        <tubeGeometry args={[curve, 100, 0.02, 10, false]} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          map={texture}
          transparent={true}
          depthWrite={false}
          depthTest={false}
          emissive={[148, 0, 211]}
          emissiveIntensity={0.1}
          // blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
};

export default FlyLine;
