import * as THREE from "three";

const Index = () => {
  return (
    <mesh position={[0, 0, 0]} rotation-x={Math.PI / 2}>
      <ringGeometry args={[4, 5, 100]} />
      <meshBasicMaterial
        transparent={true}
        opacity={1}
        color="#00FFFF"
        side={THREE.DoubleSide}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

export default Index;
