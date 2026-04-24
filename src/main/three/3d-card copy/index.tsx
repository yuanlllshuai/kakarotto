import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import styles from "./index.module.scss";
import Model from "./model";
import Camera from "./camera";

export const Component = () => {
  const [mapInit, setMapInit] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [currentCard, setCurrentCard] = useState<any>();

  const scrollProgressRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  const onScroll = () => {
    isScrollingRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 500);

    const cardContainer = document.getElementById("3d-card-container");
    const cardCanvas = document.getElementById("3d-card-canvas");
    const cardScroll = document.getElementById("3d-card-scroll");
    const cardInfoTop = document.getElementById("3d-card-info-top");
    const cardInfoBottom = document.getElementById("3d-card-info-bottom");
    if (!cardCanvas || !cardScroll || !cardContainer) return;
    const range = cardScroll.offsetHeight - cardCanvas.offsetHeight;

    if (range <= 0) {
      scrollProgressRef.current = 0;
      return;
    }

    const raw = cardContainer.scrollTop / range;
    scrollProgressRef.current = Math.min(1, Math.max(0, raw));
    cardCanvas.style.opacity = `${1.5 - scrollProgressRef.current}`;
    // console.log("scrollProgress", scrollProgressRef.current);
    if (cardInfoTop) {
      cardInfoTop.style.opacity = `${0.74 - scrollProgressRef.current}`;
      cardInfoTop.style.filter = `blur(${10 * scrollProgressRef.current}px)`;
      cardInfoTop.style.transform = `translateX(-50%) translateY(${-20 * scrollProgressRef.current}px)`;
    }
    if (cardInfoBottom) {
      cardInfoBottom.style.opacity = `${0.74 - scrollProgressRef.current}`;
      cardInfoBottom.style.filter = `blur(${10 * scrollProgressRef.current}px)`;
      cardInfoBottom.style.transform = `translateX(-50%) translateY(${20 * scrollProgressRef.current}px)`;
    }
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

  useEffect(() => {
    if (mapInit) {
      setTimeout(() => {
        setShow(true);
      }, 0);
    }
  }, [mapInit]);

  const render = () => {
    return (
      <div
        className={styles.model}
        style={{
          opacity: show ? 1 : 0,
        }}
        id="3d-card-canvas"
      >
        <Canvas
          shadows
          scene={
            {
              // background: new THREE.Color("rgb(2, 3, 34)"),
            }
          }
        >
          <Camera progress={scrollProgressRef} />
          {/* <axesHelper scale={2} /> */}
          <OrbitControls makeDefault enableZoom={false} />
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} decay={0} intensity={1} />
          <Suspense fallback={<></>}>
            <Model
              setMapInit={setMapInit}
              progress={scrollProgressRef}
              isScrolling={isScrollingRef}
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
      <div className={styles.card_info_top} id="3d-card-info-top">
        {`智能写作助手${currentCard || ""}`}
      </div>
      <div
        id="3d-card-scroll"
        style={{ position: "relative", height: "150vh" }}
      >
        {render()}
      </div>
      <div className={styles.card_info_bottom} id="3d-card-info-bottom">
        专为医学科研打造的长文本生成引擎，深度融合四川大学医学语料，一键生成符合规范的学术论文底稿与大纲
      </div>
      <div className={styles.page2}>下一页</div>
    </div>
  );
};
