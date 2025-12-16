import * as THREE from "three";

type Props = {
  position?: [number, number, number];
  scale?: number;
};

const Index = ({ position = [0, 0, 0], scale = 0.015 }: Props) => {
  return (
    <mesh position={position} rotation-x={Math.PI / 2} scale={scale}>
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
