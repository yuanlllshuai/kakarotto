import { Html, Billboard } from "@react-three/drei";
import icon from "@/assets/local.jpg";

const PointLabel = ({ position, label, scale, visible, index }: any) => {
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
          }}
        >
          <span>{label}</span>
          <span
            style={{ color: "yellow", fontWeight: "bold", fontFamily: "DIN" }}
          >
            {index}
          </span>
        </Html>
      </Billboard>
    </>
  );
};

export default PointLabel;
