import { useRef, memo } from "react";
import * as THREE from "three";
import { Grid } from "@react-three/drei";
import { crossVertices } from "../../gltf/const";

const color = "#FF8D25";

const gridConfig = {
  cellSize: 0,
  cellThickness: 0,
  // cellColor: "#6f6f6f",
  sectionSize: 1,
  sectionThickness: 0.8,
  sectionColor: color,
  fadeDistance: 40,
  fadeStrength: 2,
  followCamera: true,
  infiniteGrid: true,
  transparent: true,
  opacity: 0.1,
};

const crossGeometry = new THREE.BufferGeometry();

crossGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(crossVertices, 3)
);

const InstancedGridOfSquares = memo(() => {
  const gridRef = useRef<any>(null);

  return (
    <>
      <Grid
        position={[0, 0, 0]}
        // rotation-y={-2}
        args={[5, 5]}
        {...gridConfig}
        ref={gridRef}
        side={THREE.DoubleSide}
      />
    </>
  );
});

export default InstancedGridOfSquares;
