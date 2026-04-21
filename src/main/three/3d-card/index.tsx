import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useProgress } from "@react-three/drei";
import styles from "./index.module.scss";
import ScreenFull from "@/components/ScreenFull";
import { Progress } from "antd";
import Model from "./model";
export const Component = () => {
  const { progress } = useProgress();
  const [mapInit, setMapInit] = useState<boolean>(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (mapInit) {
      setTimeout(() => {
        setShow(true);
      }, 0);
    }
  }, [mapInit]);

  const render = () => {
    return (
      <div
        className={styles.model}
        style={{ opacity: show ? 1 : 0 }}
        id="3d-card-canvas"
      >
        <Canvas
          shadows
          camera={{ position: [3.2, 1, 3.2], near: 0.1, far: 1000 }}
        >
          <axesHelper scale={2} />
          <OrbitControls makeDefault enableZoom={false} />
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} decay={0} intensity={1} />
          <Suspense fallback={<></>}>
            <Model setMapInit={setMapInit} />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div className={styles.container} id="3d-card-container">
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
      <div className={styles.page2}>下一页</div>
    </div>
  );
};
