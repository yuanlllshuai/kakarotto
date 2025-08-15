import styles from "./index.module.scss";
import classNames from "classnames";
import { memo, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { chartOptions } from "./const";

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
    const zoomValue = container.clientWidth / window.innerWidth;
    setScale(zoomValue);
  };

  return (
    <div className={styles.layout} id="animate-card-container">
      <div
        className={classNames(styles.container, { [styles.begin]: begin })}
        style={{
          width: window.innerWidth,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        {data.map((item, index) =>
          chartOptions?.[index] ? (
            <div key={item}>
              <ReactECharts
                option={chartOptions[index]}
                style={{ height: "100%", width: "100%" }}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
              />
            </div>
          ) : (
            <div key={item}></div>
          )
        )}
      </div>
    </div>
  );
});

export default Index;
