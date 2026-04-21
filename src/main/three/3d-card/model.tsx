import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const numCards = 16;
const ringRadius = 3; // 大圆环半径（也是每张卡片的曲面半径）
const cardHeight = 0.8; // 每张卡片高度
const cardAngle = ((Math.PI * 2) / numCards) * 0.8; // 每张卡片占据的弧度（68% → 留出明显间距）
const rotationSpeed = 0.2; // 自动旋转速度（可调）

const Index = ({ setMapInit }: any) => {
  const { gl } = useThree();

  const [cards, setCards] = useState<any[]>(
    Array.from({ length: 16 }).map((_, i) => i),
  );
  const ringRef = useRef<THREE.Object3D | null>(null);
  const scrollProgressRef = useRef<number>(0);

  const onScroll = () => {
    const cardCanvas = document.getElementById("3d-card-canvas");
    const cardContainer = document.getElementById("3d-card-container");
    if (!cardCanvas || !cardContainer) return;
    const top = cardCanvas.offsetTop;
    const range = cardCanvas.offsetHeight - cardContainer.offsetHeight;
    console.log(111, top);

    if (range <= 0) {
      scrollProgressRef.current = 0;
      return;
    }

    const raw = (window.scrollY - top) / range;
    scrollProgressRef.current = Math.min(1, Math.max(0, raw));
    console.log("scrollProgress", scrollProgressRef.current);
  };

  useEffect(() => {
    setMapInit(true);
    onScroll();
    const cardContainer = document.getElementById("3d-card-container");
    if (cardContainer) {
      cardContainer.addEventListener("scroll", onScroll, { passive: true });
      cardContainer.addEventListener("resize", onScroll);
    }
    return () => {
      if (cardContainer) {
        cardContainer.removeEventListener("scroll", onScroll);
        cardContainer.removeEventListener("resize", onScroll);
      }
    };
  }, []);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <object3D ref={ringRef}>
      {cards.map((index) => {
        return (
          <mesh
            key={index}
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
            <meshStandardMaterial side={THREE.DoubleSide} color="red" />
          </mesh>
        );
      })}
    </object3D>
  );
};

export default Index;
