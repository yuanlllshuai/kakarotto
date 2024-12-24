import { Suspense, useEffect, useState, useRef, memo, useCallback } from 'react'
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber'
import {
  useGLTF,
  OrbitControls,
  useProgress,
  Html,
  Billboard,
  useTexture
} from '@react-three/drei';
import { Progress } from 'antd'
import styles from './index.module.scss';
import * as THREE from 'three';
import icon from '@/assets/local.jpg';
import land from '../res/checker.png';
import bg from '../res/bg.jpg';
import border from '../res/border.png';

const createGradient = (gradient: any, color: string) => {
  gradient.addColorStop(0, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.01, color);
  gradient.addColorStop(0.3, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.6, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.7, 'rgba(255,255,255,0)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
}

const InstancedGridOfSquares = memo(() => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const [instancedMesh, setInstancedMesh] = useState<any>(null);

  useEffect(() => {
    const numSquaresPerRow = 200;
    const numSquaresPerColumn = 200;
    const totalSquares = numSquaresPerRow * numSquaresPerColumn;
  
    // Create a single geometry and material
    const geometry = new THREE.PlaneGeometry(0.06, 0.06);
    // geometry.rotateX = Math.PI / 2;
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
  
    // Create an InstancedMesh
    const instancedMesh = new THREE.InstancedMesh(geometry, material, totalSquares);
  
    // Set the positions for each instance
    for (let i = 0; i < numSquaresPerRow; i++) {
      for (let j = 0; j < numSquaresPerColumn; j++) {
        const x = (i - (numSquaresPerRow - 1) / 2) * 0.2;
        const y = (j - (numSquaresPerColumn - 1) / 2) * 0.2;
        const position = new THREE.Vector3(x, y, 0);
        const matrix = new THREE.Matrix4();
        matrix.setPosition(position);
        instancedMesh.setMatrixAt(i * numSquaresPerColumn + j, matrix);
      }
    }
    instancedMesh.rotation.x = Math.PI / 2;
    setInstancedMesh(instancedMesh);
  }, []);

  // useFrame((state, delta) => {
  //   if (instancedMeshRef.current) {
  //     const cameraPosition = state.camera.position;
  //     const upVector = new THREE.Vector3(0, 1, 0);

  //     for (let i = 0; i < 100*100; i++) {
  //       const matrix = new THREE.Matrix4();
  //       const position = new THREE.Vector3();
  //       instancedMeshRef.current.getMatrixAt(i, matrix);
  //       position.setFromMatrixPosition(matrix);

  //       // Look at the camera
  //       matrix.lookAt(position, cameraPosition, upVector);
  //       matrix.setPosition(position);

  //       instancedMeshRef.current.setMatrixAt(i, matrix);
  //     }

  //     instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  //   }
  // });

  if (!instancedMesh) {
    return <></>
  }

  return (
    <primitive
      object={instancedMesh}
      ref={instancedMeshRef}
    />
  );
});


const PointLabel = ({ position, label, scale, visible }: any) => {
  return (
    <>
      <Billboard
        position={[position.x, 0.8, position.z]}
      >
        <Html transform={true}>
          <img src={icon} style={{ width: 20, height: 26 }} />
        </Html>
      </Billboard>
      <Billboard
        position={[position.x, 2.6, position.z]}
      >
        <Html
          scale={scale}
          transform={true}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            opacity: visible ? 1 : 0,
            transition: 'all 0.3s',
          }}
        >
          <div style={{
            padding: '40px 70px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 20,
            color: '#FFF'
          }}>
            {label}
          </div>
        </Html>
      </Billboard> 
    </>
  )
}

const vertexShader = `
    uniform float time;
    varying vec3 pos;
    void main()	{
      pos = position;
      vec3 p = position;
      //p.y = sin(p.x * .1 - time) * cos(p.z * .1 - time) * 5.;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
    }
  `;
  const fragmentShader = `
    varying vec3 pos;
    uniform float time;
    
    float line(float width, vec3 step){
      vec3 tempCoord = pos / step;
      
      vec2 coord = tempCoord.xz;

      vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord * width);
      float line = min(grid.x, grid.y);
      
      return 1. - min(line, 1.0);
    }
    
    void main() {
      float v = line(1., vec3(1.)) + line(1.5, vec3(10.));      
      vec3 c = v * vec3(0., 1., 1.) * (sin(time * 5. - length(pos.xz) * .5) * .5 + .5);
      c = mix(vec3(0.5), c, v);
      
      gl_FragColor = vec4(c, 1.0);
    }
  `;

class LightCircleMaterial extends THREE.ShaderMaterial{
  
  constructor() {
    super({
      uniforms: {
        time: {
          value: 0
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side:THREE.DoubleSide,
    })
  }
}

// extend({ LightCircleMaterial });

// const LightCircle = () => {

//   const ref = useRef();
//   const count = useRef();
//   const clock = new THREE.Clock();
//   let time = 0;
//   let delta = 0;
//   console.log(ref)

//   useFrame(() => {
//     if (ref.current) {
//       delta = clock.getDelta();
//       time += delta;
//       ref.current.uniforms.time.value = time;
//     }
    
//   });
//   return (
//     <mesh rotation-x={Math.PI/2}>
//       <planeGeometry
//         args={[200, 200]}
//       />
//       <lightCircleMaterial ref={ ref} />
//     </mesh>
//   )
// }

const FlyLine = ({ position } :any) => {

  const linrOffset = 1;

  const [curve, setCurve] = useState<any>();
  const [texture, setTexture] = useState<any>();

  const countRef = useRef(0);

  useEffect(() => {
    if (position) {
      const x = position.x / 2;
      const z = (position.z / position.x) * x;
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, 5, z),
        new THREE.Vector3(position.x, 0, position.z)
      );
      setCurve(curve)
      createGradientTexture(100, 1);
    }
  }, [position]);

  const createGradientTexture=(width: number, height: number)=> {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d')!;
    const gradient = context.createLinearGradient(0, 0, width, 0);
    // createGradient(gradient,'#00BFFF');
    createGradient(gradient,'#9400D3');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.offset.x = -linrOffset; // 初始偏移量
    texture.repeat.set(-0.5, 0); // 防止重复
    texture.wrapS = THREE.RepeatWrapping; // 防止拉伸
    texture.wrapT = THREE.RepeatWrapping; // 防止拉伸
    setTexture(texture)
  }


  useFrame(() => {
    if (texture) {
      countRef.current += 0.005;
      texture.offset.x = -linrOffset + countRef.current % linrOffset;
    }
  });
  return (
    <>
      <mesh position={[0, 0.6, 0]}>
        <tubeGeometry
          args={[curve, 100, 0.02, 10, false]}
        />
        <meshBasicMaterial side={THREE.DoubleSide} map={texture} transparent={true} />
      </mesh>
    </>
  )
}

const OriginPoint = memo(() => {
  const [radius, setRadius] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const circleRef = useRef<any>();
  const countRef = useRef(0);

  useFrame(() => {
    if (circleRef.current) {
      countRef.current += 0.02;
      const r = 0 + countRef.current % 2;
      const o = 1 - (countRef.current/2) % 1;
      setRadius(r);
      setOpacity(o);
    }
  })
  return (
    <mesh
      ref={circleRef}
      position={[0, 0.6, 0]}
      rotation-x={Math.PI / 2}
    >
      <circleGeometry args={[radius, 32]} />
      <meshBasicMaterial
        color="red"
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
})




const ModelMap = () => {
  const partRef = useRef();
  const { raycaster, camera, mouse } = useThree();
  const { scene } = useGLTF('/gltf_models/map/map11.gltf');
  // const { scene } = useGLTF('http://111.229.183.248/gltf_models/girl/scene.gltf');
  const [labelPosition, setLabelPosition] = useState<any>({ x: 0, y: 0, z: 0 });
  const [labelText, setLabelText] = useState('');
  const luminanceMap = useRef<any>({});
  const [labelScale, setLabelScale] = useState(1);
  const [showTag, setShowTag] = useState(false);

  const isDragging = useRef(false);
  const isConsole = useRef();
  const isClickDown = useRef(false);
  const clickNum = useRef(0);
  const showTagRef = useRef(false);
  const countRef = useRef(0);

  const [texture] = useTexture([border]);
  texture.repeat.set(1, 1);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.rotation = Math.PI;

  
  useEffect(() => {
    if (partRef.current) {
      console.log(scene)
      const luminances: any = {};
      (partRef.current as any).traverse((child: any) => {
        if (child.isMesh) {
          if (child.name.includes('市')) {
            child.material.side = THREE.DoubleSide;
            child.material.transparent = true;
            child.material.opacity = 0.7;
            const hsl = { h: 0, s: 0, l: 0 };
            child.material.color.getHSL(hsl);
            luminances[child.uuid] = { ...hsl };
          }
          if (child.name.includes('河南边界')) {
            dealBorder(child);
          }
          if (child.name === '底') {
            child.material.transparent = true;
            child.material.opacity = 0;
          }
          if (child.name === '底边界') {
            child.material.transparent = true;
            child.material.opacity = 0.3;
          }
        }
      });
      luminanceMap.current = luminances;
    }
  }, [partRef.current]);

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const dealBorder = (mesh: any) => {
    mesh.material.color= new THREE.Color('#FFF')
    mesh.material.map = texture;
    mesh.material.metalness = 0;
  }

  const handleMouseDown = (event: any) => {
    event.preventDefault();
    isDragging.current = false;
    isClickDown.current = true;
  };

  const handleMouseMove = (event: any) => {
    event.preventDefault();
    if (isClickDown.current) {
      isDragging.current = true;
    }
  };

  const handleMouseUp = (event: any) => {
    event.preventDefault();
    if (!isDragging.current||clickNum.current===0) {
      handleClick(event);
      clickNum.current += 1;
    }
    isDragging.current = false;
    isClickDown.current = false;
  };

  // 处理点击事件
  const handleClick = (event: any) => {
    event.preventDefault();
    raycaster.setFromCamera(mouse, camera);
    if (!partRef.current) {
      return;
    }
    const intersects = raycaster.intersectObjects(scene.children[1].children[0].children);
    if (intersects.length > 0) {
      const intersect: any = intersects[0];
      if (intersect.object.name.includes('市')) {
        setShowTag(false);
        showTagRef.current = false;
        setTimeout(() => {
          setShowTag(true);
          showTagRef.current = true;
          setLabelPosition(intersect.point);
        },300)
        setMeshColor(intersect.object.uuid)
        setLabelText(intersect.object.name);
      }
    }
  };

  const setMeshColor = (uuid: string) => {
    if (partRef.current) {
      (partRef.current as any).children[1].children[0].children.forEach((child: any) => {
        if (child.isMesh && child.name.includes('市')) {
          if (child.uuid === uuid) {
            if (isConsole.current !== child.uuid) {
              // console.log(child);
              isConsole.current = child.uuid;
            }
            const hsl = { ...luminanceMap.current[child.uuid] };
            hsl.l += 0.2;
            child.material.color.setHSL(hsl.h, hsl.s, hsl.l);
          } else {
            const hsl = { ...luminanceMap.current[child.uuid] };
            child.material.color.setHSL(hsl.h, hsl.s, hsl.l);
          }
        }
      });
    }
  }

  // const createLine = (position: any) => {
  //   const curve = new THREE.CubicBezierCurve3(
  //     new THREE.Vector3(0, 0.8, 0),
  //     new THREE.Vector3(0, 0, 0),
  //     new THREE.Vector3(0, 4, 0),
  //     new THREE.Vector3(position.x, 0.8, position.z)
  //   );
  //   const points = curve.getPoints(200);
  //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
  //   const material = new THREE.MeshPhongMaterial({ color: 'red', flatShading: true });
  //   const line = new THREE.Line(geometry, material);
  // }

  useFrame(() => {
    if (labelPosition) {
      // 缩放
      const vector = new THREE.Vector3().copy(labelPosition).sub(camera.position)
      const distance = vector.length()
      const newScale = 1 / (distance / 10)
      setLabelScale(Math.max(0.7, Math.min(0.8, newScale)));
    }

    countRef.current += 0.01;
    texture.offset.y =1- countRef.current % 1;
  })

  return (
    <>
      <primitive ref={partRef} object={scene} scale={1} position={[0, -22, 0]} />
      {
        labelPosition.x !== 0 && (
          <PointLabel
            position={labelPosition}
            scale={labelScale}
            label={labelText}
            visible={showTag}
          />
        )
      }
      {
        labelPosition.x !== 0 &&<FlyLine position={labelPosition} />
      }
      <OriginPoint />
      <InstancedGridOfSquares />
      {/* <LightCircle /> */}
    </>
  )
}

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
        <Canvas shadows camera={{ position: [20, 20, 20] }} scene={{background:new THREE.Color('rgb(2, 3, 34)')}}>
          {/* <axesHelper scale={100} /> */}
          <OrbitControls makeDefault />
          <ambientLight intensity={3} />
          {/* <pointLight position={[100, 100, 100]} decay={0} intensity={2} /> */}
          <directionalLight position={[10, 10, 10]} intensity={0.5} />
          <Suspense fallback={<></>}>
            <ModelMap />
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