import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, useProgress } from "@react-three/drei";
import styles from "./index.module.scss";
import * as THREE from "three";
import ScreenFull from "@/components/ScreenFull";
import { GUI } from "lil-gui";
import { Progress, Button } from "antd";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import {
  createVRMAnimationClip,
  VRMAnimationLoaderPlugin,
  VRMLookAtQuaternionProxy,
} from "@pixiv/three-vrm-animation";

let waiting: any = null;
let appearing: any = null;
let liked: any = null;

function Person({ setMapInit, playInfo }: any) {
  const mixerRef = useRef<any>();
  const waitingActionRef = useRef<any>();
  const likedActionRef = useRef<any>();

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
          waiting = animation.userData.vrmAnimations[0];
        });
      loader
        .loadAsync("/gltf_models/actions/appearing.vrma")
        .then((animation) => {
          appearing = animation.userData.vrmAnimations[0];
        });
      loader.loadAsync("/gltf_models/actions/liked.vrma").then((animation) => {
        liked = animation.userData.vrmAnimations[0];
      });
    },
  );

  const guiRef = useRef<any>();

  useEffect(() => {
    if (userData?.vrm?.scene) {
      setTimeout(() => {
        createVrmAnimationClip();
      }, 0);
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

    const appearingClip = createVRMAnimationClip(appearing, userData.vrm);
    const appearingAction = mixerRef.current.clipAction(appearingClip);
    appearingAction.setLoop(THREE.LoopOnce);
    appearingAction.clampWhenFinished = true;
    appearingAction.play();

    mixerRef.current.addEventListener("finished", (e: any) => {
      // 如果你有多个动画，可以根据名称逻辑处理
      if (e.action === appearingAction) {
        // const waitingClip = createVRMAnimationClip(waiting, userData.vrm);
        // const waitingAction = mixerRef.current.clipAction(waitingClip);
        // waitingAction.play();
        playWaiting(appearingAction);
      }
    });
  };

  const playWaiting = (appearingAction: any) => {
    const waitingClip = createVRMAnimationClip(waiting, userData.vrm);
    const waitingAction = mixerRef.current.clipAction(waitingClip);
    waitingActionRef.current = waitingAction;
    waitingAction.reset();
    waitingAction.enabled = true;
    appearingAction.crossFadeTo(waitingAction, 0.2, true);
    waitingAction.play();

    const likedClip = createVRMAnimationClip(liked, userData.vrm);
    const likedAction = mixerRef.current.clipAction(likedClip);
    likedActionRef.current = likedAction;
  };

  useEffect(() => {
    if (playInfo.begin) {
      likedActionRef.current.reset();
      likedActionRef.current.enabled = true;
      waitingActionRef.current.crossFadeTo(likedActionRef.current, 0.4, true);
      likedActionRef.current.play();
      const duration = likedActionRef.current.getClip().duration; // 获取动画总时长
      const fadeTime = 0.8; // 切回 Idle 的混成耗时
      const leadTime = 0.3; // 提前量（秒）：在 Wave 结束前 0.2s 就开始切回

      // 计算触发切回的延迟毫秒数
      const delay = (duration - fadeTime - leadTime) * 1000;

      setTimeout(
        () => {
          likedActionRef.current.crossFadeTo(
            waitingActionRef.current,
            fadeTime,
            true,
          );
          waitingActionRef.current.enabled = true;
          waitingActionRef.current.play();
        },
        Math.max(0, delay),
      );
    }
  }, [playInfo]);

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
    ></primitive>
  );
}

export const Component = () => {
  const { progress } = useProgress();
  const [mapInit, setMapInit] = useState<boolean>(false);
  const [playInfo, setPlayInfo] = useState<any>({ begin: false });

  const render = () => {
    return (
      <div className={styles.model}>
        <div className={styles.btns}>
          <Button
            onClick={() =>
              setPlayInfo({
                begin: true,
              })
            }
          >
            行礼
          </Button>
        </div>
        <Canvas
          shadows
          camera={{ position: [0, 0, 3], near: 0.1, far: 1000 }}
          scene={{
            background: new THREE.Color("rgb(2, 3, 34)"),
          }}
        >
          {/* <axesHelper scale={10} /> */}
          <OrbitControls makeDefault />
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} decay={0} intensity={1} />
          <Suspense fallback={<></>}>
            <Person setMapInit={setMapInit} playInfo={playInfo} />
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
