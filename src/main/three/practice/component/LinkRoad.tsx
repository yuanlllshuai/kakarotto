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
        // uniform vec3 iResolution;

        float lerp (float a, float b, float t) {
          return (1.0 - t) * a + t * b;
        }

        vec3 lerpColor (vec3 c1, vec3 c2, float t) {
          return vec3( lerp(c1.x, c2.x, t), lerp(c1.y, c2.y, t), lerp(c1.z, c2.z, t) );
        }

        void main() {
          vec2 uv = vUv;
          float t = iTime;
          vec3 c1 = vec3(23.0/255.0, 194.0/255.0, 131.0/255.0);
          vec3 c2 = vec3(33.0/255.0, 38.0/255.0, 204.0/255.0);
          vec3 col = lerpColor(c1, c2, abs(sin(t - uv.x) * cos(uv.x + t - sin(t))));
          gl_FragColor = vec4(col, 1.0);
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
