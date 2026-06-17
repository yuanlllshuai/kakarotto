import { useEffect } from "react";
import * as Cesium from "cesium";
import styles from "./index.module.scss";
import ScreenFull from "@/components/ScreenFull";
import { CesiumAccessToken } from "@/const";
import { flightData } from './data';

export const Component = () => {
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    Cesium.Ion.defaultAccessToken = CesiumAccessToken;
    const viewer = new Cesium.Viewer("flight-container", {
      terrain: Cesium.Terrain.fromWorldTerrain(),
    });

    const osmBuildings = await Cesium.createOsmBuildingsAsync();
    viewer.scene.primitives.add(osmBuildings);
    // Create a point for each.
    const timeStepInSeconds = 30;
    const totalSeconds = timeStepInSeconds * (flightData.length - 1);
    const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
    const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.timeline.zoomTo(start, stop);
    // Speed up the playback speed 50x.
    viewer.clock.multiplier = 50;
    // Start playing the scene.
    viewer.clock.shouldAnimate = true;

    // The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
    const positionProperty = new Cesium.SampledPositionProperty();

    for (let i = 0; i < flightData.length; i++) {
      const dataPoint = flightData[i];

      // Declare the time for this individual sample and store it in a new JulianDate instance.
      const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
      const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
      // Store the position along with its timestamp.
      // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
      positionProperty.addSample(time, position);

      viewer.entities.add({
        description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
        position: position,
        point: { pixelSize: 10, color: Cesium.Color.RED }
      });
    }

    async function loadModel() {
      // Load the glTF model from Cesium ion.
      const airplaneUri = await Cesium.IonResource.fromAssetId(4185788);
      const airplaneEntity = viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({ start: start, stop: stop }),
        ]),
        position: positionProperty,
        // Attach the 3D model instead of the red point.
        model: { uri: airplaneUri },
        // Automatically compute the orientation from the position.
        orientation: new Cesium.VelocityOrientationProperty(positionProperty),
        path: new Cesium.PathGraphics({ width: 3 }),
      });

      viewer.trackedEntity = airplaneEntity;
    }

    loadModel();
  };

  return (
    <div
      id="cesium-flight-container"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <ScreenFull containerId="cesium-flight-container" position="top-center">
        <div id="flight-container" className={styles.container}></div>
      </ScreenFull>
    </div>
  );
};
