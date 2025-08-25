import { useEffect, useState, useRef, memo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Grid } from "@react-three/drei";
import { crossVertices } from "./const";

const vertexShader = `
  varying float vDistance;
  void main() {
    vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vDistance = length(worldPosition.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying float vDistance;
  void main() {
    float opacity = 1.0 - smoothstep(0.0, 80.0, vDistance);
    gl_FragColor = vec4(0.118, 0.565, 1.0, opacity*0.3);
  }
`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  side: THREE.DoubleSide,
});

const numSquaresPerRow = 300;
const numSquaresPerColumn = 300;
const crossSquaresPerRow = 100;

// 将重复使用的变量提取到组件外部
const upVector = new THREE.Vector3(0, 1, 0);
const tempMatrix = new THREE.Matrix4();
const tempPosition = new THREE.Vector3();

const gridConfig = {
  // cellSize: 0,
  // cellThickness: 1,
  // cellColor: "#6f6f6f",
  sectionSize: 5,
  sectionThickness: 0.8,
  sectionColor: "rgb(2, 124, 165)",
  fadeDistance: 80,
  fadeStrength: 2,
  followCamera: true,
  infiniteGrid: true,
  transparent: true,
  opacity: 0.5,
};

const crossGeometry = new THREE.BufferGeometry();

crossGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(crossVertices, 3)
);

const InstancedGridOfSquares = memo(({ begin }: { begin: boolean }) => {
  const instancedMeshRef = useRef<any>(null);
  const [instancedMesh, setInstancedMesh] = useState<any>(null);
  const { camera } = useThree();
  const gridRef = useRef<any>(null);

  const [crossInstancedMesh, setCrossInstancedMesh] = useState<any>(null);

  useEffect(() => {
    const totalSquares = numSquaresPerRow * numSquaresPerColumn;
    const geometry = new THREE.PlaneGeometry(0.06, 0.06);

    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      totalSquares
    );

    const crossMesh = new THREE.InstancedMesh(
      crossGeometry,
      material,
      crossSquaresPerRow * crossSquaresPerRow
    );

    for (let i = 0; i < numSquaresPerRow; i++) {
      for (let j = 0; j < numSquaresPerColumn; j++) {
        const x = (i - (numSquaresPerRow - 1) / 2) * 0.5;
        const z = (j - (numSquaresPerColumn - 1) / 2) * 0.5;
        const position = new THREE.Vector3(x, 0, z);
        const matrix = new THREE.Matrix4();
        matrix.setPosition(position);
        instancedMesh.setMatrixAt(i * numSquaresPerColumn + j, matrix);
      }
    }
    for (let i = 0; i < crossSquaresPerRow; i++) {
      for (let j = 0; j < crossSquaresPerRow; j++) {
        const x = (i - (crossSquaresPerRow - 1) / 2) * 5 + 2.5;
        const z = (j - (crossSquaresPerRow - 1) / 2) * 5 + 2.5;
        const position = new THREE.Vector3(x, 0, z);
        const matrix = new THREE.Matrix4();
        matrix.setPosition(position);
        crossMesh.setMatrixAt(i * crossSquaresPerRow + j, matrix);
      }
    }
    instancedMesh.position.y = -0.4;
    setInstancedMesh(instancedMesh);
    setCrossInstancedMesh(crossMesh);
  }, []);

  useFrame(() => {
    if (instancedMeshRef.current && begin) {
      const totalSquares = numSquaresPerRow * numSquaresPerColumn;
      const cameraPosition = camera.position;

      for (let i = 0; i < totalSquares; i++) {
        instancedMeshRef.current.getMatrixAt(i, tempMatrix);
        tempPosition.setFromMatrixPosition(tempMatrix);

        // 使用quaternion直接设置旋转
        tempMatrix.lookAt(tempPosition, cameraPosition, upVector);
        instancedMeshRef.current.setMatrixAt(i, tempMatrix);
      }
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      // gridRef.current.material.alphaHash = true;
      // gridRef.current.material.opacity = 0;
    }
  });

  if (!instancedMesh) {
    return <></>;
  }

  return (
    <>
      <primitive object={instancedMesh} ref={instancedMeshRef} />
      {crossInstancedMesh && (
        <primitive
          object={crossInstancedMesh}
          rotation-y={-2}
          position={[0, -0.5, 0]}
        />
      )}
      <Grid
        position={[0, -0.5, 0]}
        rotation-y={-2}
        args={[5, 5]}
        {...gridConfig}
        ref={gridRef}
        side={THREE.DoubleSide}
        // material={
        //   new THREE.MeshStandardMaterial({
        //     side: THREE.DoubleSide,
        //     transparent: true,
        //     color: "rgb(2, 124, 165)",
        //     opacity: 0.5,
        //   })
        // }
      />
    </>
  );
});

export default InstancedGridOfSquares;
