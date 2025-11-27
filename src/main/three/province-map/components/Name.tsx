import { Html } from "@react-three/drei";
import style from "./style.module.scss";
import { memo } from "react";
import * as THREE from "three";

const PointLabel = memo(
  ({
    begin,
    name = "",
    position,
  }: {
    begin: boolean;
    name: string;
    position: THREE.Vector3;
  }) => {
    return (
      <>
        <Html
          position={position}
          // rotation-y={-Math.PI / 8}
          transform={true}
          className={begin ? style.reflect : style.reflect_hide}
          style={{ userSelect: "none" }}
        >
          <div>{name}</div>
        </Html>
      </>
    );
  }
);

export default PointLabel;
