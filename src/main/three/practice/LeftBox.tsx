import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import GradientBox from "./component/GradientBox";
import Label from "./component/Label";
import * as THREE from "three";

const Index = () => {
  const boxRef = useRef<any>(null);
  const xRef = useRef<[number, number, number, number]>([0, 0, 0, 0]);

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.children.forEach((mesh: THREE.Mesh, i: number) => {
        xRef.current[0] += 0.01;
        if (xRef.current[0] > 0.5) {
          xRef.current[1] += 0.01;
        }
        if (xRef.current[0] > 1) {
          xRef.current[2] += 0.01;
        }
        if (xRef.current[0] > 1.5) {
          xRef.current[3] += 0.01;
        }
        mesh.position.y = Math.sin(xRef.current[i]) * 0.15;
      });
    }
  });
  return (
    <>
      <object3D position={[-4.5, 2, 0]} scale-x={0.5}>
        <GradientBox
          colors={["#083b64", "#1c5586"]}
          hasDashedLine={true}
          borderColor={[175, 211, 248, 0.01]}
        />
      </object3D>
      <object3D ref={boxRef} position={[-4.5, 4.5, 0]}>
        {[-1.2, -0.4, 0.4, 1.2].map((i) => (
          <mesh key={`${i}`} position={[0, 0, i]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial
              transparent={true}
              emissiveIntensity={0.1}
              toneMapped={false}
              color="rgb(15, 94, 255)"
              emissive={[15, 94, 255]}
            />
          </mesh>
        ))}
      </object3D>
      <Label
        position={[-3.5, 3.6, 0]}
        content={["MV操作变量", "Manipulate Variable"]}
      />
    </>
  );
};

export default Index;
