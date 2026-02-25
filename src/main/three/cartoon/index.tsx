import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, useProgress } from "@react-three/drei";
import styles from "./index.module.scss";
import * as THREE from "three";
import ScreenFull from "@/components/ScreenFull";
import { GUI } from "lil-gui";
import { Progress } from "antd";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import {
  createVRMAnimationClip,
  VRMAnimationLoaderPlugin,
  VRMLookAtQuaternionProxy,
} from "@pixiv/three-vrm-animation";
// import { GLTFLoader } from "three-stdlib";
let waiting: any = null;

function Person({ setMapInit }: any) {
  const mixerRef = useRef<any>();

  const { userData } = useGLTF(
    "/gltf_models/girl.vrm",
    false,
    false,
    (loader) => {
      loader.register((parser: any) => new VRMLoaderPlugin(parser) as any);
      loader.register(
        (parser: any) => new VRMAnimationLoaderPlugin(parser) as any,
      );
      loader
        .loadAsync("/gltf_models/actions/waiting.vrma")
        .then((animation) => {
          console.log(animation);
          waiting = animation.userData.vrmAnimations[0];
        });
    },
  );

  const guiRef = useRef<any>();

  useEffect(() => {
    if (userData?.vrm?.scene) {
      console.log(userData);
      setTimeout(() => {
        createVrmAnimationClip();
      }, 4000);
      let bone: any = null;
      userData?.vrm?.scene.traverse((child: any) => {
        if (child.name === "Root") {
          bone = child;
        }
      });
      const gui = new GUI();
      bone.traverse((child: any) => {
        if (
          child.name &&
          child.name !== "J_Bip_C_Hips" &&
          !child.name.includes("Hair") &&
          !child.name.includes("CoatSkirt") &&
          !child.name.includes("Bust")
        ) {
          const influences = child.rotation;
          gui
            .add(influences, "x", -2 * Math.PI, 2 * Math.PI, 0.1)
            .name(child.name + "_X")
            .listen(influences);
          gui
            .add(influences, "y", -2 * Math.PI, 2 * Math.PI, 0.1)
            .name(child.name + "_Y")
            .listen(influences);
          gui
            .add(influences, "z", -2 * Math.PI, 2 * Math.PI, 0.1)
            .name(child.name + "_Z")
            .listen(influences);
        }
      });
      guiRef.current = gui;
      setMapInit(true);
    }
    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [userData]);

  const createVrmAnimationClip = () => {
    const lookAtQuatProxy = new VRMLookAtQuaternionProxy(userData.vrm.lookAt);
    lookAtQuatProxy.name = "lookAtQuaternionProxy";
    userData.vrm.scene.add(lookAtQuatProxy);

    mixerRef.current = new THREE.AnimationMixer(userData.vrm.scene);
    const clip = createVRMAnimationClip(waiting, userData.vrm);
    mixerRef.current.clipAction(clip).play();
  };

  useFrame((_state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
      userData.vrm.update(delta);
    }
  });

  if (!userData?.vrm?.scene) {
    return <></>;
  }

  return (
    <primitive
      object={userData.vrm.scene}
      scale={2}
      position={[0, -2, 0]}
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
          <ambientLight intensity={3} />
          <pointLight position={[10, 10, 10]} decay={0} intensity={1} />
          <Suspense fallback={<></>}>
            <Person setMapInit={setMapInit} />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div className={styles.container} id="person-container">
      {!mapInit && (
        <div className={styles.loading}>
          <div style={{ width: "80%" }}>
            <Progress percent={progress} showInfo={false} />
          </div>
        </div>
      )}
      <ScreenFull containerId="person-container" position="top-center">
        {render()}
      </ScreenFull>
    </div>
  );
};
