import { useState, useRef, memo, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three';

const Wave = memo(() => {
  const [radius, setRadius] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const circleRef = useRef<any>();
  const countRef = useRef(0);

  useFrame(() => {
    if (circleRef.current) {
      countRef.current += 0.2;
      const r = 0 + countRef.current % 30;
      const o = 1 - (countRef.current/30) % 1;
      setRadius(r);
      setOpacity(o);
    }
  })


  const createGradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as any;
    const size = 128;
    canvas.width = size;
    canvas.height = size;
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.1, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.2, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.3, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.4, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.5, 'rgba(0 ,191, 255,0.2)');
    gradient.addColorStop(0.6, 'rgba(0 ,191, 255,0.5)');
    gradient.addColorStop(0.7, 'rgba(0 ,191 ,255,0.8)');
    gradient.addColorStop(0.8, 'rgba(0 ,191 ,255,0.5)');
    gradient.addColorStop(0.9, 'rgba(0 ,191 ,255,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);


  return (
    <mesh
      ref={circleRef}
      position={[0, -0.4, 0]}
      rotation-x={Math.PI / 2}
    >
      <circleGeometry args={[radius, 32]} />
      <meshBasicMaterial
        // color="#FFF"
        map={createGradientTexture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
})

export default Wave;