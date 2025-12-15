import { useFrame } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const Index = () => {
  const [line, setLine] = useState<THREE.Mesh>();
  const lineRef = useRef<any>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useEffect(() => {
    createLine();
  }, []);

  const createLine = () => {
    const crossWidth = 0.01;
    const crossLenght = 1;
    const crossVertices = new Float32Array([
      0,
      0,
      0,
      crossLenght,
      0,
      0,
      crossLenght,
      0,
      crossWidth,

      0,
      0,
      0,
      0,
      0,
      crossWidth,
      crossLenght,
      0,
      crossWidth,
      // 10,
      // 0,
      // crossWidth,
      // 0,
      // 0,
      // crossWidth,
      // 0,
      // 0,
      // 0,
    ]);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0.0 },
        uDashLength: { value: 0.8 }, // 虚线段长度（比例）
        uGapLength: { value: 0.3 }, // 间隔长度（比例）
        uColor: { value: new THREE.Color("#86f5ff") },
      },
      vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
      fragmentShader: `
    uniform float uDashLength;
    uniform float uGapLength;
    uniform float iTime;
    uniform vec3 uColor; // 声明颜色 uniform
    varying vec2 vUv;

    void main() {
      float cycle = uDashLength + uGapLength;
      float phase = vUv.x * 20.0 + iTime * 5.0;
      float positionInCycle = mod(phase, cycle);
      float strength = step(uGapLength, positionInCycle);
      if (strength < 0.1) discard; // 丢弃片段以创建透明效果
      // 使用 uColor 控制颜色
      gl_FragColor = vec4(uColor * strength, 0.8);
    }
  `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
    });

    const crossGeometry = new THREE.BufferGeometry();

    crossGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(crossVertices, 3)
    );
    crossGeometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(crossVertices, 3)
    );
    materialRef.current = material;
    // 创建网格并添加到场景
    const lineMesh = new THREE.Mesh(crossGeometry, material);
    lineRef.current = lineMesh;
    console.log(lineMesh);
    setLine(lineMesh);
  };

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = performance.now() * 0.001;
    }
  });
  return <>{line && <primitive object={line} position={[1, 4, 1]} />}</>;
};

export default Index;
