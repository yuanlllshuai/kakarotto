import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const Index = ({ position }: { position: THREE.Vector3 }) => {
  const [lightning, setLightning] = useState<any>(null);

  const pointRef = useRef<any>(null);
  const timerRef = useRef<any>(0);
  const begin = useRef<boolean>(false);
  const count = useRef<number>(0);

  useEffect(() => {
    // createPoint();
    // const harfPoint = pointRef.current;
    // createLight(getPositions(harfPoint.slice(0, 2000)));
  }, []);

  const getPositions = (points: any[]) => {
    const positions = new Float32Array(points.length * 3);
    points.forEach((i, index) => {
      positions[index * 3] = i[0];
      positions[index * 3 + 1] = i[1];
      positions[index * 3 + 2] = i[2];
    });
    return positions;
  };

  const createPoint = () => {
    const count = 5000;
    const positions = [];
    let beginX = position.x;
    let beginY = 2;
    let beginZ = position.z;
    const segmentsY = 3 / count;
    const segments = 20 / count;
    for (let i = 0; i < count; i += 1) {
      const point = new Float32Array(3);
      point[0] = beginX + (Math.random() * 2 - 1) * segments;
      point[1] = beginY + segmentsY;
      point[2] = beginZ + (Math.random() * 2 - 1) * segments;
      beginX = point[0];
      beginY = point[1];
      beginZ = point[2];
      positions.push(point);
    }
    pointRef.current = positions.reverse();
  };

  const createLight = (points: any) => {
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(points, 3)
    );

    const vertexShader = `
      uniform float size;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = size * (1.0 / -mvPosition.z);
      }
    `;

    const fragmentShader = `
      uniform float glowIntensity;
      uniform vec3 glowColor;
      void main() {
        float distanceToCenter = length(gl_PointCoord - vec2(0.5));
        float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
        vec3 color = glowColor * glowIntensity;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        size: { value: 16.0 },
        glowIntensity: { value: 2.0 },
        glowColor: { value: new THREE.Color(0.2, 0.4, 1.0) }, // Light blue color
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    setLightning(particles);
  };

  useFrame((_state, delta) => {
    // console.log(timerRef.current);
    if (begin.current) {
      if (count.current < 5000) {
        count.current += 300;
        createLight(getPositions(pointRef.current.slice(0, count.current)));
      } else {
        begin.current = false;
        timerRef.current = 0;
        count.current = 0;
        createLight(new Float32Array(3));
      }
    } else {
      timerRef.current += delta;
      if (timerRef.current > Math.random() * 0.1 + 1) {
        createPoint();
        begin.current = true;
        // createLight();
      }
    }
  });

  if (!lightning) {
    return <></>;
  }

  return <primitive object={lightning} />;
};

export default Index;
