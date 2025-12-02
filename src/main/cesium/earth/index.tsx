import { useEffect } from "react";
import { createOsmBuildingsAsync, Ion, Terrain, Viewer } from "cesium";
import styles from "./index.module.scss";
import ScreenFull from "@/components/ScreenFull";

const Index = () => {
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmEyNDI5Mi0zYTRhLTRlMzItOTM2MS0xNTVmNjcyMThiMzEiLCJpZCI6MzY1NzU2LCJpYXQiOjE3NjQ2NTY1MTd9.gDooJhL6g0ohUhvA4LLpAkg1TihL_q1S5Tr0UCDkjhM";

    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    const viewer = new Viewer("earthContainer", {
      terrain: Terrain.fromWorldTerrain(),
    });

    // Fly the camera to San Francisco at the given longitude, latitude, and height.
    // viewer.camera.flyTo({
    //   destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
    //   orientation: {
    //     heading: CesiumMath.toRadians(0.0),
    //     pitch: CesiumMath.toRadians(-15.0),
    //   },
    // });

    // Add Cesium OSM Buildings, a global 3D buildings layer.
    const buildingTileset = await createOsmBuildingsAsync();
    viewer.scene.primitives.add(buildingTileset);
  };

  return (
    <div
      id="cesium-earth-container"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <ScreenFull containerId="cesium-earth-container" position="top-center">
        <div id="earthContainer" className={styles.container}></div>
      </ScreenFull>
    </div>
  );
};

export default Index;
