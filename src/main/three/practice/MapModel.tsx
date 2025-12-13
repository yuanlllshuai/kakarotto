import { memo, useEffect } from "react";
import InstancedGridOfSquares from "../gltf/InstancedGridOfSquares";
import GradientBox from "./component/GradientBox";
import LinkRoad from "./component/LinkRoad";

const MapModel = memo(({ setMapLoaded, cameraEnd }: any) => {
  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <>
      <object3D position={[-4.5, 2, 0]} scale-x={0.5}>
        <GradientBox colors={["#083b64", "#1c5586"]} lineWidth={0.5} />
      </object3D>
      <object3D position={[0, 2, -4.5]} scale-x={0.5} rotation-y={Math.PI / 2}>
        <GradientBox colors={["#083b64", "#1c5586"]} lineWidth={0.5} />
      </object3D>
      <object3D position={[0, 2, 0]}>
        <GradientBox colors={["#007898", "#29a1c5"]} lineWidth={0.8} />
      </object3D>
      <object3D position={[4.5, 2, 0]} scale-x={0.5}>
        <GradientBox colors={["#083b64", "#1c5586"]} lineWidth={0.5} />
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
    </>
  );
});

export default MapModel;
