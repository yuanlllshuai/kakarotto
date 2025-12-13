import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const Index = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  useEffect(() => {
    // createShader();
  }, []);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = performance.now() * 0.001;
    }
  });

  const createShader = () => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0.0 },
        // iResolution: { value: new THREE.Vector3(size.width, size.height, 0) },
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
            // 前 1.5 秒：高光从上到下移动（从负偏移位置开始）
            float tMove = cycle / 1.5; // 0.0 ~ 1.0
            highlightPosition = easing(tMove) - 0.4;
            float highlightWidth = 0.4;
            float distance = abs(uv.y - highlightPosition);
            highlight = 1.0 - smoothstep(0.0, highlightWidth, distance);
          } else {
            // 后 2 秒：高光完全消失
            // highlight = 0.0;
          }

          vec3 baseColor = vec3(1.0);
          vec3 finalColor = baseColor * (1.0 + highlight * 1.0);

          gl_FragColor = vec4(finalColor, 0.3);
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
    <mesh rotation-x={Math.PI / 2}>
      <planeGeometry args={[0.5, 1.5]}></planeGeometry>
      <primitive object={createShader()} />
      {/* <meshBasicMaterial
        transparent={true}
        opacity={0.1}
        color="#FFF"
        side={THREE.DoubleSide}
      /> */}
    </mesh>
  );
};

export default Index;
