import { Html, Billboard } from "@react-three/drei";
import icon from "@/assets/local.jpg";
import * as THREE from "three";
import { weatherMap } from "./const";
import Weather from "./weather/index";
import { memo } from "react";

const PointLabel = memo(
  ({
    position,
    label,
    scale,
    visible,
    weather,
    weatherBegin,
  }: {
    position: THREE.Vector3;
    label: string;
    scale: number;
    visible: boolean;
    weather: number | null;
    weatherBegin: boolean;
  }) => {
    return (
      <>
        <Billboard position={[position.x, 0.8, position.z]}>
          <Html
            transform={true}
            style={{
              opacity: visible ? 1 : 0,
              transition: "all 1s",
              userSelect: "none",
            }}
            // className={visible ? style.point_label : style.point_label_hide}
          >
            <img src={icon} style={{ width: 20, height: 26 }} />
          </Html>
        </Billboard>
        <Billboard position={[position.x, 1.6, position.z]}>
          <Html
            scale={scale}
            transform={true}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: visible ? 1 : 0,
              transition: "all 1s",
              padding: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: 4,
              color: "#FFF",
              fontSize: "13px",
              userSelect: "none",
            }}
          >
            <span>{label}</span>
            {weather !== null && (
              <span
                style={{
                  color: "yellow",
                  fontWeight: "bold",
                  fontFamily: "DIN",
                  userSelect: "none",
                }}
              >
                {weatherMap[weather]}
              </span>
            )}
          </Html>
        </Billboard>
        <Weather begin={weatherBegin} position={position} weather={weather} />
      </>
    );
  }
);

export default PointLabel;
