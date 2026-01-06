import { memo, useEffect, useState } from "react";
import InstancedGridOfSquares from "./components/InstancedGridOfSquares";
import * as THREE from "three";
import RoundedBox from "./components/RoundedBox";
import Block1 from "./Block1";

const MapModel = memo(({ setMapLoaded }: any) => {
  const [floors, setFloors] = useState<THREE.Object3D[]>([]);

  useEffect(() => {
    setMapLoaded(true);
    const floor1 = createFloor("#FFF");
    const floor2 = createFloor("#FF6302");
    setFloors([floor1, floor2]);
  }, []);

  const createFloor = (borderColor: string) => {
    const width = 1;
    const height = 1;
    const radius = 0.03; // 圆角半径
    const smoothness = 32; // 圆角平滑度

    const shape = new THREE.Shape();
    // 绘制圆角形状
    shape.absarc(radius, radius, radius, Math.PI, 1.5 * Math.PI);
    shape.absarc(width - radius, radius, radius, 1.5 * Math.PI, 2 * Math.PI);
    shape.absarc(width - radius, height - radius, radius, 0, 0.5 * Math.PI);
    shape.absarc(radius, height - radius, radius, 0.5 * Math.PI, Math.PI);

    // 创建几何体（设置 depth: 0 即为平面）
    const geometry = new THREE.ShapeGeometry(shape, smoothness);
    const material = new THREE.MeshBasicMaterial({
      color: "#434343",
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: borderColor,
      linewidth: 1,
    });
    const line = new THREE.LineSegments(edges, lineMaterial);
    const object3D = new THREE.Object3D();
    object3D.add(mesh, line);
    return object3D;
  };

  return (
    <>
      <RoundedBox
        transform={{
          position: [0, 2, 0],
          scale: 8,
        }}
        wallColor={["#434343", "rgba(0,0,0,0)"]}
        wallOffset={0.3}
      />
      {floors.map((i, index) => (
        <primitive
          object={i}
          key={index}
          scale={8}
          rotation-x={Math.PI / 2}
          position={[-4, 4.08 + index * 0.06, -4]}
        />
      ))}
      <object3D>
        <InstancedGridOfSquares />
      </object3D>
      <Block1 />
      <RoundedBox
        transform={{
          position: [-1.8, 4.3, -1.3],
          scale: [3.3, 0.3, 3],
        }}
        wallColor={["#606566", "#8B9394"]}
        animationBorderColor="#FF6302"
        borderColor="#FFF"
      />
      <RoundedBox
        transform={{
          position: [1.8, 4.3, -1.3],
          scale: [3.3, 0.3, 3],
        }}
        wallColor={["#606566", "#8B9394"]}
        animationBorderColor="#FF6302"
        borderColor="#FFF"
      />
    </>
  );
});

export default MapModel;
