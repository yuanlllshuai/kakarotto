import { memo, useEffect } from "react";
import InstancedGridOfSquares from "../gltf/InstancedGridOfSquares";
import Road from "./Road";
import CenterBox from "./CenterBox";
import FrontBox from "./FrontBox";
import LeftBox from "./LeftBox";
import RightBox from "./RightBox";
import EndBox from "./EndBox";

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
      /** 后方盒子 */
      <EndBox />
      /** 右方盒子 */
      <RightBox />
      <Road />
      <object3D position={[0, 0.4, 0]}>
        <InstancedGridOfSquares begin={cameraEnd} />
      </object3D>
    </>
  );
});

export default MapModel;
