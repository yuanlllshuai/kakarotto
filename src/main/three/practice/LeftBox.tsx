import GradientBox from "./component/GradientBox";
import { Text3D } from "@react-three/drei";
import font from "@/fonts/Inter_Bold.json";

const Index = () => {
  return (
    <>
      <object3D position={[-4.5, 2, 0]} scale-x={0.5}>
        <GradientBox
          colors={["#083b64", "#1c5586"]}
          hasDashedLine={true}
          borderColor={[175, 211, 248, 0.01]}
        />
      </object3D>
      <mesh position={[-4.5, 4.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          transparent={true}
          emissiveIntensity={0.1}
          toneMapped={false}
          color="rgb(255,0,0)"
          emissive={[255, 0, 0]}
        />
      </mesh>
      {/* MV操作变量 */}
      <Text3D
        rotation-y={Math.PI / 2}
        position={[-3.5, 3.5, 1.3]}
        height={0.001}
        size={0.2}
        font={font as any}
      >
        Manipulate Variable
        <meshBasicMaterial color="#76add3" transparent={true} opacity={0.8} />
      </Text3D>
    </>
  );
};

export default Index;
