import { useEffect } from "react";
import * as Cesium from "cesium";
import styles from "./index.module.scss";
import ScreenFull from "@/components/ScreenFull";
import { CesiumAccessToken } from "@/const";
import { delay } from "@/utils";

export const Component = () => {
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    Cesium.Ion.defaultAccessToken = CesiumAccessToken;
    const viewer = new Cesium.Viewer("test-container", {
      globe: false,
      geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
    });
    try {
      const tileset = await Cesium.createGooglePhotorealistic3DTileset();
      viewer.scene.primitives.add(tileset);
    } catch (error) {
      console.log(`Failed to load tileset: ${error}`);
    }
  };

  return (
    <div
      id="cesium-test-container"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <ScreenFull containerId="cesium-test-container" position="top-center">
        <div id="test-container" className={styles.container}></div>
      </ScreenFull>
    </div>
  );
};
