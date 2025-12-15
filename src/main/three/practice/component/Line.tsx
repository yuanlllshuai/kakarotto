import { useFrame } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  points: [number, number, number][];
  width?: number;
  color?: string;
  segments?: number;
};

const Index = ({
  points,
  color = "#FFF",
  width = 0.005,
  segments = 40,
}: Props) => {
  const [line, setLine] = useState<THREE.Mesh>();
  const lineRef = useRef<any>(null);

  useEffect(() => {
    createLine();
  }, []);

  const createPath = (points: [number, number, number][]) => {
    let vertices: THREE.Vector3[] = [];
    points.forEach((p) => {
      vertices = [
        ...vertices,
        new THREE.Vector3(...p),
        new THREE.Vector3(p[0] + 0.00001, p[1], p[2]),
      ];
    });
    return vertices;
  };

  const getPointsLength = (points: [number, number, number][]) => {
    let length = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = new THREE.Vector3(...points[i]);
      const p2 = new THREE.Vector3(...points[i + 1]);
      length += p1.distanceTo(p2);
    }
    return length;
  };

  const createLine = () => {
    const lineLength = getPointsLength(points);
    const vertices = createPath(points);
    const smoothCurve = new THREE.CatmullRomCurve3(vertices, false);
    const tubeGeometry = new THREE.TubeGeometry(
      smoothCurve,
      1000,
      width,
      10,
      false
    );

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 100;
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, 0, 100);
    const createGradient = (gradient: CanvasGradient) => {
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.399999999, color);
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
    const repeatY = (lineLength * segments) / 4; // 根据线的长度设置重复次数
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
      emissive: color,
      emissiveIntensity: 2,
    });
    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    lineRef.current = texture;
    setLine(tubeMesh);
  };
  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.offset.y -= 0.03;
    }
  });
  return <>{line && <primitive object={line} />}</>;
};

export default Index;
