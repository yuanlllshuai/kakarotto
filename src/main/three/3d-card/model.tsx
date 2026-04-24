import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { CycleRaycast } from "@react-three/drei";
import * as THREE from "three";
import tech from "./img/portfolio-tech.avif";
import immo from "./img/portfolio-immo.avif";
import sante from "./img/portfolio-sante.avif";
import tourisme from "./img/portfolio-tourisme.avif";
import finance from "./img/portfolio-finance.avif";
import pubImg from "./img/portfolio-pub.avif";
import energie from "./img/portfolio-energie.avif";
import divertissement from "./img/portfolio-divertissement.avif";
import { imgArr } from "./const";

const numCards = 16;
const gap = Math.PI / 48; // 定义间隙大小（角度）
const cardHeight = 0.7; // 每张卡片高度
const cardAngle = (Math.PI * 2 - gap * numCards) / numCards; // 每张卡片占据的弧度
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
uniform vec3 borderColor;
uniform float borderWidth;
void main() {
  vec4 texColor = texture2D(uTexture, vUv);
  float blur = 0.005;    // 模糊程度，防止锯齿

  // 计算四个边界的遮罩
  // 如果在边缘，edge 会接近 1.0
  float h1 = smoothstep(0.0, blur, vUv.x) * (1.0 - smoothstep(1.0 - blur, 1.0, vUv.x));
  float v1 = smoothstep(0.0, blur, vUv.y) * (1.0 - smoothstep(1.0 - blur, 1.0, vUv.y));
  
  // 判断内部区域（非边框区域）
  float h2 = smoothstep(borderWidth, borderWidth + blur, vUv.x) * (1.0 - smoothstep(1.0 - borderWidth - blur, 1.0 - borderWidth, vUv.x));
  float v2 = smoothstep(borderWidth, borderWidth + blur, vUv.y) * (1.0 - smoothstep(1.0 - borderWidth - blur, 1.0 - borderWidth, vUv.y));

  float contentMask = h2 * v2; // 1.0 表示内部，0.0 表示边框区域
  
  // 混合颜色：如果 contentMask 是 0，则显示红色
  gl_FragColor = vec4(mix(borderColor, texColor.rgb, contentMask), texColor.a);
}
`;

const textureSources = [
  tech,
  immo,
  sante,
  tourisme,
  finance,
  pubImg,
  energie,
  divertissement,
];

const Index = (props: any) => {
  const { raycaster, camera, mouse } = useThree();
  const [cards] = useState<any[]>(
    Array.from({ length: numCards }).map((_, i) => i),
  );
  const ringRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const movingRef = useRef(false);
  const textures = useLoader(
    THREE.TextureLoader,
    textureSources.slice(0, imgArr.length),
  );
  const outRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const ringRadius = useRef(3); // 大圆环半径
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      // const intersect = intersects[0];
      // console.log(intersect);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      movingRef.current = true;
    } else {
      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          movingRef.current = false;
        }, 200);
      }
    }
  };

  const onRaycastChanged = (hits: THREE.Intersection[]) => {
    if (hits.length > 0) {
      // const intersect = hits[0];
      movingRef.current = true;
      // console.log(intersect);
    } else {
      movingRef.current = false;
    }
    return null;
  };

  useFrame((_, delta) => {
    if (ringRef.current) {
      if (!movingRef.current || props.isScrolling.current) {
        // 圆环转动，速度随滚动越来越快
        ringRef.current.rotation.y +=
          delta * rotationSpeed * (1 + props.progress.current * 4);
        // 圆环倾斜角度随滚动增加
        if (props.progress.current > 0.9) {
          ringRef.current.position.y = props.progress.current - 0.9;
        }
      }
      const { x, y } = mouse;
      const targetRotationX = -y * 0.1;
      const targetRotationY = x * 0.15;

      // 圆环位置随滚动上升
      ringRef.current.rotation.x = props.progress.current * 0.24;
      // 圆环倾斜角度随鼠标变化
      outRef.current.rotation.x = THREE.MathUtils.lerp(
        outRef.current.rotation.x,
        -targetRotationX * (1 - props.progress.current),
        0.05,
      );
      outRef.current.rotation.y = THREE.MathUtils.lerp(
        outRef.current.rotation.y,
        -targetRotationY * (1 - props.progress.current),
        0.05,
      );
    }
  });

  return (
    <>
      <object3D ref={outRef} position={[0, 0, -ringRadius.current]}>
        <object3D
          position={[0, 0, ringRadius.current]}
          ref={ringRef}
          onClick={(e: any) => e.stopPropagation()}
        >
          {cards.map((index) => {
            const texture = textures[index % textures.length];
            return (
              <object3D key={index}>
                <mesh
                  name={index}
                  position={[0, 0, 0]}
                  rotation-y={(index / numCards) * Math.PI * 2}
                >
                  <cylinderGeometry
                    args={[
                      ringRadius.current, // 曲面半径
                      ringRadius.current, // 上下半径相同
                      cardHeight, // 卡片高度
                      48,
                      1,
                      true,
                      -cardAngle / 2, // 弧面居中
                      cardAngle, // 卡片实际弧度
                    ]}
                  />
                  <shaderMaterial
                    uniforms={{
                      borderWidth: { value: 0.00000001 },
                      borderColor: { value: new THREE.Color("#ccc") },
                      uTexture: { value: texture },
                    }}
                    vertexShader={vertexShaderStr}
                    fragmentShader={fragmentShaderStr}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </object3D>
            );
          })}
        </object3D>
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
