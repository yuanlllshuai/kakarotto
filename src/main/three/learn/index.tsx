import { useEffect, useRef, useState } from "react";
import { Box } from "@/utils/3D/threejs";
import { useResize } from "@/utils/hooks";
import styles from "./index.module.scss";
import { Segmented } from "antd";
import ScreenFull from "@/components/ScreenFull";

export const Component = () => {
  const domRef = useRef<any>(null);
  const boxRef = useRef<any>(null);
  const [lightType, setLightType] = useState<number>(0);

  useEffect(() => {
    return () => {
      if (boxRef.current) {
        boxRef.current.destroyGUI();
      }
    };
  }, []);

  const load = (size: any) => {
    boxRef.current = new Box({
      id: "threeBox",
      size,
      axesHelper: true,
      light: false, // 关闭默认光源
      lightType,
      animateHandle,
    });
    boxRef.current.start();
  };

  const animateHandle = (time: number, ins: any) => {
    time *= 0.0001;
    // ins.cube.rotation.x = time;
    ins.cube.rotation.y = time;
  };

  useResize({
    once: true,
    container: domRef,
    cb: load,
  });

  const lightChange = (value: number) => {
    setLightType(value);
    boxRef.current.setLightType(value);
  };

  return (
    <div className={styles.container} id="learn-three-container">
      <div className={styles.control}>
        <Segmented
          value={lightType}
          onChange={lightChange}
          options={[
            { value: 0, label: "聚光灯" },
            { value: 1, label: "点光源" },
            { value: 2, label: "平行光" },
          ]}
        />
      </div>
      <ScreenFull containerId="learn-three-container" position="top-center">
        <canvas id="threeBox" className={styles.container} ref={domRef} />
      </ScreenFull>
    </div>
  );
};
