import { Cylinder } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

const Index = ({
  mapAnimationEnd,
  composerBegin,
}: {
  mapAnimationEnd: boolean;
  composerBegin: boolean;
}) => {
  const cylinderRef = useRef<any[]>([]);
  const meshRef = useRef<any[]>([]);
  const animationProgress = useRef(0); // Track animation progress

  useFrame((_state, delta) => {
    const pending = 0.6; // 动画持续时间
    if (
      mapAnimationEnd &&
      cylinderRef.current?.[0] &&
      animationProgress.current < 1
    ) {
      // Update progress with easing delta / pending 每帧完成的进度
      animationProgress.current = Math.min(
        1,
        animationProgress.current + delta / pending
      );
      // Ease-out function (quadratic)  三次缓动函数
      const easedProgress = 1 - Math.pow(1 - animationProgress.current, 3);

      // Calculate final values with easing
      const targetHeight = 50;
      cylinderRef.current.forEach((i) => {
        i.scale.y = easedProgress * targetHeight;
        i.position.y = 0.6 + easedProgress * 2.5;
      });
    }
  });

  return (
    <>
      <Cylinder
        position={[0, 0.6, 0]}
        args={[0.1, 0.1, 0.1, 32]}
        scale={[1, 0, 1]}
        ref={(el) => (cylinderRef.current[0] = el)}
        visible={mapAnimationEnd} // 仅在动画结束后显示圆柱体
      >
        <meshStandardMaterial
          color="cyan"
          emissive="cyan"
          emissiveIntensity={3}
          ref={(el) => (meshRef.current[0] = el)}
        />
      </Cylinder>
      <Cylinder
        position={[3, 0.6, 3]}
        args={[0.1, 0.1, 0.1, 32]}
        scale={[1, 0, 1]}
        ref={(el) => (cylinderRef.current[1] = el)}
        visible={mapAnimationEnd} // 仅在动画结束后显示圆柱体
      >
        <meshStandardMaterial
          color="cyan"
          emissive="cyan"
          emissiveIntensity={3}
          ref={(el) => (meshRef.current[1] = el)}
        />
      </Cylinder>
      <EffectComposer enabled={composerBegin}>
        <Bloom
          intensity={1.0} // The bloom intensity.
          mipmapBlur
          luminanceThreshold={1}
        />
      </EffectComposer>
    </>
  );
};

export default Index;
