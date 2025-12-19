import { memo, useEffect } from "react";
import InstancedGridOfSquares from "../gltf/InstancedGridOfSquares";
import GradientBox from "./component/GradientBox";
import Labels from "./Labels";
import Road from "./Road";
import CenterBox from "./CenterBox";
import FrontBox from "./FrontBox";
import LeftBox from "./LeftBox";

const MapModel = memo(({ setMapLoaded, cameraEnd }: any) => {
  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <>
      /** 中间盒子 */
      <CenterBox />
      /** 前方盒子 */
      <FrontBox />
      /** 左方盒子 */
      <LeftBox />
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
    </>
  );
});

export default MapModel;
