import { useEffect, useState, useRef, memo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three';

const InstancedGridOfSquares = memo(() => {
  const instancedMeshRef = useRef<any>(null);
  const [instancedMesh, setInstancedMesh] = useState<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    const numSquaresPerRow = 200;
    const numSquaresPerColumn = 200;
    const totalSquares = numSquaresPerRow * numSquaresPerColumn;
    const geometry = new THREE.PlaneGeometry(0.06, 0.06);
    const material = new THREE.MeshBasicMaterial({
      color: 0x1E90FF,
      // vertexColors:true,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      // depthWrite:false,
      // depthTest:false
    });
  
    const instancedMesh = new THREE.InstancedMesh(geometry, material, totalSquares);
    // const colors = new Float32Array(totalSquares * 3);
    // for (let i = 0; i < totalSquares; i++) {
    //   colors[i * 3] = 0; // Red component
    //   colors[i * 3 + 1] = 0.1; // Green component
    //   colors[i * 3 + 2] = 0; // Blue component
    // }
    // geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
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
    if (instancedMeshRef.current) {
      const numSquaresPerRow = 200;
      const numSquaresPerColumn = 200;
      const totalSquares = numSquaresPerRow * numSquaresPerColumn;
      const cameraPosition = camera.position;
      const upVector = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i < totalSquares; i++) {
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        instancedMeshRef.current.getMatrixAt(i, matrix);
        position.setFromMatrixPosition(matrix);
        matrix.lookAt(position, cameraPosition, upVector);
        instancedMeshRef.current.setMatrixAt(i, matrix);
      }
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (!instancedMesh) {
    return <></>
  }

  return (
    <primitive
      object={instancedMesh}
      ref={instancedMeshRef}
    />
  ); 
});

export default InstancedGridOfSquares;