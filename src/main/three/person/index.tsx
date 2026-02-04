import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import styles from "./index.module.scss";
import * as THREE from "three";
import ScreenFull from "@/components/ScreenFull";
import { Button } from "antd";

function TexturedCube({ begin }: { begin: boolean }) {
  const { scene } = useGLTF(
    "https://models.readyplayer.me/6981acd86ac2615313a63e4f.glb",
  );

  const headRef = useRef<any>(null);
  const teethRef = useRef<any>(null);
  const analyserRef = useRef<any>(null);

  useEffect(() => {
    if (scene) {
      let headMesh, teethMesh;
      // 1. 在模型加载后遍历找到这两个关键 Mesh
      scene.traverse((child: any) => {
        if (child.name.includes("Head")) headMesh = child;
        if (child.name.includes("Teeth")) teethMesh = child;
      });
      headRef.current = headMesh;
      teethRef.current = teethMesh;
    }
  }, [scene]);

  useEffect(() => {
    if (begin) {
      initAudio();
    }
  }, [begin]);

  const initAudio = async () => {
    const fftSize = 128;
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);
    const file = "/audio.wav";
    const loader = new THREE.AudioLoader();
    loader.load(file, function (buffer) {
      audio.setBuffer(buffer);
      audio.setLoop(true);
      audio.setVolume(0.5);
      audio.play();
    });
    analyserRef.current = new THREE.AudioAnalyser(audio, fftSize);
  };

  const setMouthOpen = (amount: number) => {
    [headRef.current, teethRef.current].forEach((mesh) => {
      if (!mesh) return;
      // RPM 标准模型中张嘴的目标名称通常是 'jawOpen'
      const index1 = mesh.morphTargetDictionary["mouthOpen"];
      if (index1 !== undefined) {
        const currentWeight = mesh.morphTargetInfluences[index1];
        const speed = amount < currentWeight ? 0.3 : 0.15;
        mesh.morphTargetInfluences[index1] = THREE.MathUtils.lerp(
          currentWeight,
          amount,
          speed,
        );
      }
    });
  };

  useFrame(() => {
    if (analyserRef.current) {
      const data = analyserRef.current.getFrequencyData(); // 获取频率数组 (通常256位)
      let lowFreqSum = 0;
      for (let i = 0; i < 30; i++) {
        lowFreqSum += data[i];
      }
      let frequencyVolume = lowFreqSum / (24 * 255); // 归一化到 0-1

      // 2. 动态阈值门限：低于 0.1 直接归零，防止细微声音导致“含着嘴”
      const threshold = 0.12;
      let targetWeight = 0;
      if (frequencyVolume > threshold) {
        // 重新映射：将 [threshold, 1] 映射到 [0, 1] 增强动作幅度
        targetWeight = (frequencyVolume - threshold) / (1 - threshold);
      }
      setMouthOpen(targetWeight);
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
  const [begin, setBegin] = useState<boolean>(false);
  const render = () => {
    return (
      <div className={styles.model}>
        <div className={styles.btn}>
          <Button
            onClick={() => {
              setBegin(true);
            }}
          >
            play
          </Button>
        </div>
        <Canvas
          shadows
          camera={{ position: [0, 0, 4], near: 0.1, far: 1000 }}
          scene={{
            background: new THREE.Color("rgb(2, 3, 34)"),
          }}
        >
          <axesHelper scale={10} />
          <OrbitControls makeDefault />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} decay={0} intensity={3} />
          <Suspense fallback={<></>}>
            <TexturedCube begin={begin} />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div className={styles.container} id="person-container">
      <ScreenFull containerId="person-container">{render()}</ScreenFull>
    </div>
  );
};
