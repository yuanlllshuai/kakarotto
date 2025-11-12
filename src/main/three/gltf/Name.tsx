import { Html } from "@react-three/drei";
import style from "./style.module.scss";
import { memo } from "react";

const PointLabel = memo(
  ({ begin, name = "" }: { begin: boolean; name: string }) => {
    return (
      <>
        <Html
          position={[0, 0, 14]}
          // rotation-y={-Math.PI / 8}
          transform={true}
          className={begin ? style.reflect : style.reflect_hide}
          style={{ userSelect: "none" }}
        >
          <div>{name}</div>
          <div style={{ fontSize: 13 }}>HENAN PROVINCE</div>
        </Html>
      </>
    );
  }
);

export default PointLabel;
