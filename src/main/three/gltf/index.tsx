import { Suspense, useEffect, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  useProgress,
  PerspectiveCamera
} from '@react-three/drei';
import { Progress } from 'antd'
import styles from './index.module.scss';
import * as THREE from 'three';

import MapModel from './MapModel';

const Camera = () => {
  const cameraRef = useRef<any>(null);
  const count = useRef(0);

  // 定义贝塞尔曲线的起点、控制点和终点
  const startPoint = new THREE.Vector3(20, 10, 20);
  const controlPoint1 = new THREE.Vector3(30, 10, -30); // 第一个控制点
  const controlPoint2 = new THREE.Vector3(2, 6, -20); // 第二个控制点
  const endPoint = new THREE.Vector3(-12, 6, -12);

  // 创建贝塞尔曲线
  const curve = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
  const points = curve.getPoints(200);

  useFrame(() => {
    if (cameraRef.current) {
      if (count.current < points.length) {
        points[count.current].x&&(cameraRef.current.position.x = points[count.current].x);
        points[count.current].y&&(cameraRef.current.position.y = points[count.current].y);
        points[count.current].z&&(cameraRef.current.position.z = points[count.current].z);
        count.current += 1;
      }
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        args={[75, window.innerWidth / window.innerHeight, 0.1, 1000]}
        position={[20, 10, 20]}
      />
      {/* <mesh>
        <tubeGeometry
          args={[curve, 100, 0.02, 10, false]}
        />
        <meshBasicMaterial
          side={THREE.DoubleSide}
          color={new THREE.Color('red')}
        />
      </mesh> */}
    </>
  )
}

function Index() {
  const { progress } = useProgress();
  const [loading, setLoading] = useState<boolean>(true);
  const [begin, setBegin] = useState<boolean>(false);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setLoading(false);
      }, 500)
    }
  }, [progress])

  const render = () => {
    return (
      <div className={styles.model} style={{ opacity: loading ? 0 : 1 }}>
        <Canvas
          shadows
          // camera={{ position: [20, 6, 20] }}
          scene={{ background: new THREE.Color('rgb(2, 3, 34)') }}
        >
          {/* <axesHelper scale={100} /> */}
          <Camera/>
          <OrbitControls makeDefault />
          <ambientLight intensity={3} />
          {/* <pointLight position={[100, 100, 100]} decay={0} intensity={2} /> */}
          <directionalLight position={[10, 10, 10]} intensity={0.5} />
          <Suspense fallback={<></>}>
            <MapModel begin={ begin } />
          </Suspense>
        </Canvas>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {loading && <div className={styles.loading}><Progress percent={progress} showInfo={false} /></div>}
      {render()}
    </div>
  )
}

export default Index;