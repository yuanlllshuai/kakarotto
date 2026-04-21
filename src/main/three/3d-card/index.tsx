import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useProgress,
  PerspectiveCamera,
} from "@react-three/drei";
import styles from "./index.module.scss";
import ScreenFull from "@/components/ScreenFull";
import { Progress } from "antd";
import Model from "./model";
import * as THREE from "three";
import Camera from "./camera";

export const Component = () => {
  const { progress } = useProgress();
  const [mapInit, setMapInit] = useState<boolean>(false);
  const [show, setShow] = useState(false);

  const scrollProgressRef = useRef<number>(0);

  const onScroll = () => {
    const cardContainer = document.getElementById("3d-card-container");
    const cardCanvas = document.getElementById("3d-card-canvas");
    const cardScroll = document.getElementById("3d-card-scroll");
    if (!cardCanvas || !cardScroll || !cardContainer) return;
    const range = cardScroll.offsetHeight - cardCanvas.offsetHeight;

    if (range <= 0) {
      scrollProgressRef.current = 0;
      return;
    }

    const raw = cardContainer.scrollTop / range;
    scrollProgressRef.current = Math.min(1, Math.max(0, raw));
    // cardCanvas.style.transform = `translateY(-${scrollProgressRef.current * 200}px)`;
    // cardCanvas.style.height = `calc(100vh + ${scrollProgressRef.current * 200}px)`;
    // console.log(scrollProgressRef.current);
  };

  useEffect(() => {
    setMapInit(true);
    onScroll();
    const cardContainer = document.getElementById("3d-card-container");
    if (cardContainer) {
      cardContainer.addEventListener("scroll", onScroll, { passive: true });
      cardContainer.addEventListener("resize", onScroll);
    }
    return () => {
      if (cardContainer) {
        cardContainer.removeEventListener("scroll", onScroll);
        cardContainer.removeEventListener("resize", onScroll);
      }
    };
  }, []);

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
        style={{
          opacity: show ? 1 : 0,
        }}
        id="3d-card-canvas"
      >
        <Canvas
          shadows
          scene={
            {
              // background: new THREE.Color("rgb(2, 3, 34)"),
            }
          }
        >
          <Camera progress={scrollProgressRef} />
          {/* <axesHelper scale={2} /> */}
          {/* <OrbitControls target-y={scrollProgressRef.current * 10} /> */}
          <OrbitControls makeDefault enableZoom={false} />
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} decay={0} intensity={1} />
          <Suspense fallback={<></>}>
            <Model setMapInit={setMapInit} progress={scrollProgressRef} />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div className={styles.container} id="3d-card-container">
      <div
        id="3d-card-scroll"
        style={{ position: "relative", height: "300vh" }}
      >
        {/* {!mapInit && (
          <div className={styles.loading}>
            <div style={{ width: "80%" }}>
              <Progress percent={progress} showInfo={false} />
            </div>
          </div>
        )} */}
        {render()}
      </div>
      <div className={styles.page2}>下一页</div>
    </div>
  );
};
