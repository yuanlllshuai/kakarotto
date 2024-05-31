
import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
    useGLTF,
    OrbitControls,
    useProgress
} from '@react-three/drei';
import { Progress } from 'antd'
import styles from './index.module.scss';

const ModelGirl = () => {
    const { scene } = useGLTF('http://111.229.183.248/gltf_models/girl/scene.gltf');
    return (
        <>
            <primitive object={scene} scale={0.6} position={[0, -6, 0]} />
        </>
    )
}

function Index() {
    const { progress } = useProgress();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // console.log(progress)
        if (progress === 100) {
            setTimeout(() => {
                setLoading(false);
            }, 500)
        }
    }, [progress])

    const render = () => {
        return (
            <div className={styles.model} style={{ opacity: loading ? 0 : 1 }}>
                <Canvas shadows camera={{ position: [0, 0, 10] }}>
                    <OrbitControls makeDefault />
                    {/* <ambientLight intensity={0.03} /> */}
                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                    {/* <spotLight angle={0.14} color="#ffd0d0" penumbra={1} position={[25, 50, -20]} shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} castShadow /> */}
                    <Suspense fallback={<></>}>
                        <ModelGirl />
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