import { useEffect, useState } from "react";
import RoundedBox from "./RoundedBox";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const Index = () => {
  const [floor, setFloor] = useState<THREE.Mesh>();

  useEffect(() => {
    createBox();
  }, []);

  const createBox = () => {
    const width = 1;
    const height = 1;
    const radius = 0.2; // 圆角半径

    const shape = new THREE.Shape();
    // 绘制圆角形状
    shape.absarc(radius, radius, radius, Math.PI, 1.5 * Math.PI);
    shape.absarc(width - radius, radius, radius, 1.5 * Math.PI, 2 * Math.PI);
    shape.absarc(width - radius, height - radius, radius, 0, 0.5 * Math.PI);
    shape.absarc(radius, height - radius, radius, 0.5 * Math.PI, Math.PI);

    const extrudeSettings = {
      depth: 0.015,
      bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    const topMaterial = new THREE.ShaderMaterial({
      transparent: true, // 必须开启透明，否则圆角外的部分会显示黑色
      side: THREE.DoubleSide,
      uniforms: {
        uSize: { value: new THREE.Vector2(width, height) }, // 平面尺寸
        uRadius: { value: radius }, // 圆角半径
        uInnerColor: { value: new THREE.Color("#484746") }, // 中心颜色 (红色)
        uOuterColor: { value: new THREE.Color("#211F1E") }, // 边缘颜色 (蓝色)
      },
      vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
      fragmentShader: `
    varying vec2 vUv;
    uniform vec2 uSize;
    uniform float uRadius;
    uniform vec3 uInnerColor;
    uniform vec3 uOuterColor;

    // 圆角矩形距离函数 (SDF)
    float roundedRectSDF(vec2 p, vec2 b, float r) {
      vec2 d = abs(p) - b + vec2(r);
      return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
    }

    void main() {
      // 1. 将 UV 映射到本地坐标系中心 (-width/2 到 width/2)
      vec2 p = (vUv - 0.5) * uSize;
      
      // 2. 计算圆角遮罩
      float distance = roundedRectSDF(p, uSize * 0.5, uRadius);
      
      // 使用 fwidth 实现抗锯齿边缘
      float alpha = 1.0 - smoothstep(-0.005, 0.005, distance);

      // 3. 计算径向渐变 (根据距离中心的长度)
      // 这里的 0.707 是由于单位矩形对角线长度的一半
      float distToCenter = length(vUv - 0.5) * 1.414; 
      vec3 color = mix(uInnerColor, uOuterColor, distToCenter);

      gl_FragColor = vec4(color, alpha);

      // 如果透明度太低直接丢弃片段，有助于性能和阴影
      if (gl_FragColor.a < 0.01) discard;
    }
  `,
    });

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: "#B2B1B0",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1,
    });

    const mesh = new THREE.Mesh(geometry, [topMaterial, wallMaterial]);
    setFloor(mesh);
  };
  return (
    <>
      {floor && (
        <object3D rotation-x={Math.PI / 2} scale={[0.6, 0.6, 1]}>
          <primitive object={floor} />
        </object3D>
      )}
      <mesh position={[0.19, 0.01, 0.19]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 32]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      <RoundedBox
        transform={{
          position: [0, 0.02, 0],
          scale: [0.3, 0.08, 0.3],
        }}
        wallColor={["#080605", "#464949"]}
        radius={0}
        topColor={["#696867", "#696867"]}
        edgeColor="#FF6302"
      />
      <RoundedBox
        transform={{
          position: [0, 0.165, 0],
          scale: [0.3, 0.5, 0.3],
          "rotation-x": Math.PI,
        }}
        wallColor={["#FFF", "#FFF"]}
        radius={0}
        topColor={["#696867", "#696867"]}
        wallOffset={0.1}
        wallOpacity={0.15}
      />
      <RoundedBox
        transform={{
          position: [0, 0.065, 0],
          scale: [0.29, 0.0001, 0.29],
        }}
        wallColor={["#080605", "#464949"]}
        radius={0}
        topColor={["#30251f", "#30251f"]}
        edgeColor="#969594"
      />
      <RoundedBox
        transform={{
          position: [0, 0.1, 0],
          scale: [0.29, 0.0001, 0.29],
        }}
        wallColor={["#080605", "#464949"]}
        radius={0}
        topColor={["#30251f", "#30251f"]}
        edgeColor="#969594"
      />
    </>
  );
};

export default Index;
