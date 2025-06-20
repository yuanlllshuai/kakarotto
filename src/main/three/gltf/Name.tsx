import { Html } from "@react-three/drei";
import style from "./style.module.scss";

const PointLabel = ({ begin }: { begin: boolean }) => {
  return (
    <>
      <Html
        position={[-4, 0.4, 10]}
        rotation-y={-Math.PI / 8}
        transform={true}
        className={begin ? style.reflect : style.reflect_hide}
      >
        <div>河南省</div>
        <div style={{ fontSize: 13 }}>HENAN PROVINCE</div>
      </Html>
    </>
  );
};

export default PointLabel;
