import { memo, useEffect, useState } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  colors: [string, string];
  lineWidth?: number;
};

const MapModel = memo(({ colors, lineWidth = 1 }: Props) => {
  const [plane, setPlane] = useState<any>(null);
  const [walls, setWalls] = useState<any[]>([]);
  const wallConfig = [
    { "rotation-x": Math.PI, "position-y": 0, "position-z": 2 },
    { "rotation-x": Math.PI, "position-y": 0, "position-z": -2 },
    { "rotation-x": Math.PI, "rotation-y": Math.PI / 2, "position-x": 2 },
    { "rotation-x": Math.PI, "rotation-y": Math.PI / 2, "position-x": -2 },
  ];
  const points = [
    {
      points: [
        [-2, 2, 2],
        [-2, 2, -2],
      ],
    },
    {
      points: [
        [-2, 2, 2],
        [2, 2, 2],
      ],
    },
    {
      points: [
        [2, 2, 2],
        [2, 2, -2],
      ],
    },
    {
      points: [
        [2, 2, -2],
        [-2, 2, -2],
      ],
    },
    {
      points: [
        [-2, 2, -2],
        [-2, -1, -2],
      ],
    },
    {
      points: [
        [2, 2, 2],
        [2, -1, 2],
      ],
    },
    {
      points: [
        [-2, 2, 2],
        [-2, -1, 2],
      ],
    },
    {
      points: [
        [2, 2, -2],
        [2, -1, -2],
      ],
    },
  ];

  useEffect(() => {
    createPlan();
    createWalls();
  }, []);

  const createWalls = () => {
    const mesh = [1, 1, 1, 1].map((_i) => createWallMesh());
    setWalls(mesh);
  };

  const createPlan = () => {
    const shape = new THREE.Shape();
    const points = [
      [-2, 2],
      [-2, -2],
      [2, -2],
      [2, 2],
    ];
    for (let i = 0; i < points.length; i++) {
      const [x, z] = points[i];
      if (!isNaN(x) && !isNaN(z)) {
        if (i === 0) {
          shape.moveTo(x, -z);
        }
        shape.lineTo(x, -z);
      }
    }

    const extrudeSettings = {
      depth: 0.001,
      bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        cornerRadius: { value: 0.1 }, //  默认圆角半径更小（0.1）
        center: { value: new THREE.Vector2(-1, -1) }, // 默认中心点为 (0, 0)
        innerRadius: { value: 1.6 }, // 内正方形半径（白色区域）
        outerRadius: { value: 3.8 }, // 外正方形半径（红色区域）
        innerColor: { value: new THREE.Color(colors[0]) }, // 默认内颜色
        outerColor: { value: new THREE.Color(colors[1]) }, // 默认外颜色
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
      uniform float cornerRadius;
      uniform vec3 innerColor;
      uniform vec3 outerColor;
      varying vec2 vUv;

      void main() {
        // 将 UV 映射到 [-1, 1] 范围
        vec2 uv = (vUv - 0.5) * 2.0;

        // 计算到中心点的偏移
        vec2 offsetUV = uv - center;

        // 计算到圆角正方形边界的距离
        vec2 d = abs(offsetUV) - vec2(1.0);
        float dist = length(max(vec2(0.0), d)) - cornerRadius;

        // 颜色渐变：innerColor → outerColor
        float t = smoothstep(innerRadius, outerRadius, dist);
        vec3 color = mix(innerColor, outerColor, t);

        gl_FragColor = vec4(color, 0.4);
      }
    `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    setPlane(mesh);
  };

  const createWallMesh = () => {
    const shape = new THREE.Shape();
    const points = [
      [2, 2],
      [-2, 2],
      [-2, -1],
      [2, -1],
    ];
    for (let i = 0; i < points.length; i++) {
      const [x, z] = points[i];
      if (!isNaN(x) && !isNaN(z)) {
        if (i === 0) {
          shape.moveTo(x, -z);
        }
        shape.lineTo(x, -z);
      }
    }

    const extrudeSettings = {
      depth: 0.00001,
      bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        innerColor: { value: new THREE.Color(colors[0]) },
        outerColor: { value: new THREE.Color(colors[1]) },
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

      void main() {
        vec2 uv = vUv;
        float y = 0.7 - uv.y;
        vec3 color = mix(innerColor, outerColor, y);
        float alpha = 0.1 * y;
        if(y < 0.0) discard;
        gl_FragColor=vec4(color, alpha);
      }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  return (
    <>
      {plane && (
        <primitive object={plane} rotation-x={Math.PI / 2} position-y={2} />
      )}
      {walls.map((i: any, index: number) => (
        <primitive key={index} object={i} {...wallConfig[index]} />
      ))}
      {points.map((i: any, index: number) => (
        <Line
          key={index}
          points={i.points}
          lineWidth={lineWidth}
          dashed={false}
          segments
          vertexColors={
            index < 4
              ? [
                  [12, 23, 55, 0.2],
                  [12, 23, 55, 0.2],
                ]
              : [[12, 23, 55, 0.2]]
          }
        />
      ))}
    </>
  );
});

export default MapModel;
