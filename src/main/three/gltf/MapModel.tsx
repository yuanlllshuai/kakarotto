import { useEffect, useState, useRef, memo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, CycleRaycast } from "@react-three/drei";
import * as THREE from "three";

import PointLabel from "./PointLabel";
import FlyLine from "./FlyLine";
import OriginPoint from "./OriginPoint";
import InstancedGridOfSquares from "./InstancedGridOfSquares";
import Wave from "./Wave";
import Name from "./Name";
import LightCylinder from "./LightCylinder";
import mapHeightPng from "../res/border.png";
import { lablePoints } from "./const";

const MapModel = memo(({ begin, setCardBegin }: any) => {
  const { gl } = useThree();
  const { scene } = useGLTF("/gltf_models/map/map.gltf");
  // const { scene } = useGLTF('http://111.229.183.248/gltf_models/girl/scene.gltf');

  const [borderLines, setBorderLines] = useState<any[]>([]);
  // 流光轨迹
  const [flowLight, setFlowLight] = useState<any[]>([]);
  // 流光纹理
  const [flowLightTexture, setFlowLightTexture] = useState<any[]>([]);

  // const [borderLine, setBorderLine] = useState<any>();
  // 地图动画是否结束
  const [mapAnimationEnd, setMapAnimationEnd] = useState(false);
  // 是否开始地图动画
  const [composerBegin, setComposerBegin] = useState(false);
  // 光柱结束状态
  const [LightCylinderEnd, setLightCylinderEnd] = useState(false);

  // 地图ref
  const partRef = useRef();
  // 地图原始颜色
  const blockColorMapRef = useRef<any>({});
  // 鼠标是否移动中
  const isDraggingRef = useRef(false);
  // 鼠标是否按下
  const isClickDownRef = useRef(false);
  // 点击次数
  const clickNumRef = useRef(0);
  // 延迟显示label
  // const showTagRef = useRef(false);
  // 地图高度动画step
  const mapHeightCountRef = useRef(0);
  // 地图边沿动画step
  const mapBorderCountRef = useRef(0);
  // 地图高度边缘
  const borderMeshRef = useRef<any>();
  // 是否开始动画
  const beginRef = useRef(false);
  // 鼠标是否正在滚动
  const isScrollingRef = useRef(false);
  // 滚动延时
  const scrollTimeout = useRef<any>(null);
  // 鼠标射线检测引用
  const intersectRef = useRef<any>(null);
  const lastIntersectRef = useRef<any>(null);

  // 地图边缘纹理
  const [mapTexture] = useTexture([mapHeightPng]);
  mapTexture.repeat.set(1, 1);
  mapTexture.wrapS = THREE.RepeatWrapping;
  mapTexture.wrapT = THREE.RepeatWrapping;
  mapTexture.magFilter = THREE.NearestFilter;
  mapTexture.colorSpace = THREE.SRGBColorSpace;
  mapTexture.rotation = Math.PI;

  useEffect(() => {
    if (mapTexture) {
      setComposerBegin(true);
    }
  }, [mapTexture]);

  useEffect(() => {
    if (scene) {
      const blockColors: any = {};
      const borders: any = [];
      // console.log(111, scene);
      scene.traverse((child: any) => {
        if (child.isMesh) {
          if (child.name.includes("市") || child.name === "三门峡") {
            // child.material.color = new THREE.Color("#567");
            const hsl = { h: 0, s: 0, l: 0 };
            child.material.color.getHSL(hsl);
            blockColors[child.uuid] = { ...hsl };
            const border = dealCity(child);
            borders.push({ border, name: child.name });
          }
          if (child.name.includes("河南边界")) {
            dealBorder(child);
          }
          if (child.name.includes("挤压")) {
            const [texture1, tubeMesh1] = dealFlowLight(child);
            const [texture2, tubeMesh2] = dealFlowLight(child);
            texture2.offset.y = 0.25;
            setFlowLight([tubeMesh1, tubeMesh2]);
            setFlowLightTexture([texture1, texture2]);
          }
          if (child.name.includes("光柱")) {
            child.visible = false;
          }
          if (child.name === "底") {
            child.material.transparent = true;
            child.material.opacity = 0;
          }
          if (child.name === "底边界") {
            child.visible = false;
          }
        }
      });
      blockColorMapRef.current = blockColors;
      setBorderLines(borders);
    }
  }, [scene]);

  // 检测鼠标滚轮事件
  useEffect(() => {
    const handleWheel = () => {
      isScrollingRef.current = true;
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(
        () => (isScrollingRef.current = false),
        100
      );
    };

    gl.domElement.addEventListener("wheel", handleWheel);
    return () => gl.domElement.removeEventListener("wheel", handleWheel);
  }, [gl]);

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (begin) {
      beginRef.current = true;
    }
  }, [begin]);

  useEffect(() => {
    if (LightCylinderEnd) {
      setCardBegin(true);
    }
  }, [LightCylinderEnd]);

  // 处理市区
  const dealCity = (mesh: any) => {
    mesh.material.side = THREE.DoubleSide;
    mesh.material.transparent = true;
    mesh.material.opacity = 0.7;
    // 0.165
    mesh.position.y = -0.8;
    // mesh.position.y = -2;
    const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry);
    const positions = edgesGeometry.attributes.position.array;
    const borderLine = getBorderLine(mesh, positions);
    return borderLine;
  };

  // 过滤不正确的坐标点
  const filterPoints = (points: any) => {
    const offsetX = 0.6;
    const offsetY = 0.8;
    const numPoints = points.length / 3;
    const vertices = [new THREE.Vector3(points[0], points[1], points[2])];
    let errorIndex = null;
    let isError = false;
    let i = 1;
    while (i < numPoints) {
      const beginIndex = errorIndex || i;
      const prevX = points[(beginIndex - 1) * 3];
      const prevY = points[(beginIndex - 1) * 3 + 1];

      const currX = points[i * 3];
      const currY = points[i * 3 + 1];
      const currZ = points[i * 3 + 2];

      if (
        Math.abs(currX - prevX) > offsetX ||
        Math.abs(currY - prevY) > offsetY
      ) {
        i += 1;
        isError = true;
      } else {
        i += 1;
        if (isError) {
          isError = false;
        } else {
          vertices.push(new THREE.Vector3(currX, currY, currZ));
        }
        errorIndex = i;
      }
    }
    return vertices;
  };

  // 生成流光
  const dealFlowLight = (mesh: any) => {
    const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry);
    const positions = edgesGeometry.attributes.position.array;
    const vertices = filterPoints(positions);
    const len = vertices.length;
    const curve = new THREE.CatmullRomCurve3(vertices, false);
    const points = curve.getPoints(len);
    const smoothCurve = new THREE.CatmullRomCurve3(points, false);
    const tubeGeometry = new THREE.TubeGeometry(
      smoothCurve,
      len,
      0.06,
      8,
      false
    );

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 100;
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, 0, 100);
    const createGradient = (gradient: any, color: string) => {
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.1, "rgba(255,255,255,0)");
      gradient.addColorStop(0.2, "rgba(255,255,255,0)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0)");
      gradient.addColorStop(0.6, "rgba(255,255,255,0)");
      gradient.addColorStop(0.7, "rgba(255,255,255,0)");
      gradient.addColorStop(0.8, "rgba(255,255,255,0)");
      gradient.addColorStop(0.9, "rgba(255,255,255,0)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
    };
    createGradient(gradient, "#A020F0");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1, 100);
    const texture: any = new THREE.CanvasTexture(canvas);
    texture.repeat.set(0, 1);
    texture.wrapS = THREE.RepeatWrapping; // 防止拉伸
    texture.wrapT = THREE.RepeatWrapping; // 防止拉伸
    texture.rotation = Math.PI / 2;
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    // setFlowLightTexture(texture);
    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    tubeMesh.position.copy(mesh.position);
    tubeMesh.rotation.copy(mesh.rotation);
    tubeMesh.scale.copy(mesh.scale);
    tubeMesh.position.y = -0.46;
    // tubeMesh.position.y -= 0.46;
    return [texture, tubeMesh];
    // setFlowLight(tubeMesh);

    // 边缘线
    // getBorderLine(mesh, positions);
  };

  const getBorderLine = (mesh: any, positions: any) => {
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    lineGeometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(
        mesh.position.x + 47.8,
        mesh.position.y,
        mesh.position.z - 0.47
      )
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xb1d2ff,
      linewidth: 1,
      // opacity: 0.3,
      // transparent: true,
    });
    const line = new THREE.LineSegments(lineGeometry, lineMaterial);
    line.position.set(0, 0, 0);
    line.rotation.copy(mesh.rotation);
    line.scale.copy(mesh.scale);
    // line.position.y += 0.359;
    line.position.y = 1.35;
    return line;
    // setBorderLine(line);
  };

  const dealBorder = (mesh: any) => {
    mesh.material.map = mapTexture;
    mesh.material.metalness = 0;
    mesh.scale.y = 0.01;
    mesh.position.y = -0.8;
    // mesh.position.y = -0.26;
    // mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.52, 0));
    borderMeshRef.current = mesh;
  };

  const handleMouseDown = (event: any) => {
    event.preventDefault();
    isDraggingRef.current = false;
    isClickDownRef.current = true;
  };

  const handleMouseMove = (event: any) => {
    event.preventDefault();
    if (isClickDownRef.current) {
      isDraggingRef.current = true;
    } else {
      isDraggingRef.current = false;
    }
  };

  const handleMouseUp = (event: any) => {
    event.preventDefault();
    if (event.target.tagName !== "CANVAS") {
      return;
    }
    if (!isDraggingRef.current || clickNumRef.current === 0) {
      handleClick(event);
      clickNumRef.current += 1;
    }
    isDraggingRef.current = false;
    isClickDownRef.current = false;
  };

  // 处理点击事件
  const handleClick = (event: any) => {
    event.preventDefault();
    if (
      !intersectRef.current ||
      (intersectRef.current.object.name ===
        lastIntersectRef.current?.object?.name &&
        intersectRef.current.point.x === lastIntersectRef.current?.point.x)
    ) {
      return;
    }
    // setShowTag(false);
    // showTagRef.current = false;
    // setTimeout(() => {
    //   setShowTag(true);
    //   showTagRef.current = true;
    //   setLabelPosition(intersectRef.current.point);
    //   lastIntersectRef.current = intersectRef.current;
    // }, 300);
    setMeshColor(intersectRef.current.object.uuid);
    // setLabelText(intersectRef.current.object.name);
    // console.log(intersectRef.current.point, intersectRef.current.object.name);
    // raycaster.setFromCamera(mouse, camera);
    // if (!partRef.current) {
    //   return;
    // }
    // const intersects = raycaster.intersectObjects(
    //   scene.children[2].children[0].children.filter((i) =>
    //     i.name.includes("市")
    //   )
    // );
    // if (intersects.length > 0) {
    //   const intersect: any = intersects[0];
    //   if (intersect.object.name.includes("市")) {
    //     setShowTag(false);
    //     showTagRef.current = false;
    //     setTimeout(() => {
    //       setShowTag(true);
    //       showTagRef.current = true;
    //       setLabelPosition(intersect.point);
    //     }, 300);
    //     setMeshColor(intersect.object.uuid);
    //     setLabelText(intersect.object.name);
    //   }
    // }
  };

  const onRaycastChanged = (hits: THREE.Intersection[]) => {
    if (isScrollingRef.current) {
      return null;
    }
    if (hits.length > 0) {
      const intersect: any = hits[0];
      if (
        intersect.object.name.includes("市") ||
        intersect.object.name === "三门峡"
      ) {
        intersectRef.current = intersect;
        setMeshColor(intersect.object.uuid);
      }
    }
    return null;
  };

  const setMeshColor = (uuid: string) => {
    if (partRef.current) {
      (partRef.current as any).children[2].children[0].children.forEach(
        (child: any) => {
          if (
            child.isMesh &&
            (child.name.includes("市") || child.name === "三门峡")
          ) {
            if (child.uuid === uuid) {
              const hsl = { ...blockColorMapRef.current[child.uuid] };
              hsl.l += 0.2;
              child.material.color.setHSL(hsl.h, hsl.s, hsl.l);
            } else {
              const hsl = { ...blockColorMapRef.current[child.uuid] };
              child.material.color.setHSL(hsl.h, hsl.s, hsl.l);
            }
          }
        }
      );
    }
  };

  useFrame((_state, delta) => {
    // const vector = new THREE.Vector3()
    //   .copy({ x: 0, y: 0, z: 0 })
    //   .sub(camera.position);
    // const distance = vector.length();
    // const newScale = 1 / (distance / 10);
    // setLabelScale(Math.max(0.7, Math.min(0.8, newScale)));

    // 地图边缘纹理动画
    mapHeightCountRef.current += 0.005;
    mapTexture.offset.y = 1 - (mapHeightCountRef.current % 1);

    // 流光动画
    if (flowLightTexture) {
      mapBorderCountRef.current += 0.001;
      flowLightTexture.forEach((texture: any) => {
        texture.offset.y -= 0.001;
      });
    }

    // 地图厚度动画
    if (beginRef.current) {
      const pending = 0.5; // 动画持续时间
      const times = pending / delta; // 执行完动画的总帧数

      if (borderMeshRef.current && borderMeshRef.current.scale.y < 1) {
        const speed = 1 / times; // 每帧增加的厚度
        const speed3 = 0.54 / times;
        // 地图厚度增加
        borderMeshRef.current.scale.y += speed;
        borderMeshRef.current.position.y += speed3;
        const speed2 = (0.165 + 0.8) / times; // 每帧增加的高度
        // 地面高度增加
        (partRef.current as any).children[2].children[0].children.forEach(
          (child: any) => {
            if (
              child.isMesh &&
              (child.name.includes("市") || child.name === "三门峡")
            ) {
              child.position.y += speed2;
            }
          }
        );

        // 流光高度增加
        flowLight.forEach((i: any) => {
          i.position.y += speed2;
        });
      } else if (!mapAnimationEnd) {
        setMapAnimationEnd(true);
      }
    }
  });

  return (
    <>
      <primitive
        ref={partRef}
        object={scene}
        scale={1}
        position={[0, -22, 0]}
        onClick={(e: any) => e.stopPropagation()}
      ></primitive>
      {lablePoints.map(
        ({
          position,
          label,
          weather,
        }: {
          position: any;
          label: string;
          weather: number | null;
        }) => (
          <PointLabel
            key={label}
            position={position}
            scale={1}
            label={label}
            visible={mapAnimationEnd}
            weather={weather}
            weatherBegin={LightCylinderEnd}
          />
        )
      )}
      {mapAnimationEnd &&
        lablePoints.map(
          ({ position, label }: { position: any; label: string }) => (
            <FlyLine key={label} position={position} />
          )
        )}
      {/* {labelPosition.x !== 0 && <FlyLine position={labelPosition} />} */}
      {mapAnimationEnd && <OriginPoint position={{ x: 0, z: 0, y: 0 }} />}
      <InstancedGridOfSquares />
      {begin && <Wave />}
      {/* {borderLine && <primitive object={borderLine} />} */}
      {mapAnimationEnd &&
        borderLines.map((i) => <primitive object={i.border} key={i.name} />)}
      {/* {flowLight && <primitive object={flowLight} />} */}
      {flowLight.map((i, index) => (
        <primitive object={i} key={index} />
      ))}
      {<Name begin={begin} />}
      <LightCylinder
        mapAnimationEnd={mapAnimationEnd}
        composerBegin={composerBegin}
        isEnd={LightCylinderEnd}
        setEnd={setLightCylinderEnd}
      />
      {/* {LightCylinderEnd && <Cloud />} */}

      <CycleRaycast
        preventDefault={true} // Call event.preventDefault() (default: true)
        scroll={false} // Wheel events (default: true)
        keyCode={0} // Keyboard events (default: 9 [Tab])
        onChanged={onRaycastChanged}
        portal={partRef.current}
      />
    </>
  );
});

export default MapModel;
