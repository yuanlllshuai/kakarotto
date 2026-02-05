import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useFBX, OrbitControls, useProgress } from "@react-three/drei";
import styles from "./index.module.scss";
import * as THREE from "three";
import ScreenFull from "@/components/ScreenFull";
import { GUI } from "lil-gui";
import { Progress, Button } from "antd";
import { speechData } from "./const";

function Person({ setMapInit, playInfo }: any) {
  const actionFbx = useFBX(
    "/gltf_models/actions/HandRaising.fbx",
    // "https://models.readyplayer.me/6981acd86ac2615313a63e4f.glb?morphTargets=ARKit",
  );
  // console.log(fbx);
  const { scene } = useGLTF(
    // "https://models.readyplayer.me/6981acd86ac2615313a63e4f.glb?morphTargets=ARKit",
    "/gltf_models/person.glb",
  );

  const guiRef = useRef<any>();
  const faceRef = useRef<THREE.Mesh>();
  const toothRef = useRef<THREE.Mesh>();
  const eyeLRef = useRef();
  const eyeRRef = useRef();
  const mixerRef1 = useRef<any>();
  const mixerRef2 = useRef<any>();
  const mixerRef3 = useRef<any>();
  const playInfoRef = useRef<any>({});

  useEffect(() => {
    if (scene) {
      console.log(scene);
      scene.traverse((child: any) => {
        if (child.name === "Wolf3D_Head") {
          faceRef.current = child;
          const gui = new GUI();

          const influences = child.morphTargetInfluences;
          console.log(child);

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
        if (child.name === "Wolf3D_Teeth") {
          toothRef.current = child;
        }
        if (child.name.includes("EyeLeft")) {
          eyeLRef.current = child;
        }
        if (child.name.includes("EyeRight")) {
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

  const createAnimation = (mesh: THREE.Mesh, speechData: any) => {
    const tracks: THREE.NumberKeyframeTrack[] = [];
    const dictionary: any = mesh.morphTargetDictionary;

    speechData.tracks.forEach((trackData: any) => {
      const index = dictionary[trackData.name];
      if (index !== undefined) {
        // 注意：属性路径必须指向 influences 数组的具体索引
        const trackName = `.morphTargetInfluences[${index}]`;
        tracks.push(
          new THREE.NumberKeyframeTrack(
            trackName,
            trackData.times,
            trackData.values,
          ),
        );
      } else {
        console.log(trackData.name);
      }
    });

    const clip = new THREE.AnimationClip(
      speechData.name,
      speechData.duration,
      tracks,
    );
    return clip;
  };

  useEffect(() => {
    playInfoRef.current = playInfo;
    if (playInfo.begin && faceRef.current) {
      if (!mixerRef1.current) {
        mixerRef1.current = new THREE.AnimationMixer(faceRef.current);
      }
      const clip = createAnimation(faceRef.current, speechData);
      const action = mixerRef1.current.clipAction(clip);
      // action.setLoop(THREE.LoopOnce);
      action.play();
    }
    if (playInfo.begin && toothRef.current) {
      if (!mixerRef2.current) {
        mixerRef2.current = new THREE.AnimationMixer(toothRef.current);
      }
      const clip = createAnimation(toothRef.current, speechData);
      const action = mixerRef2.current.clipAction(clip);
      // action.setLoop(THREE.LoopOnce);
      action.play();
    }
    if (playInfo.begin && toothRef.current) {
      mixerRef3.current = new THREE.AnimationMixer(scene);
      const action = mixerRef3.current.clipAction(actionFbx.animations[0]);
      // action.setLoop(THREE.LoopOnce);
      action.play();
    }
    // if (playInfo.begin && faceRef.current) {
    //   if (!mixerRef1.current) {
    //     mixerRef1.current = new THREE.AnimationMixer(faceRef.current);
    //   }
    //   const action = mixerRef1.current.clipAction(actionFbx.animations[0]);
    //   action.setLoop(THREE.LoopOnce);
    //   action.play();
    // }
  }, [playInfo]);

  useFrame((_state, delta) => {
    if (mixerRef1.current && playInfoRef.current.begin) {
      mixerRef1.current.update(delta);
    }
    if (mixerRef2.current && playInfoRef.current.begin) {
      mixerRef2.current.update(delta);
    }
    if (mixerRef3.current && playInfoRef.current.begin) {
      mixerRef3.current.update(delta);
    }
  });

  return (
    <primitive
      object={scene}
      scale={2}
      position={[0, -2, 0]}
      onClick={(e: any) => e.stopPropagation()}
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
            你好，我叫小明，请大家多多关照
          </Button>
        </div>
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
            <Person setMapInit={setMapInit} playInfo={playInfo} />
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
