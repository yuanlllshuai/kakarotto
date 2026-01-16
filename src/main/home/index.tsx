import { useEffect } from "react";
// import * as THREE from 'three'
import GitHubCalendar from "react-github-calendar";
// import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'

// import axios from 'axios';
import styles from "./index.module.scss";

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

export const Component = () => {
  useEffect(() => {
    // axios.get('/api/v1/user/getChannel')
    //     .then(response => {
    //         console.log(response.data);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
    // const count = candy([1, 0, 2]);
    // const count = trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]);
  }, []);

  // 接雨水
  // const trap = (ratings: number[]): number => {
  //     let ans = 0;
  //     const stack = [];
  //     const n = ratings.length;
  //     for (let i = 0; i < n; ++i) {
  //         while (stack.length && ratings[i] > ratings[stack[stack.length - 1]]) {
  //             const top = stack.pop();
  //             if (!stack.length) {
  //                 break;
  //             }
  //             const left = stack[stack.length - 1];
  //             const currWidth = i - left - 1;
  //             const currHeight = Math.min(ratings[left], ratings[i]) - ratings[top as number];
  //             ans += currWidth * currHeight;
  //         }
  //         stack.push(i);
  //     }
  //     return ans;
  // }

  // // 分发糖果
  // const candy = (ratings: number[]): number => {
  //     const len = ratings.length;
  //     const left = new Array(len).fill(1);
  //     const right = new Array(len).fill(1);

  //     for (let i = 1; i < len; i++) {
  //         if (ratings[i] > ratings[i - 1]) {
  //             left[i] = left[i - 1] + 1
  //         }
  //     }
  //     let count = left[len - 1];
  //     for (let i = len - 2; i >= 0; i--) {
  //         if (ratings[i] > ratings[i + 1]) {
  //             right[i] = right[i + 1] + 1;
  //         }
  //         count += Math.max(left[i], right[i])
  //     }

  //     return count
  // }

  return (
    <div className={styles.container}>
      <div className={styles.github_calendar}>
        <div>
          <div className={styles.github_calendar_title}>
            @yuanlllshuai on GitHub
          </div>
          <GitHubCalendar
            username={"yuanlllshuai"}
            fontSize={14}
            colorScheme="dark"
          />
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
  );
};
