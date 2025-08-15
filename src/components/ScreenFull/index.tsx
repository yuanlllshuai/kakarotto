import { useState, useEffect } from "react";

import styles from "./index.module.scss";
import screenfull from "screenfull";
import classNames from "classnames";

type Position =
  | "top-right"
  | "bottom-right"
  | "top-left"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

const positionMap: Record<Position, string> = {
  "top-right": styles.topRight,
  "bottom-right": styles.bottomRight,
  "top-left": styles.topLeft,
  "bottom-left": styles.bottomLeft,
  "top-center": styles.topCenter,
  "bottom-center": styles.bottomCenter,
};

const Index = ({
  containerId,
  children,
  position = "top-right",
}: {
  containerId: string;
  children: any;
  position?: Position;
}) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", fullChange);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", fullChange);
      }
    };
  }, []);

  const fullChange = () => {
    setIsFullScreen(screenfull.isFullscreen);
  };

  const screenFull = () => {
    const fullDom = document.getElementById(containerId);
    if (screenfull.isEnabled) {
      if (!isFullScreen) {
        screenfull.request(fullDom as Element);
      } else {
        screenfull.exit();
      }
    }
  };

  return (
    <>
      {children}
      <div
        className={classNames(styles.screenfull, positionMap[position])}
        onClick={screenFull}
      >
        {isFullScreen ? "退出" : "全屏"}
      </div>
    </>
  );
};

export default Index;
