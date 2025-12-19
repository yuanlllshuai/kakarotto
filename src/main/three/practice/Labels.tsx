import { Text3D, Html } from "@react-three/drei";
import font from "@/fonts/Inter_Bold.json";

const Index = () => {
  return (
    <>
      <Text3D
        rotation-x={-Math.PI / 2}
        position={[-0.3, 4, 2 * 1.4]}
        height={0.05}
        size={0.5}
        font={font as any}
      >
        AI
        <meshPhongMaterial color="#7bfcfe" transparent={true} opacity={1} />
      </Text3D>
      <Html
        position={[0, 3.5, -3.5]}
        // rotation-x={-Math.PI / 2}
        // rotation-y={Math.PI / 2}
        transform={true}
        style={{
          userSelect: "none",
          color: "#76add3",
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 0.9,
        }}
      >
        <div>DV干扰变量</div>
        <div style={{ fontSize: 7, opacity: 0.6 }}>Disturbance Variable</div>
      </Html>
      {/* <Html
        position={[-3.5, 3.5, 0]}
        // rotation-x={-Math.PI / 2}
        rotation-y={Math.PI / 2}
        transform={true}
        style={{
          userSelect: "none",
          color: "#76add3",
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 0.9,
        }}
      >
        <div>MV操作变量</div>
        <div style={{ fontSize: 7, opacity: 0.6 }}>Manipulate Variable</div>
      </Html> */}
      <Html
        position={[5.5, 3.5, 0]}
        // rotation-x={-Math.PI / 2}
        rotation-y={Math.PI / 2}
        transform={true}
        style={{
          userSelect: "none",
          color: "#76add3",
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 0.9,
        }}
      >
        <div>CV被控变量</div>
        <div style={{ fontSize: 7, opacity: 0.6 }}>Controlled Variable</div>
      </Html>
      <Html
        position={[2, 3.5, 0]}
        // rotation-x={-Math.PI / 2}
        rotation-y={Math.PI / 2}
        transform={true}
        style={{
          userSelect: "none",
          color: "#5bd2e4",
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 1,
        }}
      >
        <div>窑APC控制器</div>
        <div style={{ fontSize: 7, opacity: 0.6 }}>Kiln APC Controller</div>
      </Html>
    </>
  );
};

export default Index;
