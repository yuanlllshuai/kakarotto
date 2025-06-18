import { Html, Billboard } from "@react-three/drei";
import icon from "@/assets/local.jpg";

const PointLabel = ({ position, label, scale, visible }: any) => {
  return (
    <>
      <Billboard position={[position.x, 0.8, position.z]}>
        <Html
          transform={true}
          style={{
            opacity: visible ? 1 : 0,
            transition: "all 0.3s",
          }}
        >
          <img src={icon} style={{ width: 20, height: 26 }} />
        </Html>
      </Billboard>
      <Billboard position={[position.x, 2.6, position.z]}>
        <Html
          scale={scale}
          transform={true}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            opacity: visible ? 1 : 0,
            transition: "all 0.3s",
          }}
        >
          <div
            style={{
              padding: "40px 70px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: 8,
              color: "#FFF",
            }}
          >
            {label}
          </div>
        </Html>
      </Billboard>
    </>
  );
};

export default PointLabel;
