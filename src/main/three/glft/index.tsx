
import { Suspense, useEffect } from 'react'
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

    // useEffect(() => {
    //     fetch('http://111.229.183.248/assets/avatar-CLbFvChd.png')
    //         .then((response: any) => {
    //             const total = parseInt(response.headers.get('Content-Length'), 10);
    //             let loaded = 0;
    //             const reader = response.body.getReader();
    //             return reader.read().then(function process(result: any) {
    //                 if (result.done) return;
    //                 loaded += result.value.length;
    //                 const progress = (loaded / total) * 100;
    //                 console.log(`Loaded ${progress}%`);
    //                 return reader.read().then(process);
    //             });
    //         })
    //         .catch(error => console.error(error));
    // }, [])

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