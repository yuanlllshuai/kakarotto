import { Suspense, useEffect, useState, useRef } from 'react'
import { Canvas, useThree, useFrame  } from '@react-three/fiber'
import {
  useGLTF,
  OrbitControls,
  useProgress,
  Html,
  Billboard
} from '@react-three/drei';
import { Progress } from 'antd'
import styles from './index.module.scss';
import * as THREE from 'three';
import icon from '@/assets/local.jpg';

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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

const OriginPoint = () => {
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
}




const ModelMap = () => {
  const partRef = useRef();
  const { raycaster, camera, mouse } = useThree();
  const { scene } = useGLTF('/gltf_models/map/map4.gltf');
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
  
  useEffect(() => {
    if (partRef.current) {
      const luminances: any = {};
      (partRef.current as any).traverse((child: any) => {
        if (child.isMesh) {
          if (child.name.includes('市')) {
            child.material.side = THREE.DoubleSide;
            const hsl = { h: 0, s: 0, l: 0 };
            child.material.color.getHSL(hsl);
            luminances[child.uuid] = { ...hsl };
          }
          if (child.name.includes('河南边界')) {
            dealBorder(child);
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

  const createGradientTexture=(width: number, height: number)=> {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d')!;
    const gradient = context.createLinearGradient(0, 0, width, 0);
    createGradient(gradient,'black');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    // texture.offset.x = -linrOffset; // 初始偏移量
    texture.repeat.set(1, 1); // 防止重复
    texture.wrapS = THREE.RepeatWrapping; // 防止拉伸
    texture.wrapT = THREE.RepeatWrapping; // 防止拉伸
    return texture;
  }

  const dealBorder = (mesh: any) => {
    console.log(mesh)

    // mesh.material.color= 'red'
    const texture = createGradientTexture(4, 1);
    // mesh.material.color.g = 1;
    // mesh.material.map = texture;
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      // color:'red'
    });
    mesh.material = material;
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
      <OriginPoint/>
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
        <Canvas shadows camera={{ position: [20, 20, 20] }}>
          <axesHelper scale={100} />
          <OrbitControls makeDefault />
          <ambientLight intensity={1} />
          <pointLight position={[100, 100, 100]} decay={0} intensity={2} />
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