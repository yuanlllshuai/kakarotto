import { useEffect, useRef, memo, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Grid } from "@react-three/drei";
import { crossVertices } from "./const";

const gridConfig = {
  cellSize: 0,
  cellThickness: 0,
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

const billboardVertexShader = `
  varying float vDistance;
  void main() {
    // 1. 获取实例在世界空间的位置
    vec4 instanceWorldPosition = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    
    // 2. 计算距离
    vDistance = length(instanceWorldPosition.xyz - cameraPosition);

    // 3. 兼容性广告牌逻辑
    vec4 mvPosition = viewMatrix * instanceWorldPosition;
    
    // 关键改动：使用 position.xyz 而不仅仅是 xy
    // 如果你的十字架是在 xy 平面定义的，这会起作用
    // 如果十字架有 z 轴深度，它也会被平铺到视角平面上
    mvPosition.xyz += vec3(position.xy, 0.0); 

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vDistance;
  void main() {
    // 根据距离动态计算透明度
    float opacity = 1.0 - smoothstep(0.0, 80.0, vDistance);
    gl_FragColor = vec4(0.118, 0.565, 1.0, opacity * 0.3);
  }
`;

const numSquaresPerRow = 300;
const numSquaresPerColumn = 300;
const crossSquaresPerRow = 100;

const InstancedGridOfSquares = memo(() => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const crossInstancedMeshRef = useRef<THREE.InstancedMesh>(null);

  // 使用 useMemo 确保材质和几何体在重渲染时不被重新创建
  const customMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: billboardVertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false, // 粒子效果通常建议关闭深度写入，避免透明层级闪烁
    });
  }, []);

  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(0.06, 0.06), []);
  const crossGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(crossVertices, 3));
    return geo;
  }, []);

  useEffect(() => {
    if (!instancedMeshRef.current || !crossInstancedMeshRef.current) return;

    const matrix = new THREE.Matrix4();

    // 1. 初始化小方块矩阵 (90,000个)
    for (let i = 0; i < numSquaresPerRow; i++) {
      for (let j = 0; j < numSquaresPerColumn; j++) {
        const x = (i - (numSquaresPerRow - 1) / 2) * 0.5;
        const z = (j - (numSquaresPerColumn - 1) / 2) * 0.5;
        matrix.setPosition(x, 0, z);
        instancedMeshRef.current.setMatrixAt(
          i * numSquaresPerColumn + j,
          matrix,
        );
      }
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;

    // 2. 初始化十字架矩阵
    for (let i = 0; i < crossSquaresPerRow; i++) {
      for (let j = 0; j < crossSquaresPerRow; j++) {
        const x = (i - (crossSquaresPerRow - 1) / 2) * 5 + 2.5;
        const z = (j - (crossSquaresPerRow - 1) / 2) * 5 + 2.5;
        matrix.setPosition(x, 0, z);
        crossInstancedMeshRef.current.setMatrixAt(
          i * crossSquaresPerRow + j,
          matrix,
        );
      }
    }
    crossInstancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  // 注意：现在的 useFrame 里一行逻辑都不需要写！
  // GPU 已经在每一帧自动完成了朝向相机的计算
  useFrame(() => {
    // 如果你以后想让粒子动起来（比如上下飘），只需在此处修改位置
    // 但面向相机的事情已经由 Shader 搞定了
  });

  return (
    <>
      {/* 小方块粒子 */}
      <instancedMesh
        ref={instancedMeshRef}
        args={[
          planeGeometry,
          customMaterial,
          numSquaresPerRow * numSquaresPerColumn,
        ]}
        position={[0, -0.4, 0]}
      />

      {/* 十字架粒子 */}
      <instancedMesh
        ref={crossInstancedMeshRef}
        args={[
          crossGeometry,
          customMaterial,
          crossSquaresPerRow * crossSquaresPerRow,
        ]}
        position={[0, -0.5, 0]}
      />

      {/* 背景网格 */}
      <Grid
        position={[0, -0.51, 0]}
        // rotation-y={-2}
        args={[5, 5]}
        {...gridConfig}
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
