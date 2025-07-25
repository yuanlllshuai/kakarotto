import { memo, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Points } from "@react-three/drei";
import Overcast from "./Overcast";
import { cloneDeep } from "lodash";

const COUNTMAP = {
  small: { count: 80, speed: 0.2 },
  middle: { count: 200, speed: 0.2 },
  large: { count: 600, speed: 0.2 },
};
const LENGTH = 4.8;

const Index = memo(
  ({
    position,
    size = "small",
  }: {
    position: THREE.Vector3;
    size?: "small" | "middle" | "large";
    type?: "lightning";
  }) => {
    const rainRef = useRef<THREE.Points>(null!);
    const [count, setCount] = useState(0);
    const [positions, setPositions] = useState<Float32Array>(
      new Float32Array(0)
    );
    const [initPositions, setInitPositions] = useState<Float32Array>(
      new Float32Array(0)
    );

    const [initRandoms, setInitRandoms] = useState<number[]>([]);

    const [sizes, setSizes] = useState<Float32Array>(new Float32Array(0));

    const createGradientTexture = useMemo(() => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d") as any;
      canvas.width = 18;
      canvas.height = 18;
      const gradient = context.createRadialGradient(9, 9, 0, 9, 9, 12);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      // gradient.addColorStop(0.2, "rgba(255,255,255,0.1)");
      // gradient.addColorStop(0.3, "rgba(255,255,255,0.3)");
      // gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
      gradient.addColorStop(0.7, "rgba(0,0,0,0)");
      gradient.addColorStop(0.8, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 18, 18);
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    }, []);

    useEffect(() => {
      setCount(COUNTMAP[size].count);
      const count = COUNTMAP[size].count;
      const positions = new Float32Array(count * 3);
      const randoms = [];
      const sizes = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() * 2 - 1) * 0.7 + position.x;
        positions[i * 3 + 1] = Math.random() * LENGTH;
        positions[i * 3 + 2] = (Math.random() * 2 - 1) * 0.7 + position.z;
        randoms.push(Math.random() * 2 - 1);
        sizes[i] = Math.random() * 0.1 + 0.03;
      }
      setPositions(positions);
      setInitPositions(cloneDeep(positions));
      setInitRandoms(randoms);
      setSizes(sizes);
    }, [size]);

    useFrame(() => {
      if (count !== 0) {
        const speed = COUNTMAP[size].speed;
        const p = rainRef.current.geometry.attributes.position.array;
        for (let i = 0; i < count * 3; i += 3) {
          p[i + 1] -=
            LENGTH * 0.01 * 2 * speed + initRandoms[i % count] * 0.002;
          p[i] += Math.sin(p[i + 1]) * 0.004 * initRandoms[i % count];
          p[i + 2] += Math.sin(p[i + 1]) * 0.004 * initRandoms[i % count];
          // positions[i + 2] = Math.cos(positions[i + 1] / Math.PI);

          if (p[i + 1] < 0) {
            p[i + 1] = LENGTH;
            p[i] = initPositions[i];
            p[i + 2] = initPositions[i + 2];
          }
        }
        rainRef.current.geometry.attributes.position.needsUpdate = true;
      }
    });

    if (count === 0) {
      return <></>;
    }

    return (
      <>
        <Overcast position={position} color="#D0D0D0" />
        <Points
          ref={rainRef}
          limit={1000} // Optional: max amount of items (for calculating buffer size)
          range={10} // Optional: draw-range
          positions={positions}
          sizes={sizes}
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-size"
              count={COUNTMAP[size].count}
              itemSize={1}
              array={sizes}
            />
            <bufferAttribute
              attach="attributes-position"
              count={COUNTMAP[size].count}
              itemSize={3}
              array={positions}
            />
          </bufferGeometry>
          {/* <pointsMaterial
            size={0.1}
            transparent
            alphaMap={createGradientTexture}
            depthWrite={false}
            color="rgba(255,255,255,1)"
          /> */}
          <shaderMaterial
            uniforms={{
              uAlphaMap: { value: createGradientTexture },
              uColor: { value: new THREE.Color("rgba(255,255,255,1)") },
            }}
            vertexShader={`
                attribute float size;
                varying float vSize;
                
                void main() {
                  vSize = size;
                  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                  gl_PointSize = vSize * (300.0 / -mvPosition.z);
                  gl_Position = projectionMatrix * mvPosition;
                }
              `}
            fragmentShader={`
                uniform sampler2D uAlphaMap;
                uniform vec3 uColor;
                varying float vSize;
                
                void main() {
                  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
                  vec4 texColor = texture2D(uAlphaMap, uv);
                  gl_FragColor = vec4(uColor, texColor.r);
                }
              `}
            depthWrite={false}
            transparent
          />
        </Points>
      </>
    );
  }
);

export default Index;
