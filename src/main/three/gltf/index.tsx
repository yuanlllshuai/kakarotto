import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useProgress,
  PerspectiveCamera,
} from "@react-three/drei";
import { Progress } from "antd";
import styles from "./index.module.scss";
import * as THREE from "three";

import MapModel from "./MapModel";
import screenfull from "screenfull";

const Camera = ({ setBegin, begin }: any) => {
  // const [curve, setCurve] = useState<any>();

  const cameraRef = useRef<any>(null);
  const count = useRef(0);
  const points = useRef<any>([]);

  useEffect(() => {
    const beginPos = [-18, 12, 12];
    const endPos = [-10, 10, 20];
    const center = [
      (beginPos[0] + endPos[0]) / 2,
      (beginPos[1] + endPos[1]) / 2,
      (beginPos[2] + endPos[2]) / 2,
    ];
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...beginPos),
      new THREE.Vector3(...center),
      new THREE.Vector3(...endPos)
    );
    const pArr = curve.getPoints(80);
    points.current = pArr;
    // setCurve(curve);
  }, []);

  useFrame(() => {
    // 相机按照运动轨迹移动
    if (cameraRef.current && points.current) {
      const p = points.current;
      if (count.current < p.length) {
        p[count.current].x &&
          (cameraRef.current.position.x = p[count.current].x);
        p[count.current].y &&
          (cameraRef.current.position.y = p[count.current].y);
        p[count.current].z &&
          (cameraRef.current.position.z = p[count.current].z);
        count.current += 1;
      } else if (!begin) {
        setBegin(true);
      }
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        args={[75, window.innerWidth / window.innerHeight, 0.1, 1000]}
        position={[-14, 6, 10]}
      />
      {/** 运动轨迹线 */}
      {/* {curve && (
        <mesh>
          <tubeGeometry args={[curve, 100, 0.02, 10, false]} />
          <meshBasicMaterial
            side={THREE.DoubleSide}
            color={new THREE.Color("red")}
          />
        </mesh>
      )} */}
    </>
  );
};

export const Component = () => {
  const { progress } = useProgress();
  const [loading, setLoading] = useState<boolean>(true);
  const [begin, setBegin] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [progress]);

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", fullChange);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", fullChange);
      }
    };
  });

  const fullChange = () => {
    setIsFullScreen(screenfull.isFullscreen);
  };

  const screenFull = () => {
    const fullDom = document.getElementById("screen-map-model");
    if (screenfull.isEnabled) {
      if (!isFullScreen) {
        screenfull.request(fullDom as Element);
      } else {
        screenfull.exit();
      }
    }
  };

  const render = () => {
    return (
      <div className={styles.model} style={{ opacity: loading ? 0 : 1 }}>
        <Canvas
          frameloop={"demand"}
          // camera={{ position: [20, 6, 20] }}
          scene={{
            background: new THREE.Color("rgb(2, 3, 34)"),
          }}
        >
          {/* <axesHelper scale={100} /> */}
          <Camera begin={begin} setBegin={setBegin} />
          <OrbitControls makeDefault />
          <ambientLight intensity={3} />
          {/* <pointLight position={[100, 100, 100]} decay={0} intensity={2} /> */}
          {/* <directionalLight position={[10, 10, 10]} intensity={0.5} /> */}
          <Suspense fallback={<></>}>
            <MapModel begin={begin} />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div className={styles.container} id="screen-map-model">
      {loading && (
        <div className={styles.loading}>
          <Progress percent={progress} showInfo={false} />
        </div>
      )}
      {render()}
      <div className={styles.screenfull} onClick={screenFull}>
        {isFullScreen ? "退出" : "全屏"}
      </div>
    </div>
  );
};
