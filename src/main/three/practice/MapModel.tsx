import { memo, useEffect } from "react";
import InstancedGridOfSquares from "../gltf/InstancedGridOfSquares";
import GradientBox from "./component/GradientBox";
import Labels from "./Labels";
import Road from "./Road";
import Line from "./component/Line";
// import * as THREE from "three";

const MapModel = memo(({ setMapLoaded, cameraEnd }: any) => {
  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <>
      /** 中间盒子 */
      <object3D position={[0, 2, 0]}>
        <GradientBox
          colors={["#007898", "#29a1c5"]}
          borderColor={[142, 225, 245, 0.02]}
        />
        <object3D position={[0, 2.1, 0]} scale={0.2} scale-y={0.05}>
          <GradientBox
            colors={["#3ccadc", "#3ccadc"]}
            opacity={0.7}
            borderColor={[142, 225, 245, 0.02]}
          />
        </object3D>
      </object3D>
      <object3D
        position={[0, 2, 2 * 1.305]}
        scale-x={0.3}
        rotation-y={Math.PI / 2}
      >
        <GradientBox
          colors={["#09a6ae", "#0ba1a9"]}
          hasHighlight={true}
          opacity={0.2}
          highlightProps={{
            meshProps: {
              "rotation-x": Math.PI / 2,
              "position-y": 2,
            },
            planProps: { args: [4, 4] },
            color: "#0ba1a9",
            intensity: 1,
          }}
          borderColor={[124, 246, 254, 0.02]}
          hasDashedLine={true}
          hideBorderIndexes={[2, 5, 7]}
        />
      </object3D>
      <object3D position={[-4.5, 2, 0]} scale-x={0.5}>
        <GradientBox
          colors={["#083b64", "#1c5586"]}
          hasDashedLine={true}
          borderColor={[175, 211, 248, 0.01]}
        />
      </object3D>
      <object3D position={[0, 2, -4.5]} scale-x={0.5} rotation-y={Math.PI / 2}>
        <GradientBox
          colors={["#083b64", "#1c5586"]}
          hasDashedLine={true}
          borderColor={[175, 211, 248, 0.01]}
        />
      </object3D>
      <object3D position={[4.5, 2, 0]} scale-x={0.5}>
        <GradientBox
          colors={["#083b64", "#1c5586"]}
          hasDashedLine={true}
          borderColor={[175, 211, 248, 0.01]}
        />
      </object3D>
      <Road />
      <object3D position={[0, 0.4, 0]}>
        <InstancedGridOfSquares begin={cameraEnd} />
      </object3D>
      <Labels />
      <Line />
    </>
  );
});

export default MapModel;
