import React, { memo, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Points } from "@react-three/drei";
import Overcast from "./Overcast";
// import Lightning from "./Lighting"; // Add this import

const COUNTMAP = {
  small: { count: 60, speed: 0.6 },
  middle: { count: 200, speed: 0.8 },
  large: { count: 600, speed: 1 },
};
const LENGTH = 5;

const Index = memo(
  ({
    position,
    size = "small",
  }: {
    position: THREE.Vector3;
    size?: "small" | "middle" | "large";
  }) => {
    const rainRef = useRef<THREE.Points>(null!);
    const [count, setCount] = useState(0);
    const [positions, setPositions] = useState<Float32Array>(
      new Float32Array(0)
    );

    const createGradientTexture = useMemo(() => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d") as any;
      canvas.width = 12;
      canvas.height = 3;
      const gradient = context.createLinearGradient(0, 0, 0, 12);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(0.2, "rgba(255,255,255,0.2)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0.3)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
      gradient.addColorStop(0.7, "rgba(255,255,255,0.7)");
      gradient.addColorStop(0.8, "rgba(255,255,255,0.8)");
      gradient.addColorStop(1, "rgba(255,255,255,1)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 2, 12);
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    }, []);

    useEffect(() => {
      setCount(COUNTMAP[size].count);
      const count = COUNTMAP[size].count;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() * 2 - 1) * 0.6 + position.x;
        positions[i * 3 + 1] = Math.random() * LENGTH;
        positions[i * 3 + 2] = (Math.random() * 2 - 1) * 0.6 + position.z;
      }
      setPositions(positions);
    }, [size]);

    useFrame(() => {
      if (count !== 0) {
        const speed = COUNTMAP[size].speed;
        const positions = rainRef.current.geometry.attributes.position.array;
        for (let i = 0; i < count * 3; i += 3) {
          positions[i + 1] -= LENGTH * 0.01 * 2 * speed;
          if (positions[i + 1] < 0) {
            positions[i + 1] = LENGTH;
          }
        }
        rainRef.current.geometry.attributes.position.needsUpdate = true;
      }
    });

    if (count === 0) {
      return <></>;
    }

    return (
      <>
        {/* <Lightning position={[position.x, 5, position.z]} /> */}
        <Overcast position={position} color="#D0D0D0" />
        <Points
          ref={rainRef}
          limit={1000} // Optional: max amount of items (for calculating buffer size)
          range={10} // Optional: draw-range
          positions={positions}
        >
          <pointsMaterial
            size={0.1}
            transparent
            alphaMap={createGradientTexture}
            depthWrite={false}
            color="white"
          />
        </Points>
      </>
    );
  }
);

export default Index;
