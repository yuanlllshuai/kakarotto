import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  useProgress,
} from '@react-three/drei';
import { Progress } from 'antd'
import styles from './index.module.scss';
import * as THREE from 'three';

import MapModel from './MapModel';

function Index() {
  const { progress } = useProgress();
  const [loading, setLoading] = useState<boolean>(true);

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
        <Canvas shadows camera={{ position: [-12, 6, -12] }} scene={{background:new THREE.Color('rgb(2, 3, 34)')}}>
          {/* <axesHelper scale={100} /> */}
          <OrbitControls makeDefault />
          <ambientLight intensity={3} />
          {/* <pointLight position={[100, 100, 100]} decay={0} intensity={2} /> */}
          <directionalLight position={[10, 10, 10]} intensity={0.5} />
          <Suspense fallback={<></>}>
            <MapModel />
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