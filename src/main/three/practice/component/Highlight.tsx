import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export type HighlightProps = {
  meshProps?: any;
  planProps?: any;
  color?: string;
  intensity?: number;
  baseColor?: string;
};

const Index = ({
  meshProps,
  planProps,
  color = "#FFFFFF",
  intensity = 0.1,
}: HighlightProps) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = performance.now() * 0.001;
    }
  });

  const createShader = () => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0.0 },
        uColor: { value: new THREE.Color(color) }, // 默认白色
        uIntensity: { value: intensity }, // 默认亮度 0.3
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
          return t * t * (3.0 - 1.4 * t);
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
            highlightPosition = easing(tMove) - 0.4; // 初始偏移量为 -0.4
            float highlightWidth = 0.4;
            float distance = abs(uv.y - highlightPosition);
            highlight = 1.0 - smoothstep(0.0, highlightWidth, distance);
          } else {
            // 后 2 秒：高光完全消失
            highlight = 0.0;
          }

          // 默认颜色为透明，高光颜色和亮度由 uniforms 控制
          // vec3 baseColor = uBaseColor; // 完全透明
          vec3 finalColor = uColor + highlight * uColor; // 使用 uColor
          gl_FragColor = vec4(finalColor, highlight * uIntensity); // 使用 uIntensity
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;
    return material;
  };

  return (
    <>
      <mesh {...meshProps}>
        <planeGeometry {...planProps}></planeGeometry>
        <primitive object={createShader()} />
      </mesh>
    </>
  );
};

export default Index;
