import { useEffect, useState } from "react";
import * as THREE from "three";
const Index = () => {
  const [object, setObject] = useState<THREE.Object3D>();

  useEffect(() => {
    const center = createCenter();
    center.position.z = 0.2;
    const floor1 = createFloor1();
    const floor2 = createFloor2();
    floor2[0].position.z = 0.8;
    floor2[1].position.z = 0.8;
    const floor3 = createFloor2();
    floor3[0].position.z = 0.4;
    floor3[1].position.z = 0.4;

    const object3D = new THREE.Object3D();
    object3D.position.z = -0.5;
    object3D.add(floor1, ...floor2, ...floor3, center);
    setObject(object3D);
  }, []);

  const createGeometry = ({
    points,
    color,
    borderColor,
    opacity = 1,
    depth = 0.2,
    isBloom = false,
  }: {
    points: [number, number][];
    color: string;
    borderColor: string;
    opacity?: number;
    depth?: number;
    isBloom?: boolean;
  }) => {
    const shape = new THREE.Shape();
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      if (i === 0) {
        shape.moveTo(x, y);
      }
      shape.lineTo(x, y);
    }
    const extrudeSettings = {
      depth,
      bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true,
      ...(isBloom ? { emissive: color, emissiveIntensity: 10 } : {}),
    });
    const mesh = new THREE.Mesh(geometry, material);

    // 边框几何体
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: borderColor,
      linewidth: 1,
      depthTest: false,
      depthWrite: false,
    });
    const line = new THREE.LineSegments(edges, lineMaterial);
    const object3D = new THREE.Object3D();
    object3D.add(mesh, line);
    return object3D;
  };

  const createCenter = () => {
    const points: [number, number][] = [
      [-0.1, -0.1],
      [-0.1, 0.1],
      [0.1, 0.1],
      [0.1, -0.1],
      [-0.1, -0.1],
    ];
    const object = createGeometry({
      points,
      color: "#FFF",
      borderColor: "#FFF",
      depth: 0.8,
      isBloom: true,
      opacity: 1,
    });
    return object;
  };

  const createFloor1 = () => {
    const points: [number, number][] = [
      [-0.5, -0.5],
      [-0.5, 0.5],
      [0.5, 0.5],
      [0.5, -0.5],
      [-0.5, -0.5],
    ];
    const object = createGeometry({
      points,
      color: "#00AEFF",
      borderColor: "rgba(0, 113, 245, 0.80)",
    });
    return object;
  };

  const createFloor2 = () => {
    const points1: [number, number][] = [
      [-0.5, -0.5],
      [-0.5, 0.5],
      [-0.1, 0.5],
      [-0.1, 0.3],
      [-0.3, 0.3],
      [-0.3, -0.3],
      [-0.1, -0.3],
      [-0.1, -0.5],
      [-0.5, -0.5],
    ];
    const object1 = createGeometry({
      points: points1,
      color: "#0030FF",
      borderColor: "#0FA7FF",
    });
    const points2: [number, number][] = [
      [0.5, -0.5],
      [0.5, 0.5],
      [0.1, 0.5],
      [0.1, 0.3],
      [0.3, 0.3],
      [0.3, -0.3],
      [0.1, -0.3],
      [0.1, -0.5],
      [0.5, -0.5],
    ];
    const object2 = createGeometry({
      points: points2,
      color: "#FFF",
      borderColor: "#FFF",
      opacity: 0.4,
    });
    return [object1, object2];
  };

  return (
    <object3D scale={0.3} rotation-x={-Math.PI / 2}>
      {/* <mesh>
        <boxGeometry args={[1, 1, 1]}></boxGeometry>
        <meshBasicMaterial
          transparent={true}
          depthTest={false}
          depthWrite={false}
          opacity={1}
          color="#00ff00"
          wireframe={true}
        ></meshBasicMaterial>
      </mesh> */}
      {object && <primitive object={object} />}
    </object3D>
  );
};

export default Index;
