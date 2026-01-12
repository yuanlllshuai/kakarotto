import { useEffect, useState } from "react";
import RoundedBox from "./RoundedBox";
import * as THREE from "three";
import { hexToRgb } from "@/utils/index";
import Label from "../../practice/component/Label";

const statusColors = ["yellow", "green", "red"];

const Index = ({ index }: { index: number }) => {
  const [floor, setFloor] = useState<THREE.Mesh>();
  const [tubes, setTubes] = useState<THREE.Mesh[]>([]);
  const [object, setObject] = useState<THREE.Object3D>();

  useEffect(() => {
    createBox();
    const tube1 = createTube();
    const tube2 = createTube();
    const tube3 = createTube();
    setTubes([tube1, tube2, tube3]);
    createMesh();
  }, []);

  const createShape1 = () => {
    const width = 0.2;
    const height = 0.06;
    const radius = 0.02; // 圆角半径
    const shape = new THREE.Shape();
    shape.absarc(radius, radius, radius, Math.PI, 1.5 * Math.PI);
    shape.absarc(width - radius, radius, radius, 1.5 * Math.PI, 2 * Math.PI);
    shape.lineTo(width, height);
    shape.lineTo(0, height);
    return shape;
  };

  const createShape2 = () => {
    const width = 0.2;
    const height = 0.16;
    const radius = 0.02; // 圆角半径
    const shape = new THREE.Shape();
    shape.absarc(radius, radius, radius, Math.PI, 1.5 * Math.PI);
    shape.absarc(width - radius, radius, radius, 1.5 * Math.PI, 2 * Math.PI);
    shape.lineTo(width, height);
    shape.lineTo(0, height);
    return shape;
  };

  const createCylinder = () => {
    const radius = 0.008; // 圆角半径
    const shape = new THREE.Shape();
    shape.absarc(radius, radius, radius, 0, Math.PI);
    shape.absarc(radius, radius, radius, Math.PI, 2 * Math.PI);
    const meshes = [0, 1, 2].map((i) => {
      const mesh = createGeometry({
        shape,
        color1: "#EB752F",
        color2: "#ABA49E",
        isBloom: true,
        depth: 0.03,
      });
      mesh.position.z = 0.05;
      mesh.position.y = i * 0.03 - 0.03 + 0.04;
      mesh.position.x = -0.06;
      return mesh;
    });
    return meshes;
  };

  const createShield = () => {
    const width = 0.05;
    const height = 0.05;
    const a = width * 0.2;
    const b = height * 0.4;
    const c = width * 0.3;
    const points = [
      [-(width - c), -(height - b)],
      [0, -height],
      [width - c, -(height - b)],
      [width - a, height],
      [0, height - b],
      [-(width - a), height],
    ];
    const shape = new THREE.Shape();
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      if (i === 0) {
        shape.moveTo(x, y);
      }
      shape.lineTo(x, y);
    }
    const mesh = createGeometry({
      shape,
      color1: "#EB752F",
      color2: "#E8B676",
      isBloom: true,
      depth: 0.02,
      borderColor: "rgba(255,255,255,0.1)",
    });
    mesh.rotation.z = -Math.PI / 2;
    mesh.position.z = 0.05;
    mesh.position.y = 0.04;
    mesh.position.x = 0.02;
    return mesh;
  };

  const createMesh = () => {
    const shape1 = createShape1();
    const mesh1 = createGeometry({
      shape: shape1,
      color1: "#EB752F",
      color2: "#3D3935",
    });
    mesh1.position.y = -0.085;
    const shape3 = createShape1();
    const mesh3 = createGeometry({
      shape: shape3,
      depth: 0.02,
      color2: "#161513",
    });
    mesh3.position.y = -0.085;
    mesh3.position.z = 0.032;

    const shape2 = createShape2();
    const mesh2 = createGeometry({ shape: shape2, color2: "#3D3935" });
    mesh2.rotation.x = Math.PI;
    mesh2.position.y = 0.04;
    const shape4 = createShape2();
    const mesh4 = createGeometry({
      shape: shape4,
      depth: 0.02,
      color2: "#3D3935",
    });
    mesh4.rotation.x = Math.PI;
    mesh4.position.y = 0.04;
    mesh4.position.z = 0.032;

    const cylinders = createCylinder();
    const shield = createShield();

    const object3D = new THREE.Object3D();
    object3D.rotation.z = Math.PI / 2;
    object3D.position.y = 0.22;
    object3D.add(mesh1);
    object3D.add(mesh3);
    object3D.add(mesh2);
    object3D.add(mesh4);
    object3D.add(...cylinders);
    object3D.add(shield);
    setObject(object3D);
  };

  const createGeometry = ({
    shape,
    color1 = "#cec9c6",
    color2 = "#A5A09B",
    opacity = 1,
    depth = 0.04,
    isBloom,
    borderColor = "",
  }: {
    shape: THREE.Shape;
    color1?: string;
    color2?: string;
    opacity?: number;
    depth?: number;
    isBloom?: boolean;
    borderColor?: string;
  }) => {
    const extrudeSettings = {
      depth,
      bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    const material1 = new THREE.MeshStandardMaterial({
      color: color1,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true,
      ...(isBloom ? { emissive: color1, emissiveIntensity: 1 } : {}),
    });
    const material2 = new THREE.MeshStandardMaterial({
      color: color2,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true,
    });
    const mesh = new THREE.Mesh(geometry, [material1, material2]);

    if (borderColor) {
      // 边框几何体
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: borderColor,
        linewidth: 1,
        depthTest: true,
        depthWrite: true,
        transparent: true,
        opacity: 0.5,
      });
      const line = new THREE.LineSegments(edges, lineMaterial);
      const object3D = new THREE.Object3D();
      object3D.add(mesh, line);
      return object3D;
    }
    return mesh;
  };

  const createTube = () => {
    const vertices: THREE.Vector3[] = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0.08),
    ];
    const smoothCurve = new THREE.CatmullRomCurve3(vertices, false);
    const tubeGeometry = new THREE.TubeGeometry(
      smoothCurve,
      1000,
      0.008,
      10,
      false
    );

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 100;
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, 0, 100);
    const createGradient = (gradient: CanvasGradient) => {
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.1, "rgba(255,255,255,0)");
      gradient.addColorStop(0.4, hexToRgb("#FA7900", 0.01));
      gradient.addColorStop(0.4, hexToRgb("#FA7900", 0.01));
      gradient.addColorStop(1, hexToRgb("#FA7900", 0.1));
    };
    createGradient(gradient);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1, 100);
    const texture: any = new THREE.CanvasTexture(canvas);
    texture.offset.y = -0.01;
    texture.repeat.set(0, 1);
    texture.wrapS = THREE.RepeatWrapping; // 防止拉伸
    texture.wrapT = THREE.RepeatWrapping; // 防止拉伸
    texture.rotation = Math.PI / 2;
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      emissive: "#FA7900",
      emissiveIntensity: 1,
    });
    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    return tubeMesh;
  };

  const createBox = () => {
    const width = 1;
    const height = 1;
    const radius = 0.2; // 圆角半径

    const shape = new THREE.Shape();
    // 绘制圆角形状
    shape.absarc(radius, radius, radius, Math.PI, 1.5 * Math.PI);
    shape.absarc(width - radius, radius, radius, 1.5 * Math.PI, 2 * Math.PI);
    // shape.lineTo(1, 1);
    // shape.lineTo(0, 1);
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
        uOuterColor: { value: new THREE.Color("#000") }, // 边缘颜色 (蓝色)
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
      {object && <primitive object={object} />}
      <mesh position={[0.19, 0.01, 0.19]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 32]} />
        <meshStandardMaterial
          color={statusColors[index % 3]}
          emissive={statusColors[index % 3]}
          emissiveIntensity={2}
        />
      </mesh>
      <RoundedBox
        transform={{
          position: [0, 0.02, 0],
          scale: [0.3, 0.12, 0.3],
        }}
        wallColor={["#080605", "#464949"]}
        radius={0}
        topColor={["#696867", "#696867"]}
        edgeColor="#FF6302"
      />
      {tubes.map((i, index) => (
        <object3D
          key={index}
          rotation-x={Math.PI}
          position-z={0.23}
          position-y={0.025}
          position-x={index * 0.05 - 0.05}
        >
          <primitive object={i} />
          <mesh rotation-x={Math.PI / 2} position-z={0.08}>
            <cylinderGeometry args={[0.008, 0.008, 0.001, 32]} />
            <meshStandardMaterial color="#FA7900" />
          </mesh>
        </object3D>
      ))}
      <RoundedBox
        transform={{
          position: [0, 0.175, 0],
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
          position: [0, 0.07, 0],
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
      <object3D
        rotation-y={-Math.PI / 2}
        scale={0.34}
        position-y={0.046}
        position-z={0.48}
      >
        <Label position={[0, 0, 0]} content={["操作变量3"]} color="#FFF" />
      </object3D>
    </>
  );
};

export default Index;
