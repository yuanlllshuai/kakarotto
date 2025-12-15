import { useFrame } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const Index = () => {
  const [line, setLine] = useState<THREE.Mesh>();
  const lineRef = useRef<any>(null);

  useEffect(() => {
    createLine();
  }, []);

  const createLine = () => {
    const vertices = [
      new THREE.Vector3(0, 2, 0),
      new THREE.Vector3(0, 2, 2),
      new THREE.Vector3(2, 2, 2),
    ];
    const smoothCurve = new THREE.CatmullRomCurve3(vertices, false);
    const tubeGeometry = new THREE.TubeGeometry(smoothCurve, 2, 0.01, 8, false);

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 100;
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, 0, 100);
    const createGradient = (gradient: CanvasGradient) => {
      gradient.addColorStop(0, "rgba(160,32,240,1)");
      gradient.addColorStop(0.399999999, "rgba(160,32,240,1)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0)");
      gradient.addColorStop(0.6, "rgba(255,255,255,0)");
      gradient.addColorStop(0.7, "rgba(255,255,255,0)");
      gradient.addColorStop(0.8, "rgba(255,255,255,0)");
      gradient.addColorStop(0.9, "rgba(255,255,255,0)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
    };
    createGradient(gradient);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1, 100);
    const texture: any = new THREE.CanvasTexture(canvas);
    texture.repeat.set(0, 8);
    texture.wrapS = THREE.RepeatWrapping; // 防止拉伸
    texture.wrapT = THREE.RepeatWrapping; // 防止拉伸
    texture.rotation = Math.PI / 2;
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      emissive: "cyan",
      emissiveIntensity: 2,
    });
    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    lineRef.current = texture;
    setLine(tubeMesh);
  };
  useFrame((_state, delta) => {
    if (lineRef.current) {
      lineRef.current.offset.y -= 0.03;
    }
  });
  return (
    <>
      {line && <primitive object={line} position={[1, 4, 1]} scale-y={0.001} />}
    </>
  );
};

export default Index;
