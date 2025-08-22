import { Suspense, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import styles from "./index.module.scss";
import * as THREE from "three";
import mapPng from "@/assets/local.jpg";
import ScreenFull from "@/components/ScreenFull";

const vertexShaderStr = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShaderStr = `
uniform sampler2D uTexture;
varying vec2 vUv;
void main() {
  gl_FragColor = texture2D(uTexture, vUv);
}
`;

function TexturedCube() {
  const meshRef = useRef<any>();
  const texture = useLoader(THREE.TextureLoader, mapPng);

  return (
    <mesh ref={meshRef} rotation={[0.4, 0.2, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <shaderMaterial
        uniforms={{
          uTexture: { value: texture },
        }}
        vertexShader={vertexShaderStr}
        fragmentShader={fragmentShaderStr}
      />
    </mesh>
  );
}

function Index() {
  const render = () => {
    return (
      <div className={styles.model}>
        <Canvas
          shadows
          camera={{ position: [10, 10, 10], near: 0.1, far: 1000 }}
          scene={{
            background: new THREE.Color("rgb(2, 3, 34)"),
          }}
        >
          <axesHelper scale={10} />
          <OrbitControls makeDefault />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} decay={0} intensity={3} />
          {/* <directionalLight position={[100, 100, 100]} intensity={0.5} /> */}
          <Suspense fallback={<></>}>
            <TexturedCube />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div className={styles.container} id="shader-learn-container">
      <ScreenFull containerId="shader-learn-container">{render()}</ScreenFull>
    </div>
  );
}

export default Index;
