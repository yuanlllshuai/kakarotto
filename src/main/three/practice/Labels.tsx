import { Text3D } from "@react-three/drei";
import font from "@/fonts/SimHei_Regular.json";
import Label from "./component/Label";

const Index = () => {
  return (
    <>
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
      <Label
        position={[0, 3.6, -3.5]}
        content={["DV干扰变量", "Disturbance Variable"]}
        rotationY={0}
      />
      <Label
        position={[5.5, 3.6, 0]}
        content={["CV被控变量", "Controlled Variable"]}
      />
      <Label
        position={[2, 3.6, 0]}
        content={["窑APC控制器", "Kiln APC Controller"]}
        color="#5bd2e4"
      />
    </>
  );
};

export default Index;
