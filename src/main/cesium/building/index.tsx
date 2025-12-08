import { useEffect } from "react";
import * as Cesium from "cesium";
import styles from "./index.module.scss";
import ScreenFull from "@/components/ScreenFull";
import { CesiumAccessToken } from "@/const";
import { delay } from "@/utils";

const Index = () => {
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    Cesium.Ion.defaultAccessToken = CesiumAccessToken;
    const viewer = new Cesium.Viewer("building-container", {
      terrain: Cesium.Terrain.fromWorldTerrain(),
    });
    await delay(2000);
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-104.9965, 39.74248, 4000),
    });

    // Add Cesium OSM Buildings.
    const buildingsTileset = await Cesium.createOsmBuildingsAsync();
    viewer.scene.primitives.add(buildingsTileset);

    async function addBuildingGeoJSON() {
      // Load the GeoJSON file from Cesium ion.
      const geoJSONURL = await Cesium.IonResource.fromAssetId(4189626);
      // Create the geometry from the GeoJSON, and clamp it to the ground.
      const geoJSON = await Cesium.GeoJsonDataSource.load(geoJSONURL, {
        clampToGround: true,
      });
      // Add it to the scene.
      const dataSource = await viewer.dataSources.add(geoJSON);
      // By default, polygons in CesiumJS will be draped over all 3D content in the scene.
      // Modify the polygons so that this draping only applies to the terrain, not 3D buildings.
      for (const entity of dataSource.entities.values) {
        (entity.polygon as any).classificationType =
          Cesium.ClassificationType.TERRAIN;
      }
      // Move the camera so that the polygon is in view.
      viewer.flyTo(dataSource);
    }
    addBuildingGeoJSON();

    buildingsTileset.style = new Cesium.Cesium3DTileStyle({
      // Create a style rule to control each building's "show" property.
      show: {
        conditions: [
          // Any building that has this elementId will have `show = false`.
          ["${elementId} === 332469316", false],
          ["${elementId} === 332469317", false],
          ["${elementId} === 235368665", false],
          ["${elementId} === 530288180", false],
          ["${elementId} === 530288179", false],
          ["${elementId} === 532245203", false],
          // If a building does not have one of these elementIds, set `show = true`.
          [true, true],
        ],
      },
      // Set the default color style for this particular 3D Tileset.
      // For any building that has a `cesium#color` property, use that color, otherwise make it white.
      color:
        "Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')",
    });

    const newBuildingTileset = await Cesium.Cesium3DTileset.fromIonAssetId(
      4189638
    );
    viewer.scene.primitives.add(newBuildingTileset);

    // Move the camera to the new building.
    viewer.flyTo(newBuildingTileset);
  };

  return (
    <div
      id="cesium-building-container"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <ScreenFull containerId="cesium-building-container" position="top-center">
        <div id="building-container" className={styles.container}></div>
      </ScreenFull>
    </div>
  );
};

export default Index;
