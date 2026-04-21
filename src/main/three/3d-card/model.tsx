import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { CycleRaycast } from "@react-three/drei";
import * as THREE from "three";
import mapPng from "@/assets/ayumi.png";

const numCards = 16;
const ringRadius = 3; // 大圆环半径
const cardHeight = 0.8; // 每张卡片高度
const cardAngle = ((Math.PI * 2) / numCards) * 0.8; // 每张卡片占据的弧度
const rotationSpeed = 0.1; // 自动旋转速度

const vertexShaderStr = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShaderStr = `
uniform sampler2D uTexture;
varying vec2 vUv;
void main() {
  gl_FragColor = texture2D(uTexture, vUv);
}
`;

const Index = (props: any) => {
  const { raycaster, camera, mouse } = useThree();
  const [cards, setCards] = useState<any[]>(
    Array.from({ length: 16 }).map((_, i) => i),
  );
  const ringRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const movingRef = useRef(false);
  const texture = useLoader(THREE.TextureLoader, mapPng);

  // 增加鼠标移动事件
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleMouseMove: React.EventHandler<any> = (event) => {
    if (event.target.tagName !== "CANVAS") {
      return;
    }
    event.preventDefault();
    handleMove();
  };

  // 处理移动事件，射线检测鼠标经过区域
  const handleMove = () => {
    raycaster.setFromCamera(mouse, camera);
    if (!ringRef.current) {
      return;
    }
    const intersects = raycaster.intersectObjects(ringRef.current.children);
    if (intersects.length > 0) {
      const intersect = intersects[0];
      console.log(intersect);
      movingRef.current = true;
    } else {
      movingRef.current = false;
    }
  };

  const onRaycastChanged = (hits: THREE.Intersection[]) => {
    // if (isScrollingRef.current) {
    //   return null;
    // }
    if (hits.length > 0) {
      const intersect = hits[0];
      movingRef.current = true;
      console.log(intersect);
      // clickMapName.current =
      //   clickMapName.current === intersect.object.name
      //     ? ""
      //     : intersect.object.name;
    } else {
      movingRef.current = false;
    }
    // setMapColor();
    return null;
  };

  useFrame((_, delta) => {
    console.log(movingRef.current);
    if (ringRef.current && !movingRef.current) {
      ringRef.current.rotation.y +=
        delta * rotationSpeed * (1 + props.progress.current * 4);
      if (props.progress.current > 0.9) {
        ringRef.current.position.y = props.progress.current - 0.9;
      }
      ringRef.current.rotation.x = props.progress.current * 0.3;
    }
  });

  return (
    <>
      <object3D ref={ringRef} onClick={(e: any) => e.stopPropagation()}>
        {cards.map((index) => {
          return (
            <mesh
              key={index}
              name={index}
              position={[0, 0, 0]}
              rotation-y={(index / 16) * Math.PI * 2}
            >
              <cylinderGeometry
                args={[
                  ringRadius, // 曲面半径（即大圆环半径）
                  ringRadius, // 上下半径相同
                  cardHeight, // 卡片高度
                  48, // radialSegments（越高越平滑）
                  1, // heightSegments
                  true, // openEnded（无上下盖）
                  -cardAngle / 2, // thetaStart（弧面居中）
                  cardAngle, // thetaLength（卡片实际弧度，小于间隔角度 → 有间距）
                ]}
              />
              {/* <meshStandardMaterial side={THREE.DoubleSide} color="red" /> */}
              <shaderMaterial
                uniforms={{
                  uTexture: { value: texture },
                }}
                vertexShader={vertexShaderStr}
                fragmentShader={fragmentShaderStr}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </object3D>
      <CycleRaycast
        preventDefault={true}
        scroll={false}
        keyCode={0}
        onChanged={onRaycastChanged}
        portal={ringRef.current as any}
      />
    </>
  );
};

export default Index;
