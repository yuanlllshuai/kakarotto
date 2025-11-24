import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { memo, useEffect, useState } from "react";
import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";

const Index = memo(
  ({
    position,
    setLastAnimationEnd,
  }: {
    position: any;
    setLastAnimationEnd: (isEnd: boolean) => void;
  }) => {
    const [cylinder, setCylinder] = useState<any>();
    const cylinderRef = useRef<any>(null);
    const tweenRef = useRef<any>(null);

    useEffect(() => {
      createCircleMesh();
    }, []);

    const createAnimation = () => {
      // setLastAnimationEnd(false);
      tweenRef.current = new TWEEN.Tween({ scale: 0 })
        .to({ scale: 40 }, 1000)
        .easing(TWEEN.Easing.Cubic.InOut) // Cubic easing function
        .onUpdate(({ scale }) => {
          if (cylinderRef.current) {
            cylinderRef.current.scale.z = scale;
          }
        })
        .onComplete(() => {
          setLastAnimationEnd(true);
        })
        .start();
    };

    const createCircleMesh = () => {
      const shape = createCircleShape(0.1, 32);
      const extrudeSettings = {
        depth: 0.1,
        bevelEnabled: false,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const material = new THREE.MeshStandardMaterial({
        color: "cyan",
        emissive: "cyan",
        emissiveIntensity: 3,
      });
      const material1 = new THREE.MeshStandardMaterial({
        color: "cyan",
        emissive: "cyan",
        emissiveIntensity: 3,
      });
      const mesh = new THREE.Mesh(geometry, [material, material1]);
      setCylinder(mesh);
      createAnimation();
    };

    // 创建圆形路径
    const createCircleShape = (
      radius: number,
      segments: number = 32
    ): THREE.Shape => {
      const shape = new THREE.Shape();
      const angleStep = (2 * Math.PI) / segments;

      // 定义圆心
      shape.moveTo(radius, 0);

      // 逐个添加圆周上的点
      for (let i = 1; i <= segments; i++) {
        const angle = i * angleStep;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        shape.lineTo(x, y);
      }
      return shape;
    };

    useFrame(() => {
      if (tweenRef.current) {
        tweenRef.current.update(); // Update tween animations
      }
    });

    return (
      <>
        {cylinder && (
          <primitive
            ref={cylinderRef}
            object={cylinder}
            rotation-x={-Math.PI / 2}
            position={position}
          />
        )}
      </>
    );
  }
);

export default Index;
