import * as THREE from "three";
import Highlight from "./Highlight";

const Index = () => {
  return (
    <>
      <mesh rotation-x={Math.PI / 2}>
        <planeGeometry args={[0.5, 1.5]}></planeGeometry>
        <meshBasicMaterial
          transparent={true}
          opacity={0.1}
          color="#00FFFF"
          side={THREE.DoubleSide}
        />
      </mesh>
      <Highlight
        meshProps={{ "rotation-x": Math.PI / 2 }}
        planProps={{ args: [0.5, 1.5] }}
        color="#00FFFF"
      />
    </>
  );
};

export default Index;
