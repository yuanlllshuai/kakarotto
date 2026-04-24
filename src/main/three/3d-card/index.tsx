import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import styles from "./index.module.scss";
import Model from "./model";
import Camera from "./camera";

export const Component = () => {
  const [currentCard, setCurrentCard] = useState<any>();

  const scrollProgressRef = useRef<number>(0);
  const isScrollingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragRotationDeltaRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const lastPointerXRef = useRef<number | null>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current || lastPointerXRef.current === null) {
        return;
      }
      const deltaX = event.clientX - lastPointerXRef.current;
      const rotationDelta = -deltaX * 0.0035;
      lastPointerXRef.current = event.clientX;
      dragRotationDeltaRef.current += rotationDelta;
      dragVelocityRef.current = rotationDelta;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      lastPointerXRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (
    event,
  ) => {
    isDraggingRef.current = true;
    dragVelocityRef.current = 0;
    lastPointerXRef.current = event.clientX;
  };

  const render = () => {
    return (
      <div className={styles.model} onPointerDown={handlePointerDown}>
        <Canvas>
          <Camera />
          <axesHelper scale={2} />
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} decay={0} intensity={1} />
          <Suspense fallback={<></>}>
            <Model
              progress={scrollProgressRef}
              isScrolling={isScrollingRef}
              isDragging={isDraggingRef}
              dragRotationDelta={dragRotationDeltaRef}
              dragVelocity={dragVelocityRef}
              cardChange={cardChange}
            />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  const cardChange = (card: any) => {
    if (currentCard !== card.object.name) {
      setCurrentCard(card.object.name);
    }
  };

  return (
    <div className={styles.container} id="3d-card-container">
      {render()}
      <div className={styles.page2}>下一页</div>
    </div>
  );
};
