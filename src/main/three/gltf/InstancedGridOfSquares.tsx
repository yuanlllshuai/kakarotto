import { useEffect, useState, useRef, memo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

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

const numSquaresPerRow = 400;
const numSquaresPerColumn = 400;

// 将重复使用的变量提取到组件外部
const upVector = new THREE.Vector3(0, 1, 0);
const tempMatrix = new THREE.Matrix4();
const tempPosition = new THREE.Vector3();

const InstancedGridOfSquares = memo(({ begin }: { begin: boolean }) => {
  const instancedMeshRef = useRef<any>(null);
  const [instancedMesh, setInstancedMesh] = useState<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    const totalSquares = numSquaresPerRow * numSquaresPerColumn;
    const geometry = new THREE.PlaneGeometry(0.06, 0.06);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      totalSquares
    );

    for (let i = 0; i < numSquaresPerRow; i++) {
      for (let j = 0; j < numSquaresPerColumn; j++) {
        const x = (i - (numSquaresPerRow - 1) / 2) * 0.4;
        const z = (j - (numSquaresPerColumn - 1) / 2) * 0.4;
        const position = new THREE.Vector3(x, 0, z);
        const matrix = new THREE.Matrix4();
        matrix.setPosition(position);
        instancedMesh.setMatrixAt(i * numSquaresPerColumn + j, matrix);
      }
    }
    instancedMesh.position.y = -0.4;
    setInstancedMesh(instancedMesh);
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
    }
  });

  if (!instancedMesh) {
    return <></>;
  }

  return <primitive object={instancedMesh} ref={instancedMeshRef} />;
});

export default InstancedGridOfSquares;
