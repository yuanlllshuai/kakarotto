import * as THREE from "three";
import Highlight from "./Highlight";
import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Index = () => {
  const [arrow, setArrow] = useState<THREE.Mesh>();
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useEffect(() => {
    createArrow();
  }, []);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = performance.now() * 0.001;
    }
  });

  const createArrow = () => {
    const start = -7.5;
    const end = 7.5;
    const border1 = 1.15;
    const border2 = -border1;
    const width = 0.07;
    const line1 = [
      -border1,
      0,
      start,
      -(border1 - width),
      0,
      start,
      -border1,
      0,
      end,
      -border1,
      0,
      end,
      -(border1 - width),
      0,
      end,
      -(border1 - width),
      0,
      start,
    ];
    const line2 = [
      -border2,
      0,
      start,
      -(border2 - width),
      0,
      start,
      -border2,
      0,
      end,
      -border2,
      0,
      end,
      -(border2 - width),
      0,
      end,
      -(border2 - width),
      0,
      start,
    ];
    const basePoints = [
      0,
      0,
      0.2,
      0.5,
      0,
      0,
      0,
      0,
      Math.sqrt(3) / 2,
      0,
      0,
      Math.sqrt(3) / 2,
      -0.5,
      0,
      0,
      0,
      0,
      0.2,
    ];
    const allPoints: number[] = [...line1, ...line2];
    const min = -6;
    const max = 5;
    const num = 5;
    const step = (max - min) / (num - 1);
    const steps = [min];
    for (let i = 1; i < num; i++) {
      steps.push(min + step * i);
    }
    steps.forEach((offset) => {
      basePoints.forEach((i, ind) => {
        if ((ind + 1) % 3 === 0) {
          allPoints.push(i + offset);
        } else {
          allPoints.push(i);
        }
      });
    });
    const arrowVertices = new Float32Array(allPoints);
    const arrowGeometry = new THREE.BufferGeometry();

    arrowGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(arrowVertices, 3)
    );
    const uvs: number[] = [];
    for (let i = 0; i < allPoints.length / 3; i++) {
      const x = allPoints[i * 3];
      const y = allPoints[i * 3 + 2] / (Math.abs(start) + Math.sqrt(3) / 2) + 1;
      uvs.push(x, y);
    }
    arrowGeometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(uvs), 2)
    );
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0.0 },
        uColor: { value: new THREE.Color("#FFF") }, // 默认白色
        uIntensity: { value: 0.2 }, // 默认亮度 0.3
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float iTime;
        uniform vec3 uColor; // 高光颜色
        uniform float uIntensity; // 高光亮度

        // 缓动函数：先慢后快再慢（三次贝塞尔曲线）
        float easing(float t) {
          return t * t * (3.0 - 0.5 * t);
        }

        void main() {
          vec2 uv = vUv;
          float time = iTime;

          // 3.5 秒为一个周期：前 1.5 秒移动，后 2 秒静止
          float cycle = mod(time, 3.5);
          float highlightPosition = 0.0;
          float highlight = 0.0;

          if (cycle < 2.0) {
            // 前 1.5 秒：高光从上到下移动（从 -0.4 开始）
            float tMove = cycle / 1.5; // 0.0 ~ 1.0
            highlightPosition = easing(tMove); // 初始偏移量为 -0.4
            float highlightWidth = 0.4;
            float distance = abs(uv.y - highlightPosition);
            highlight = 1.0 - smoothstep(0.0, highlightWidth, distance);
          }

          // 默认颜色为透明，高光颜色和亮度由 uniforms 控制
          // vec3 baseColor = uBaseColor; // 完全透明
          vec3 finalColor = uColor + highlight * uColor; // 使用 uColor
          gl_FragColor = vec4(finalColor, highlight * uIntensity + 0.15); // 使用 uIntensity
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;
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
