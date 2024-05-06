// import { useEffect, useRef } from 'react';
// import { Gltf } from '@/utils/threes';
// import { useResize } from '@/utils/hooks';
// import styles from './index.module.scss';
// import { useLoader, Canvas, useFrame } from '@react-three/fiber'

// import { OrbitControls, TransformControls, useCursor } from '@react-three/drei'
// //@ts-ignore
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// const Index = () => {
//     const moduleRef = useRef<any>(null);

//     // useFrame((_state, delta) => {
//     //     console.log(moduleRef)
//     // })

//     const gltf = useLoader(GLTFLoader, '/girl/scene.gltf');
//     gltf.scene.scale.set(0.1, 0.1, 0.1);

//     // const load = (size: any) => {
//     //     gltfRef.current = new Gltf({ id: 'threeLine', size });
//     //     // gltfRef.current.render();
//     // };

//     // useResize({
//     //     once: true,
//     //     container: domRef,
//     //     cb: load
//     // });


//     return (
//         <>
//             {/* <div id="threeLine" className={styles.container} ref={domRef}></div> */}
//             <Canvas>
//                 <primitive object={gltf.scene} ref={moduleRef} />
//                 <OrbitControls makeDefault />
//             </Canvas>
//         </>
//     )
// }

// export default Index;
import * as THREE from 'three'
import { Suspense, useEffect, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Sky, useScroll, useGLTF, useAnimations, OrbitControls, useTexture } from '@react-three/drei'

export default function App() {
    return (
        <Canvas shadows camera={{ position: [0, 0, 10] }}>
            <OrbitControls makeDefault />
            <ambientLight intensity={0.03} />
            <fog attach="fog" args={['#ff5020', 5, 18]} />
            <spotLight angle={0.14} color="#ffd0d0" penumbra={1} position={[25, 50, -20]} shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} castShadow />
            {/* <Sky scale={1000} sunPosition={[2, 0.4, 10]} /> */}
            <Suspense fallback={null}>
                {/* Wrap contents you want to scroll into <ScrollControls> */}
                <ScrollControls pages={3}>
                    <LittlestTokyo scale={0.1} position={[0, -5, 0]} />
                </ScrollControls>
            </Suspense>
        </Canvas>
    )
}

function LittlestTokyo({ ...props }) {
    // This hook gives you offets, ranges and other useful things
    const scroll = useScroll()
    const { scene, nodes, animations } = useGLTF('/girl/cute_anime_girl_mage.glb');



    // const maps = useTexture([
    //     '/girl/textures/Tex_0006_1_dds_baseColor.png',
    //     '/girl/textures/Tex_0008_1_dds_baseColor.png',
    // ]);
    // console.log(1111, maps)

    // useEffect(() => {
    //     scene.traverse((child: any) => {
    //         if (child.isMesh) {
    //             child.material.map = maps[0];
    //             child.material.needsUpdate = true;
    //             // child.material.normalMap = normalMap;
    //             // child.material.roughnessMap = roughnessMap;
    //             // child.material.metalnessMap = metalnessMap;
    //             // child.material.needsUpdate = true;
    //         }
    //     });
    // }, [scene, maps]);
    // const { actions } = useAnimations(animations, scene)
    // useLayoutEffect(() => Object.values(nodes).forEach((node) => (node.receiveShadow = node.castShadow = true)))
    // useEffect(() => void (actions['Take 001'].play().paused = true), [actions])
    // useFrame((state, delta) => {
    //     const action = actions['Take 001']
    //     // The offset is between 0 and 1, you can apply it to your models any way you like
    //     const offset = 1 - scroll.offset
    //     action.time = THREE.MathUtils.damp(action.time, (action.getClip().duration / 2) * offset, 100, delta)
    //     state.camera.position.set(Math.sin(offset) * -10, Math.atan(offset * Math.PI * 2) * 5, Math.cos((offset * Math.PI) / 3) * -10)
    //     state.camera.lookAt(0, 0, 0)
    // })
    return <group><primitive object={scene} {...props} /></group>
}