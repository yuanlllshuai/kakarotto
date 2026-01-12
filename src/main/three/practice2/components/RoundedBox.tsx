import { memo, useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { useFrame } from "@react-three/fiber";

type Props = {
  topColor?: [string, string];
  wallColor: [string, string];
  transform?: any;
  wallOffset?: number;
  borderColor?: string;
  animationBorderColor?: string;
  radius?: number;
  edgeColor?: string;
  wallOpacity?: number;
};

const Index = memo(
  ({
    topColor = ["#494848", "#3F3D3C"],
    wallColor,
    transform = {},
    wallOffset = 0,
    borderColor = "",
    animationBorderColor = "",
    radius = 0.02,
    edgeColor = "",
    wallOpacity = 1,
  }: Props) => {
    const [mesh, setMesh] = useState<THREE.Mesh>();
    const [border, setBorder] = useState<THREE.Line>();
    const [animationBorders, setAnimationBorders] = useState<THREE.Line[]>([]);
    const [edges, setEdges] = useState<THREE.LineSegments>();

    const lineRef1 = useRef<THREE.LineSegments>();
    const lineRef2 = useRef<THREE.LineSegments>();
    const yRef1 = useRef(0);
    const oRef1 = useRef(0);
    const isLine2Started = useRef(false);
    const yRef2 = useRef(0);
    const oRef2 = useRef(0);

    useEffect(() => {
      createBox();
      if (borderColor) {
        const line = createBorder(borderColor);
        setBorder(line);
      }
      if (animationBorderColor) {
        const animationBorder1 = createBorder(animationBorderColor);
        const animationBorder2 = createBorder(animationBorderColor);
        setAnimationBorders([animationBorder1, animationBorder2]);
      }
    }, []);

    const createBorder = (color: string) => {
      const width = 1;
      const height = 1;
      const smoothness = 32; // 圆角平滑度

      const shape = new THREE.Shape();
      // 绘制圆角形状
      shape.absarc(radius, radius, radius, Math.PI, 1.5 * Math.PI);
      shape.absarc(width - radius, radius, radius, 1.5 * Math.PI, 2 * Math.PI);
      shape.absarc(width - radius, height - radius, radius, 0, 0.5 * Math.PI);
      shape.absarc(radius, height - radius, radius, 0.5 * Math.PI, Math.PI);

      // 创建几何体（设置 depth: 0 即为平面）
      const geometry = new THREE.ShapeGeometry(shape, smoothness);
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({
        color,
        linewidth: 1,
        transparent: true,
        opacity: 1,
      });
      const line = new THREE.LineSegments(edges, lineMaterial);
      return line;
    };

    const createBox = () => {
      const geometry = new RoundedBoxGeometry(1, 0.5, 1, 1, radius);

      const transparentMaterial = new THREE.MeshBasicMaterial({
        color: "#FFF",
        side: THREE.BackSide,
        transparent: true,
        opacity: 0,
      });

      // const topMaterial = new THREE.MeshBasicMaterial({
      //   color: topColor,
      //   side: THREE.DoubleSide,
      //   transparent: true,
      //   opacity: 1,
      // });
      const topMaterial = new THREE.ShaderMaterial({
        uniforms: {
          center: { value: new THREE.Vector2(0, 0) }, // 渐变中心点
          innerRadius: { value: 0.5 }, // 内部颜色半径
          outerRadius: { value: 1.0 }, // 外部颜色半径
          innerColor: { value: new THREE.Color(topColor[0]) },
          outerColor: { value: new THREE.Color(topColor[1]) },
          uAlpha: { value: 1 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec2 center;
          uniform float innerRadius;
          uniform float outerRadius;
          uniform vec3 innerColor;
          uniform vec3 outerColor;
          varying vec2 vUv;
          uniform float uAlpha;

          void main() {
            // 将 UV 映射到 [-1, 1] 范围
            vec2 uv = (vUv - 0.5) * 2.0;

            // 计算到中心点的距离
            float dist = distance(uv, center);

            // 使用 smoothstep 实现平滑渐变过渡
            float t = smoothstep(innerRadius, outerRadius, dist);

            // 混合颜色
            vec3 color = mix(innerColor, outerColor, t);

            gl_FragColor = vec4(color, uAlpha);
          }
        `,
        side: THREE.DoubleSide,
        // transparent: true,
        // depthWrite: false,
      });

      const wallMaterial = new THREE.ShaderMaterial({
        uniforms: {
          innerColor: { value: new THREE.Color(wallColor[0]) },
          outerColor: { value: new THREE.Color(wallColor[1]) },
          uAlpha: { value: wallOpacity },
          uOffset: { value: wallOffset },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 innerColor;
          uniform vec3 outerColor;
          varying vec2 vUv;
          uniform float uAlpha;
          uniform float uOffset;
  
          void main() {
            vec2 uv = vUv;
            float y = uv.y - uOffset;
            vec3 color = mix(outerColor, innerColor, uv.y+uOffset);
            float alpha = uAlpha * y;
            if(uv.y < uOffset) discard;
            gl_FragColor=vec4(color, uOffset == 0.0 ? 1.0 : alpha);
          }
          `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: wallOffset === 0,
        depthTest: true,
      });

      const mesh = new THREE.Mesh(geometry, [
        wallMaterial,
        wallMaterial,
        topMaterial,
        transparentMaterial,
        wallMaterial,
        wallMaterial,
      ]);
      setMesh(mesh);

      if (edgeColor) {
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: edgeColor,
          linewidth: 1,
          depthTest: true,
          depthWrite: true,
        });
        const line = new THREE.LineSegments(edges, lineMaterial);
        setEdges(line);
      }
    };

    useFrame(() => {
      const maxPositionY = 0.75;
      const maxOpacity = 1;
      const stepY = 0.008;

      if (lineRef1.current && lineRef2.current && animationBorderColor) {
        yRef1.current += stepY;
        oRef1.current =
          maxOpacity - (yRef1.current / maxPositionY) * maxOpacity;

        lineRef1.current.position.y = yRef1.current + 0.25;
        // @ts-ignore
        lineRef1.current.material.opacity = oRef1.current;

        // 当 lineRef1 动画进行到一半时，触发 lineRef2 动画
        if (yRef1.current >= maxPositionY / 2 && !isLine2Started.current) {
          isLine2Started.current = true;
          yRef2.current = 0;
          oRef2.current = maxPositionY;
        }

        // lineRef2 动画逻辑
        if (isLine2Started.current) {
          yRef2.current += stepY;
          oRef2.current =
            maxOpacity - (yRef2.current / maxPositionY) * maxOpacity;

          lineRef2.current.position.y = yRef2.current + 0.25;
          // @ts-ignore
          lineRef2.current.material.opacity = oRef2.current;

          // 重置 lineRef2 动画
          if (yRef2.current > maxPositionY) {
            yRef2.current = 0;
            isLine2Started.current = false;
          }
        }

        // 重置 lineRef1 动画
        if (yRef1.current > maxPositionY) {
          yRef1.current = 0;
        }
      }
    });

    return (
      <object3D {...transform}>
        {mesh && <primitive object={mesh} />}
        {edges && <primitive object={edges} />}
        {border && (
          <primitive
            object={border}
            rotation-x={Math.PI / 2}
            position-x={-0.5}
            position-z={-0.5}
            position-y={0.25}
          />
        )}
        {animationBorders.map((i, index) => (
          <primitive
            ref={!index ? lineRef1 : lineRef2}
            object={i}
            key={index}
            rotation-x={Math.PI / 2}
            position-x={-0.5}
            position-z={-0.5}
            position-y={0}
          />
        ))}
      </object3D>
    );
  }
);

export default Index;
