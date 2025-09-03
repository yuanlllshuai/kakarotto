import { Suspense, useEffect, useState, useRef, memo } from "react";
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
import AnimateCard from "@/components/AnimateCard";
import ScreenFull from "@/components/ScreenFull";

import * as TWEEN from "@tweenjs/tween.js";

const Camera = memo(({ setBegin, loading }: any) => {
  const cameraRef = useRef<any>(null);
  const tweenRef = useRef<any>(null);

  useEffect(() => {
    if (loading) return;
    const beginPos = [-18, 12, 12];
    const endPos = [-10, 10, 20];
    const startPoint = new THREE.Vector3(...beginPos);
    const endPoint = new THREE.Vector3(...endPos);

    tweenRef.current = new TWEEN.Tween(startPoint)
      .to(endPoint, 3000) // 3 seconds duration
      .easing(TWEEN.Easing.Cubic.InOut) // Cubic easing function
      .onUpdate((position) => {
        if (cameraRef.current) {
          cameraRef.current.position.copy(position);
        }
      })
      .onComplete(() => {
        setBegin(true);
      })
      .start();
  }, [loading]);

  useFrame(() => {
    if (tweenRef.current) {
      tweenRef.current.update(); // Update tween animations
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        args={[75, window.innerWidth / window.innerHeight, 0.1, 1000]}
        position={[-18, 12, 12]}
      />
    </>
  );
});

// const Camera = memo(({ setBegin, begin, loading }: any) => {
//   const [curve, setCurve] = useState<any>();

//   const cameraRef = useRef<any>(null);
//   const count = useRef(0);
//   const points = useRef<any>(null);

//   const cubicInOut = (t: number): number => {
//     return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
//   };

//   useEffect(() => {
//     if (loading) {
//       return;
//     }
//     const beginPos = [-18, 12, 12];
//     const endPos = [-10, 10, 20];
//     const center = [
//       (beginPos[0] + endPos[0]) / 2,
//       (beginPos[1] + endPos[1]) / 2,
//       (beginPos[2] + endPos[2]) / 2,
//     ];
//     const curve = new THREE.QuadraticBezierCurve3(
//       new THREE.Vector3(...beginPos),
//       new THREE.Vector3(...center),
//       new THREE.Vector3(...endPos)
//     );
//     const numPoints = 200;
//     const pArr = [];
//     for (let i = 0; i <= numPoints; i++) {
//       const t = i / numPoints;
//       const easedT = cubicInOut(t);
//       pArr.push(curve.getPointAt(easedT));
//     }
//     points.current = pArr;
//     setCurve(curve);
//   }, [loading]);

//   useFrame(() => {
//     // 相机按照运动轨迹移动
//     if (cameraRef.current && points.current) {
//       const p = points.current;
//       if (count.current < p.length) {
//         p[count.current].x &&
//           (cameraRef.current.position.x = p[count.current].x);
//         p[count.current].y &&
//           (cameraRef.current.position.y = p[count.current].y);
//         p[count.current].z &&
//           (cameraRef.current.position.z = p[count.current].z);
//         count.current += 1;
//       } else if (!begin) {
//         setBegin(true);
//       }
//     }
//   });

//   return (
//     <>
//       <PerspectiveCamera
//         ref={cameraRef}
//         makeDefault
//         args={[75, window.innerWidth / window.innerHeight, 0.1, 1000]}
//         position={[-14, 6, 10]}
//       />
//       {/** 运动轨迹线 */}
//       {curve && (
//         <mesh>
//           <tubeGeometry args={[curve, 100, 0.02, 10, false]} />
//           <meshBasicMaterial
//             side={THREE.DoubleSide}
//             color={new THREE.Color("red")}
//           />
//         </mesh>
//       )}
//     </>
//   );
// });

export const Component = () => {
  const { progress } = useProgress();
  const [loading, setLoading] = useState<boolean>(true);
  const [begin, setBegin] = useState<boolean>(false);
  const [cardBegin, setCardBegin] = useState<boolean>(false);
  const [mapInit, setMapInit] = useState<boolean>(false);

  useEffect(() => {
    if (progress === 100) {
      setLoading(false);
    }
  }, [progress]);

  const render = () => {
    return (
      <div className={styles.model}>
        <Canvas
          // camera={{ position: [20, 6, 20] }}
          scene={{
            background: new THREE.Color("rgb(2, 3, 34)"),
          }}
        >
          {/* <axesHelper scale={100} /> */}
          <Camera
            begin={begin}
            setBegin={setBegin}
            loading={loading || !mapInit}
          />
          <OrbitControls makeDefault enableRotate={begin} enableZoom={begin} />
          <ambientLight intensity={3} />
          {/* <pointLight position={[100, 100, 100]} decay={0} intensity={2} /> */}
          {/* <directionalLight position={[10, 10, 10]} intensity={0.5} /> */}
          <Suspense fallback={<></>}>
            <MapModel
              begin={begin}
              setCardBegin={setCardBegin}
              setMapInit={setMapInit}
            />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div className={styles.container} id="screen-map-model">
      {<ScreenFull containerId="screen-map-model">{render()}</ScreenFull>}
      {(loading || !mapInit) && (
        <div className={styles.loading}>
          <div style={{ width: "80%" }}>
            <Progress percent={progress} showInfo={false} />
          </div>
        </div>
      )}
      <AnimateCard begin={cardBegin} />
    </div>
  );
};
