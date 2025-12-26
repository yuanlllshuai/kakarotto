import GradientBox from "./component/GradientBox";
import { Text3D } from "@react-three/drei";
import font from "@/fonts/SimHei_Regular.json";

const Index = () => {
  return (
    <>
      <object3D
        position={[0, 2, 2 * 1.305]}
        scale-x={0.3}
        rotation-y={Math.PI / 2}
      >
        <GradientBox
          colors={["#09a6ae", "#0ba1a9"]}
          hasHighlight={true}
          opacity={0.2}
          wallOpacity={0.2}
          highlightProps={{
            meshProps: {
              "rotation-x": Math.PI / 2,
              "position-y": 2,
            },
            planProps: { args: [4, 4] },
            color: "#0ba1a9",
            intensity: 1,
          }}
          borderColor={[124, 246, 254, 0.02]}
          hasDashedLine={true}
          hideBorderIndexes={[2, 5, 7]}
        />
      </object3D>
      <Text3D
        rotation-x={-Math.PI / 2}
        position={[-0.75, 4, 2.8]}
        height={0.03}
        size={0.5}
        font={font as any}
      >
        AI
        <meshPhongMaterial color="#7bfcfe" transparent={true} opacity={1} />
      </Text3D>
      <Text3D
        rotation-x={-Math.PI / 2}
        position={[-0.15, 4, 2.75]}
        height={0.03}
        size={0.4}
        font={font as any}
      >
        模块
        <meshPhongMaterial color="#7bfcfe" transparent={true} opacity={1} />
      </Text3D>
    </>
  );
};

export default Index;
