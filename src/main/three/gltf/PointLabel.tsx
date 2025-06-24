import { Html, Billboard } from "@react-three/drei";
import icon from "@/assets/local.jpg";
import * as THREE from "three";
import { weatherMap } from "./const";

import Cloudy from "./weather/Cloudy";
import Sun from "./weather/Sun";
import Overcast from "./weather/Overcast";
import Rain from "./weather/Rain";

const PointLabel = ({
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
          }}
        >
          <span>{label}</span>
          {weather !== null && (
            <span
              style={{ color: "yellow", fontWeight: "bold", fontFamily: "DIN" }}
            >
              {weatherMap[weather]}
            </span>
          )}
        </Html>
      </Billboard>
      {weatherBegin && weather === 0 && (
        <Sun position={new THREE.Vector3(position.x, 5, position.z)} />
      )}
      {weatherBegin && weather === 1 && <Cloudy position={position} />}
      {weatherBegin && weather === 2 && <Overcast position={position} />}
      {weatherBegin && weather === 3 && <Rain position={position} />}
      {weatherBegin && weather === 4 && (
        <Rain position={position} size="middle" />
      )}
      {weatherBegin && weather === 5 && (
        <Rain position={position} size="large" />
      )}
    </>
  );
};

export default PointLabel;
