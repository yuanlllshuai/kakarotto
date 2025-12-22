import GradientBox from "./component/GradientBox";
import Label from "./component/Label";

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
      <Label
        position={[-3.5, 3.6, 0]}
        content={["MV操作变量", "Manipulate Variable"]}
      />
    </>
  );
};

export default Index;
