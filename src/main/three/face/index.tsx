import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, useProgress } from "@react-three/drei";
import styles from "./index.module.scss";
import * as THREE from "three";
import ScreenFull from "@/components/ScreenFull";
import { KTX2Loader } from "three-stdlib";
import { GUI } from "lil-gui";
import { Progress } from "antd";

function Face({ setMapInit }: any) {
  const { gl } = useThree();
  const ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath(
    `https://unpkg.com/three@0.169.0/examples/jsm/libs/basis/`,
  );
  const { scene, animations } = useGLTF(
    "/gltf_models/facecap.glb",
    false,
    true,
    (loader) => {
      loader.setKTX2Loader(ktx2Loader.detectSupport(gl));
    },
  );

  const guiRef = useRef<any>();
  const faceRef = useRef();
  const eyeLRef = useRef();
  const eyeRRef = useRef();
  const mixerRef = useRef<any>();

  useEffect(() => {
    if (scene) {
      const mesh = scene.children[0];
      mixerRef.current = new THREE.AnimationMixer(mesh);
      mixerRef.current.clipAction(animations[0]).play();
      mixerRef.current.clipAction(animations[1]).play();
      mixerRef.current.clipAction(animations[2]).play();
      // mixerRef.current.clipAction(animations[3]).play();

      scene.traverse((child: any) => {
        if (child.name.includes("mesh_2")) {
          faceRef.current = child;
          child.material = new THREE.MeshNormalMaterial();
          const gui = new GUI();

          const influences = child.morphTargetInfluences;

          for (const [key, value] of Object.entries(
            child.morphTargetDictionary,
          )) {
            gui
              .add(influences, value as number, 0, 1, 0.01)
              .name(key.replace("blendShape1.", ""))
              .listen(influences);
          }
          guiRef.current = gui;
        }
        if (child.name.includes("eyeLeft")) {
          eyeLRef.current = child;
        }
        if (child.name.includes("eyeRight")) {
          eyeRRef.current = child;
        }
      });
      setMapInit(true);
    }
    return () => {
      guiRef.current.destroy();
      guiRef.current = null;
    };
  }, [scene]);

  useFrame((_state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <primitive
      object={scene}
      scale={1.5}
      position={[0, 0, 0]}
      onClick={(e: any) => e.stopPropagation()}
    ></primitive>
  );
}

export const Component = () => {
  const { progress } = useProgress();
  const [mapInit, setMapInit] = useState<boolean>(false);

  const render = () => {
    return (
      <div className={styles.model}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 4], near: 0.1, far: 1000 }}
          scene={{
            background: new THREE.Color("rgb(2, 3, 34)"),
          }}
        >
          {/* <axesHelper scale={10} /> */}
          <OrbitControls makeDefault />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} decay={0} intensity={3} />
          <Suspense fallback={<></>}>
            <Face setMapInit={setMapInit} />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div className={styles.container} id="face-container">
      {!mapInit && (
        <div className={styles.loading}>
          <div style={{ width: "80%" }}>
            <Progress percent={progress} showInfo={false} />
          </div>
        </div>
      )}
      <ScreenFull containerId="face-container">{render()}</ScreenFull>
    </div>
  );
};
