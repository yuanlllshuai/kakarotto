import { memo, useEffect } from "react";
import InstancedGridOfSquares from "../gltf/InstancedGridOfSquares";
import GradientBox from "./component/GradientBox";
import LinkRoad from "./component/LinkRoad";
import { Text3D } from "@react-three/drei";
import font from "@/fonts/Inter_Bold.json";

const MapModel = memo(({ setMapLoaded, cameraEnd }: any) => {
  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <>
      <object3D position={[0, 2, 0]}>
        <GradientBox colors={["#007898", "#29a1c5"]} lineWidth={0.8} />
      </object3D>
      <object3D
        position={[0, 2, 2 * 1.3]}
        scale-x={0.3}
        rotation-y={Math.PI / 2}
      >
        <GradientBox
          colors={["#09a6ae", "#0ba1a9"]}
          lineWidth={0.5}
          hasHighlight={true}
          alpha={0.2}
          highlightProps={{
            meshProps: {
              "rotation-x": Math.PI / 2,
              // "rotation-z": -Math.PI / 2,
              "position-y": 2,
            },
            planProps: { args: [4, 4] },
            color: "#0ba1a9",
            intensity: 1,
          }}
          hasDashedLine={true}
        />
      </object3D>
      <object3D position={[-4.5, 2, 0]} scale-x={0.5}>
        <GradientBox
          colors={["#083b64", "#1c5586"]}
          lineWidth={0.5}
          hasDashedLine={true}
        />
      </object3D>
      <object3D position={[0, 2, -4.5]} scale-x={0.5} rotation-y={Math.PI / 2}>
        <GradientBox
          colors={["#083b64", "#1c5586"]}
          lineWidth={0.5}
          hasDashedLine={true}
        />
      </object3D>
      <object3D position={[4.5, 2, 0]} scale-x={0.5}>
        <GradientBox
          colors={["#083b64", "#1c5586"]}
          lineWidth={0.5}
          hasDashedLine={true}
        />
      </object3D>
      <object3D position={[0, 4, -2.75]}>
        <LinkRoad />
      </object3D>
      <object3D position={[2.75, 4, 0]} rotation-y={-Math.PI / 2}>
        <LinkRoad />
      </object3D>
      <object3D position={[-2.75, 4, 0]} rotation-y={Math.PI / 2}>
        <LinkRoad />
      </object3D>
      <object3D position={[0, 0.4, 0]}>
        <InstancedGridOfSquares begin={cameraEnd} />
      </object3D>
      {/* <Text3D
        rotation-x={-Math.PI / 2}
        position={[0, 4.1, 2 * 1.3]}
        height={0.05}
        // lineHeight={0.5}
        // letterSpacing={-0.06}
        size={0.5}
        font={font as any}
      >
        AI
        <meshStandardMaterial
          color="#FFFFFF"
          // side={THREE.DoubleSide}
          transparent={true}
          depthWrite={false}
          depthTest={false}
        />
      </Text3D> */}
    </>
  );
});

export default MapModel;
