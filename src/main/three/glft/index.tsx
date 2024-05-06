
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
    useGLTF,
    OrbitControls
} from '@react-three/drei';

const ModelGirl = () => {
    const { scene } = useGLTF('/gift_models/girl/scene.gltf');
    return (
        <primitive object={scene} scale={0.6} position={[0, -6, 0]} />
    )
}

function Index() {

    return (
        <Canvas shadows camera={{ position: [0, 0, 10] }}>
            <OrbitControls makeDefault />
            {/* <ambientLight intensity={0.03} /> */}
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            {/* <spotLight angle={0.14} color="#ffd0d0" penumbra={1} position={[25, 50, -20]} shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} castShadow /> */}
            <Suspense fallback={<>loading</>}>
                <ModelGirl />
            </Suspense>
        </Canvas>
    )
}

export default Index;