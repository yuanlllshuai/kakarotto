import styles from "./index.module.scss";
import classNames from "classnames";
import { memo, useEffect, useState } from "react";
import { div } from "three/examples/jsm/nodes/Nodes.js";

const Index = memo(({ begin }: { begin: boolean }) => {
  let resizeObserver: ResizeObserver | null = null;

  const [scale, setScale] = useState<number>(1);

  const data = new Array(8).fill(0).map((_, i) => i);

  useEffect(() => {
    resize();
    computedScale();
    return () => {
      removeResize();
    };
  });

  const resize = () => {
    const container = document.getElementById("animate-card-container");
    if (container) {
      resizeObserver = new ResizeObserver(() => {
        computedScale();
      });
      resizeObserver.observe(container);
    }
  };

  const removeResize = () => {
    const container = document.getElementById("animate-card-container");
    if (resizeObserver && container) {
      resizeObserver.unobserve(container);
      resizeObserver = null;
    }
  };

  const computedScale = () => {
    const container: any = document.getElementById("animate-card-container");
    // console.log(container.clientWidth);
    const zoomValue = container.clientWidth / window.innerWidth;
    setScale(zoomValue);
  };

  return (
    <div className={styles.layout} id="animate-card-container">
      <div
        className={classNames(styles.container, { [styles.begin]: begin })}
        style={{
          width: window.innerWidth,
          // height: `${1080}px`,
          // height: 20,
          // border: "1px solid red",
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        {data.map((item) => (
          <div
            key={item}
            // style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
});

export default Index;
