import { Suspense, useEffect, useState, useRef, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import styles from "./index.module.scss";
import * as THREE from "three";
import ScreenFull from "@/components/ScreenFull";
import { Progress } from "antd";
import * as TWEEN from "@tweenjs/tween.js";
import MapModel from "./MapModel";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const Camera = memo(
  ({
    setCameraEnd,
    begin,
  }: {
    setCameraEnd: (isEnd: boolean) => void;
    begin: boolean;
  }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const tweenRef = useRef<any>(null);

    useEffect(() => {
      if (!begin) {
        setCameraEnd(false);
        return;
      }
      const beginPos = [-8, 20, 16];
      const endPos = [0, 6, 10];
      const startPoint = new THREE.Vector3(...beginPos);
      const endPoint = new THREE.Vector3(...endPos);

      tweenRef.current = new TWEEN.Tween(startPoint)
        .to(endPoint, 4000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate((position) => {
          if (cameraRef.current) {
            cameraRef.current.position.copy(position);
          }
        })
        .onComplete(() => {
          setCameraEnd(true);
        })
        .start();
    }, [begin]);

    useFrame(() => {
      if (tweenRef.current) {
        tweenRef.current.update();
      }
    });

    return (
      <>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          args={[75, window.innerWidth / window.innerHeight, 0.1, 1000]}
          position={[-8, 20, 16]}
        />
      </>
    );
  }
);

function Index() {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [cameraEnd, setCameraEnd] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (mapLoaded) {
      // 虚假的进度条
      setProgress(50);
      setTimeout(() => {
        setProgress(99);
      }, 500);
      setTimeout(() => {
        setProgress(100);
      }, 1000);
    }
  }, [mapLoaded]);

  const render = () => {
    return (
      <div className={styles.model}>
        <Canvas
          scene={{
            background: new THREE.Color("rgb(2, 3, 34)"),
          }}
        >
          <Camera setCameraEnd={setCameraEnd} begin={mapLoaded} />
          <axesHelper scale={1} />
          <OrbitControls
            makeDefault
            enableRotate={cameraEnd}
            enableZoom={cameraEnd}
          />
          <ambientLight intensity={1} />
          <directionalLight position={[20, 20, 20]} intensity={2} />
          <Suspense fallback={<></>}>
            <MapModel setMapLoaded={setMapLoaded} cameraEnd={cameraEnd} />
          </Suspense>
          <EffectComposer>
            <Bloom
              intensity={0.2} // The bloom intensity.
              mipmapBlur
              luminanceThreshold={1}
            />
          </EffectComposer>
        </Canvas>
      </div>
    );
  };

  return (
    <div className={styles.container} id="practice-map-container">
      <ScreenFull containerId="practice-map-container">{render()}</ScreenFull>
      {progress !== 100 && (
        <div className={styles.loading}>
          <div style={{ width: "80%" }}>
            <Progress percent={progress} showInfo={false} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Index;
