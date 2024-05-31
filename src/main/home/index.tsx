import { useEffect } from 'react';
// import * as THREE from 'three'
import GitHubCalendar from 'react-github-calendar';
// import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'

// import axios from 'axios';
import styles from './index.module.scss';

// function Box(props: ThreeElements['mesh']) {
//     const ref = useRef<THREE.Mesh>(null!)
//     const [hovered, hover] = useState(false)
//     const [clicked, click] = useState(false)
//     useFrame((_state, delta) => (ref.current.rotation.x += delta))
//     return (
//         <mesh
//             {...props}
//             ref={ref}
//             scale={clicked ? 2 : 1.5}
//             onClick={() => click(!clicked)}
//             onPointerOver={() => hover(true)}
//             onPointerOut={() => hover(false)}>
//             <boxGeometry args={[1, 1, 1]} />
//             <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//         </mesh>
//     )
// }

const Index = () => {
    useEffect(() => {
        // axios.get('/api/v1/user/getChannel')
        //     .then(response => {
        //         console.log(response.data);
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.github_calendar}>
                <div>
                    <div className={styles.github_calendar_title}>@yuanlllshuai on GitHub</div>
                    <GitHubCalendar username={'yuanlllshuai'} fontSize={14} colorScheme='dark' />
                </div>
            </div>
            {/* <div className={styles.three_container}>
                <Canvas>
                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                    <Box position={[-1.2, 0, 0]} />
                    <Box position={[1.2, 0, 0]} />
                </Canvas>
            </div> */}
        </div>
    )
}

export default Index;