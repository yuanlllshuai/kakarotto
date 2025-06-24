import React, { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";

const Lightning = ({
  position = [0, 10, 0],
  duration = 0.1,
  interval = 3,
}: any) => {
  const [visible, setVisible] = useState(false);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const timerRef = useRef<any>();
  const flashRef = useRef<any>(null);

  // Generate jagged lightning path
  const generateLightningPath = () => {
    const segments = 10;
    const path: THREE.Vector3[] = [];
    const start = new THREE.Vector3(position[0], position[1], position[2]);
    const end = new THREE.Vector3(position[0], 0, position[2]);

    path.push(start);

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const point = new THREE.Vector3().lerpVectors(start, end, t);

      // Add randomness to create jagged effect
      point.x += (Math.random() - 0.5) * 2;
      point.z += (Math.random() - 0.5) * 2;

      path.push(point);
    }

    path.push(end);
    return path;
  };

  // Flash effect
  useEffect(() => {
    const flash = () => {
      setVisible(true);
      setPoints(generateLightningPath());

      setTimeout(() => {
        setVisible(false);
      }, duration * 1000);
    };

    // Initial flash
    flash();

    // Set interval for subsequent flashes
    timerRef.current = setInterval(flash, interval * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [duration, interval]);

  // Light effect
  useFrame(() => {
    if (flashRef.current && visible) {
      flashRef.current.intensity = Math.random() * 10 + 5;
    }
  });

  return (
    <>
      {
        <>
          <Line points={points} color="white" lineWidth={2} dashed={false} />
          <pointLight
            ref={flashRef}
            position={position}
            color="white"
            intensity={10}
            distance={20}
            decay={2}
          />
        </>
      }
    </>
  );
};

export default Lightning;
