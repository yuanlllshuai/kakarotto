import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useFBX, OrbitControls, useProgress } from "@react-three/drei";
import styles from "./index.module.scss";
import * as THREE from "three";
import ScreenFull from "@/components/ScreenFull";
import { GUI } from "lil-gui";
import { Progress, Button } from "antd";
import { speechData, mixamoToVRoidMap } from "./const";
import { VRMLoaderPlugin, VRMHumanBoneName } from "@pixiv/three-vrm";
// import { GLTFLoader } from "three-stdlib";

function Person({ setMapInit, playInfo }: any) {
  const handRaising = useFBX("/gltf_models/actions/HandRaising.fbx");
  const standing = useFBX("/gltf_models/actions/Standing.fbx");
  // console.log(fbx);
  const { scene, userData, animations } = useGLTF(
    // "https://models.readyplayer.me/6981acd86ac2615313a63e4f.glb?morphTargets=ARKit",
    // "/gltf_models/person.glb",
    "/gltf_models/girl.vrm",
    false,
    false,
    (loader) => {
      loader.register((parser: any) => new VRMLoaderPlugin(parser) as any);
    }
    // "https://models.readyplayer.me/69857ef1378169941737bd42.glb",
  );

  const guiRef = useRef<any>();
  const faceRef = useRef<THREE.Mesh>();
  const toothRef = useRef<THREE.Mesh>();
  const mixerRef1 = useRef<any>();
  const mixerRef2 = useRef<any>();
  const mixerRef3 = useRef<any>();
  const playInfoRef = useRef<any>({});
  const standActionRef = useRef<any>();
  const handActionRef = useRef<any>();

  useEffect(() => {
    if (userData?.vrm?.scene) {
      console.log(userData, handRaising);
      createVrmAnimationClip(handRaising.animations[0]);
      // userData.vrm.humanoid.resetPose();
      // userData.vrm.scene.updateMatrixWorld(true);
      // userData.vrm.humanoid.resetRawPose();
      // const names: string[] = [];
      // userData?.vrm?.scene.children[0].traverse((child: any) => {
      //   names.push(child.name);
      // });
      let bone: any = null;
      userData?.vrm?.scene.traverse((child: any) => {
        if (child.name === "Root") {
          bone = child;
        }
        // if (child.name === "Face_(merged)(Clone)") {
        //   faceRef.current = child;
        //   const gui = new GUI();

        //   const influences = child.morphTargetInfluences;

        //   for (const [key, value] of Object.entries(
        //     child.morphTargetDictionary,
        //   )) {
        //     gui
        //       .add(influences, value as number, 0, 10, 0.1)
        //       .name(key.replace("blendShape1.", ""))
        //       .listen(influences);
        //   }
        //   guiRef.current = gui;
        // }
      });
      // const gui = new GUI();
      // bone.traverse((child: any) => {
      //   if (child.name && child.name !== "J_Bip_C_Hips") {
      //     const influences = child.rotation;
      //     gui
      //       .add(influences, "y", -2 * Math.PI, 2 * Math.PI, 0.1)
      //       .name(child.name)
      //       .listen(influences);
      //   }
      // });
      // guiRef.current = gui;
      // beginStand();
      setMapInit(true);
    }
    return () => {
      guiRef.current.destroy();
      guiRef.current = null;
    };
  }, [userData]);

  const createVrmAnimationClip = (animationClip: THREE.AnimationClip) => {
    const tracks: THREE.QuaternionKeyframeTrack[] = [];
    animationClip.tracks.forEach((track) => {
      const trackName = track.name;
      const mixamoBoneName = trackName.split(".")[0];
      const propertyName = trackName.split(".")[1];

      const vrmNodeName = mixamoToVRoidMap?.[mixamoBoneName]; // 例如 "J_Bip_C_Chest"
      if (vrmNodeName) {
        if (trackName === "Hips.position") {
          tracks.push(
            new THREE.VectorKeyframeTrack(
              `${vrmNodeName}.${propertyName}`,
              track.times,
              track.values
            )
          );
        } else {
          tracks.push(
            new THREE.QuaternionKeyframeTrack(
              `${vrmNodeName}.${propertyName}`,
              track.times,
              track.values
            )
          );
        }
      } else {
        console.log(mixamoBoneName);
      }
    });
    const vrmClip = new THREE.AnimationClip(
      "vrmAnimation",
      animationClip.duration,
      tracks
    );

    // 5. 播放动画
    mixerRef3.current = new THREE.AnimationMixer(userData.vrm.scene);
    mixerRef3.current.clipAction(vrmClip).play();
    mixerRef3.current.update(0.0001);
    // console.log(vrmClip);
  };

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
            trackData.values
          )
        );
      } else {
        console.log(trackData.name);
      }
    });

    const clip = new THREE.AnimationClip(
      speechData.name,
      speechData.duration,
      tracks
    );
    return clip;
  };

  const beginStand = () => {
    mixerRef3.current = new THREE.AnimationMixer(userData.vrm.scene);
    standActionRef.current = mixerRef3.current.clipAction(
      standing.animations[0]
    );
    handActionRef.current = mixerRef3.current.clipAction(
      handRaising.animations[0]
    );
    standActionRef.current.play();
    handActionRef.current.setLoop(THREE.LoopOnce);
    handActionRef.current.clampWhenFinished = true;
  };

  const playWave = () => {
    handActionRef.current.reset();
    handActionRef.current.enabled = true;
    standActionRef.current.crossFadeTo(handActionRef.current, 0.4, true);
    handActionRef.current.play();
    const duration = handActionRef.current.getClip().duration; // 获取动画总时长
    const fadeTime = 0.8; // 切回 Idle 的混成耗时
    const leadTime = 0.3; // 提前量（秒）：在 Wave 结束前 0.2s 就开始切回

    // 计算触发切回的延迟毫秒数
    const delay = (duration - fadeTime - leadTime) * 1000;

    setTimeout(() => {
      handActionRef.current.crossFadeTo(standActionRef.current, fadeTime, true);
      standActionRef.current.enabled = true;
      standActionRef.current.play();
    }, Math.max(0, delay));
  };

  useEffect(() => {
    playInfoRef.current = playInfo;
    if (playInfo.begin && faceRef.current) {
      if (!mixerRef1.current) {
        mixerRef1.current = new THREE.AnimationMixer(faceRef.current);
      }
      const clip = createAnimation(faceRef.current, speechData);
      const action = mixerRef1.current.clipAction(clip);
      action.setLoop(THREE.LoopOnce);
      action.play();
    }
    if (playInfo.begin && toothRef.current) {
      if (!mixerRef2.current) {
        mixerRef2.current = new THREE.AnimationMixer(toothRef.current);
      }
      const clip = createAnimation(toothRef.current, speechData);
      const action = mixerRef2.current.clipAction(clip);
      action.setLoop(THREE.LoopOnce);
      action.play();
    }
    if (playInfo.begin) {
      playWave();
    }
  }, [playInfo]);

  useFrame((_state, delta) => {
    if (mixerRef1.current && playInfoRef.current.begin) {
      mixerRef1.current.update(delta);
    }
    if (mixerRef2.current && playInfoRef.current.begin) {
      mixerRef2.current.update(delta);
    }
    if (mixerRef3.current) {
      mixerRef3.current.update(delta);
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
          <ambientLight intensity={3} />
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
