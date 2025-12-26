import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import GradientBox from "./component/GradientBox";
import Label from "./component/Label";
import * as THREE from "three";
import CustomBox from "./component/CustomBox";

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
      <object3D position={[0, 2, -4.5]} scale-x={0.5} rotation-y={Math.PI / 2}>
        <GradientBox
          colors={["#083b64", "#1c5586"]}
          hasDashedLine={true}
          borderColor={[175, 211, 248, 0.01]}
        />
      </object3D>
      <Label
        position={[0, 3.6, -3.5]}
        content={["DV干扰变量", "Disturbance Variable"]}
        rotationY={0}
      />
      <object3D ref={boxRef} position={[0, 4.5, -4.5]} rotation-y={Math.PI / 2}>
        {[-1.2, -0.4, 0.4, 1.2].map((i) => (
          <object3D key={`${i}`} position={[0, 0, i]}>
            <CustomBox />
          </object3D>
        ))}
      </object3D>
    </>
  );
};

export default Index;
