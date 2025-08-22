import { useRef, memo, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Wave = memo(() => {
  const circleRef = useRef<any>();
  const materialRef = useRef<any>();
  const countRef = useRef(0);
  const isConsole = useRef(false);

  useFrame(() => {
    if (circleRef.current) {
      countRef.current += 0.2;
      const r = 0 + (countRef.current % 50);
      const o = 1 - ((countRef.current / 50) % 1);
      // setRadius(r);
      circleRef.current.scale.set(r, r, r);
      // circleRef.current.scale.needsUpdate = true;
      // setOpacity(o);
      materialRef.current.opacity = o;

      if (!isConsole.current) {
        // console.log(circleRef.current);
        isConsole.current = true; // 只打印一次
      }
    }
  });

  const createGradientTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d") as any;
    const size = 128;
    canvas.width = size;
    canvas.height = size;
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.1, "rgba(0,0,0,0)");
    gradient.addColorStop(0.2, "rgba(0,0,0,0)");
    gradient.addColorStop(0.3, "rgba(0,0,0,0)");
    gradient.addColorStop(0.4, "rgba(0,0,0,0)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0)");
    gradient.addColorStop(0.6, "rgba(0,0,0,0)");
    gradient.addColorStop(0.7, "rgba(0 ,191 ,255,0.05)");
    gradient.addColorStop(0.75, "rgba(0 ,191 ,255,0.2)");
    gradient.addColorStop(0.8, "rgba(0 ,191 ,255,0.25)");
    gradient.addColorStop(0.85, "rgba(0 ,191 ,255,0.2)");
    gradient.addColorStop(0.9, "rgba(0 ,191 ,255,0.05)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
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
      scale={5}
    >
      <circleGeometry args={[1, 40]} />
      <meshBasicMaterial
        // color="#FFF"
        ref={materialRef}
        map={createGradientTexture}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
});

export default Wave;
