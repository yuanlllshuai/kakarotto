import { useFrame } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  points: [number, number, number][];
  width?: number;
  color?: string;
  segments?: number;
  direction?: 1 | -1;
  hasArrow?: boolean;
};

const Index = ({
  points,
  color = "#FFF",
  width = 0.005,
  segments = 40,
  direction = 1,
  hasArrow = true,
}: Props) => {
  const [line, setLine] = useState<THREE.Mesh>();
  const [arrow, setArrow] = useState<THREE.Mesh>();
  const lineRef = useRef<any>(null);

  useEffect(() => {
    createLine();
    createArrow();
  }, [points]);

  const createArrow = () => {
    if (!hasArrow) {
      return;
    }
    const arrowVertices = new Float32Array([
      0,
      0,
      0,
      0.5,
      0,
      0,
      0,
      0,
      -Math.sqrt(3) / 2,
      0,
      0,
      -Math.sqrt(3) / 2,
      -0.5,
      0,
      0,
      0,
      0,
      0,
    ]);
    const arrowGeometry = new THREE.BufferGeometry();
    arrowGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(arrowVertices, 3)
    );
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      emissive: color,
      emissiveIntensity: 2,
    });
    const mesh = new THREE.Mesh(arrowGeometry, material);
    setArrow(mesh);
  };

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
  const getRotationY = () => {
    if (points.length < 2) return 0;
    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];
    const dx = p1[0] - p2[0];
    const dy = p1[2] - p2[2];
    return Math.atan2(dx, dy);
  };
  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.offset.y += 0.03 * direction;
    }
  });
  return (
    <>
      {line && <primitive object={line} />}
      {arrow && (
        <primitive
          object={arrow}
          position={points[points.length - 1]}
          scale={0.1}
          rotation-y={getRotationY()}
        />
      )}
    </>
  );
};

export default Index;
