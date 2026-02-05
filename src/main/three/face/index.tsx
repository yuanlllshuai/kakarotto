import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, useProgress } from "@react-three/drei";
import styles from "./index.module.scss";
import * as THREE from "three";
import ScreenFull from "@/components/ScreenFull";
import { KTX2Loader } from "three-stdlib";
import { GUI } from "lil-gui";
import { Progress, Button } from "antd";
import { speechData, blendshapesMap } from "./const";

function Face({ setMapInit, playInfo }: any) {
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
  const faceRef = useRef<THREE.Mesh>();
  const eyeLRef = useRef();
  const eyeRRef = useRef();
  const mixerRef = useRef<any>();
  const playInfoRef = useRef<any>({});

  useEffect(() => {
    if (scene) {
      console.log(scene, animations);
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

  const createAnimation = (mesh: THREE.Mesh, speechData: any) => {
    const tracks: THREE.NumberKeyframeTrack[] = [];
    const dictionary: any = mesh.morphTargetDictionary;

    speechData.tracks.forEach((trackData: any) => {
      const index = dictionary[blendshapesMap[trackData.name]];
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
      if (!mixerRef.current) {
        mixerRef.current = new THREE.AnimationMixer(faceRef.current);
      }
      const clip = createAnimation(faceRef.current, speechData);
      const action = mixerRef.current.clipAction(clip);
      action.setLoop(THREE.LoopOnce);
      action.play();
    }
  }, [playInfo]);

  useFrame((_state, delta) => {
    if (mixerRef.current && playInfoRef.current.begin) {
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
            <Face setMapInit={setMapInit} playInfo={playInfo} />
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
