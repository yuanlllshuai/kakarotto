import { useEffect, useState, useRef } from "react";
import RoundedBox from "./components/RoundedBox";
import * as THREE from "three";
import { hexToRgb } from "@/utils/index";
import { useFrame } from "@react-three/fiber";
import { RoundedBox as Ball } from "@react-three/drei";
import Model1 from "./components/Model1";

const points: [number, number, number][] = [
  [-2.4, 5, 1.4],
  [-0.8, 5, 1.4],
  [0.8, 5, 1.4],
  [2.4, 5, 1.4],
  [-2.4, 5, 2.6],
  [-0.8, 5, 2.6],
  [0.8, 5, 2.6],
  [2.4, 5, 2.6],

  [-2.8, 5, -2],
  [-2.8, 5, -1],
  [-1.8, 5, -2],
  [-1.8, 5, -1],
  [-0.8, 5, -2],
  [-0.8, 5, -1],

  [2.8, 5, -2],
  [2.8, 5, -1],
  [1.8, 5, -2],
  [1.8, 5, -1],
  [0.8, 5, -2],
  [0.8, 5, -1],
];

const Index = () => {
  const [lines, setLines] = useState<THREE.Mesh[]>([]);
  const [animationLines, setAnimationLines] = useState<THREE.Mesh[]>([]);
  const lineRef = useRef<any>(null);

  useEffect(() => {
    const lineArr = points.map((i) => createLine(i, false));
    setLines(lineArr);
    const animationLineArr = points.map((i) => createLine(i, true));
    setAnimationLines(animationLineArr);
    console.log(lineRef);
  }, []);

  const createLine = (points: [number, number, number], isBloom: boolean) => {
    const vertices: THREE.Vector3[] = [
      new THREE.Vector3(...points),
      new THREE.Vector3(0, 6.8, 0.4),
    ];
    const smoothCurve = new THREE.CatmullRomCurve3(vertices, false);
    const tubeGeometry = new THREE.TubeGeometry(
      smoothCurve,
      1000,
      0.008,
      10,
      false
    );

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 100;
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, 0, 100);
    const createGradient = (gradient: CanvasGradient) => {
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      if (isBloom) {
        gradient.addColorStop(0.5, "rgba(255,255,255,0)");
        gradient.addColorStop(0.6, hexToRgb("#FF6302", 0.02));
        gradient.addColorStop(0.7, hexToRgb("#FF6302", 0.04));
        gradient.addColorStop(0.8, hexToRgb("#FF6302", 0.08));
        gradient.addColorStop(0.9, hexToRgb("#FF6302", 0.15));
        gradient.addColorStop(0.95, hexToRgb("#FF6302", 0.2));
        gradient.addColorStop(1, "rgba(255,255,255,0)");
      } else {
        gradient.addColorStop(0.5, hexToRgb("#FF6302", 0.1));
        gradient.addColorStop(1, hexToRgb("#FF6302", 0.15));
      }
    };
    createGradient(gradient);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1, 100);
    const texture: any = new THREE.CanvasTexture(canvas);
    const repeatY = 1; // 根据线的长度设置重复次数
    texture.repeat.set(0, repeatY);
    texture.wrapS = THREE.RepeatWrapping; // 防止拉伸
    texture.wrapT = THREE.RepeatWrapping; // 防止拉伸
    texture.rotation = Math.PI / 2;
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      emissive: isBloom ? "#fda36b" : "#FF6302",
      emissiveIntensity: isBloom ? 10 : 0.5,
    });
    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    return tubeMesh;
  };

  useFrame(() => {
    if (lineRef.current) {
      // lineRef.current.offset.y += 0.03;
      lineRef.current.children.forEach((i: any) => {
        i.material.map.offset.y += 0.01;
      });
    }
  });

  return (
    <>
      <RoundedBox
        transform={{
          position: [0, 4.3, 2],
          scale: [7, 0.3, 3],
        }}
        wallColor={["#606566", "#8B9394"]}
        animationBorderColor="#FF6302"
        borderColor="#FFF"
      />
      {points.map((i) => (
        <object3D position={[i[0], 4.38, i[2]]} key={i.join(",")} scale={1.2}>
          <Model1 />
        </object3D>
      ))}
      {lines.map((i, index) => (
        <primitive object={i} key={index} />
      ))}
      <object3D ref={lineRef}>
        {animationLines.map((i, index) => (
          <primitive object={i} key={index} />
        ))}
      </object3D>
      <Ball
        position={[0, 6.85, 0.4]}
        args={[1, 1, 1]} // Width, height, depth. Default is [1, 1, 1]
        radius={0.5} // Radius of the rounded corners. Default is 0.05
        steps={1} // Extrusion steps. Default is 1
        smoothness={4} // The number of curve segments. Default is 4
        bevelSegments={4} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
        creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
        scale={0.1}
      >
        <meshPhongMaterial
          color="#FF6302"
          emissive="#FF6302"
          emissiveIntensity={2}
        />
      </Ball>
    </>
  );
};

export default Index;
