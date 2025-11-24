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
import AnimationRing from "./AnimationRing";
// import { debounce } from "lodash";

const INITFLOWLIGHTPOSITIONY = -0.46; // 流光初始位置Y
const INITBORDERPOSITIONY = -0.8; // 边界初始位置Y
const TARGETINCREASEHEIGHT = 1; // 动画增加高度

const MapModel = memo(({ begin, setCardBegin, setMapInit }: any) => {
  const { gl, raycaster, camera, mouse } = useThree();
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
  // const isDraggingRef = useRef(false);
  // 鼠标是否按下
  // const isClickDownRef = useRef(false);
  // 点击次数
  // const clickNumRef = useRef(0);
  // 延迟显示label
  // const showTagRef = useRef(false);
  // 地图高度动画step
  const mapHeightCountRef = useRef(0);
  // 地图高度边缘
  const borderMeshRef = useRef<any>();
  // 是否开始动画
  const beginRef = useRef(false);
  // 鼠标是否正在滚动
  const isScrollingRef = useRef(false);
  // 滚动延时
  const scrollTimeout = useRef<any>(null);
  // 鼠标射线检测引用
  // const intersectRef = useRef<any>(null);
  // const lastIntersectRef = useRef<any>(null);
  // 缓动函数参数
  const animationProgress = useRef(0);
  const moveUuid = useRef(null);
  const currUuid = useRef(null);

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
          if (filterName(child.name)) {
            // child.material.color = new THREE.Color("#567");
            child.material.color = new THREE.Color("#204e8f");
            const hsl = { h: 0, s: 0, l: 0 };
            child.material.color.getHSL(hsl);
            blockColors[child.uuid] = { ...hsl };
            const border = dealCity(child);
            if (border) {
              borders.push({ border, name: child.name });
            }
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
            child.visible = false;
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
      setMapInit(true);
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
    // window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    // window.addEventListener("mouseup", handleMouseUp);
    return () => {
      // window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      // window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (begin) {
      beginRef.current = true;
      setMeshColor();
    }
  }, [begin]);

  useEffect(() => {
    if (LightCylinderEnd) {
      setCardBegin(true);
    }
  }, [LightCylinderEnd]);

  const filterName = (name: string) => name.includes("市") || name === "三门峡";

  // 处理市区
  const dealCity = (mesh: any) => {
    mesh.material.side = THREE.DoubleSide;
    mesh.material.transparent = true;
    mesh.material.opacity = 0.3;
    // 0.165
    mesh.position.y = INITBORDERPOSITIONY;
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
    tubeMesh.position.y = INITFLOWLIGHTPOSITIONY;
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
    lineGeometry.applyMatrix4(mesh.parent.matrixWorld);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xb1d2ff,
      linewidth: 1,
      // opacity: 0.3,
      // transparent: true,
    });
    const line = new THREE.LineSegments(lineGeometry, lineMaterial);
    line.rotation.copy(mesh.rotation);
    line.scale.copy(mesh.scale);
    line.position.copy(mesh.position);
    line.position.y = 0.21;
    return line;
  };

  const dealBorder = (mesh: any) => {
    mesh.material.map = mapTexture;
    mesh.material.metalness = 0;
    mesh.scale.y = 0.01;
    mesh.position.y = INITBORDERPOSITIONY;
    borderMeshRef.current = mesh;
  };

  // const handleMouseDown = (event: any) => {
  //   event.preventDefault();
  //   isDraggingRef.current = false;
  //   isClickDownRef.current = true;
  // };

  const handleMouseMove = (event: any) => {
    if (event.target.tagName !== "CANVAS" || !beginRef.current) {
      return;
    }
    event.preventDefault();
    handleMove();
    // if (isClickDownRef.current) {
    //   isDraggingRef.current = true;
    // } else {
    //   isDraggingRef.current = false;
    // }
  };

  // 处理点击事件
  const handleMove = () => {
    raycaster.setFromCamera(mouse, camera);
    if (!partRef.current) {
      return;
    }
    const intersects = raycaster.intersectObjects(
      scene.children[2].children[0].children.filter((i) => filterName(i.name))
    );
    if (intersects.length > 0) {
      const intersect: any = intersects[0];
      if (filterName(intersect.object.name)) {
        if (moveUuid.current !== intersect.object.uuid) {
          moveUuid.current = intersect.object.uuid;
          setMeshColor();
        }
      }
    } else if (moveUuid.current !== null) {
      moveUuid.current = null;
      setMeshColor();
    }
  };

  const onRaycastChanged = (hits: THREE.Intersection[]) => {
    if (isScrollingRef.current || !beginRef.current) {
      return null;
    }
    if (hits.length > 0) {
      const intersect: any = hits[0];
      if (filterName(intersect.object.name)) {
        // intersectRef.current = intersect;
        if (currUuid.current !== intersect.object.uuid) {
          currUuid.current = intersect.object.uuid;
        } else {
          if (currUuid.current) {
            moveUuid.current = null;
          }
          currUuid.current = null;
        }

        setMeshColor();
      }
    }
    return null;
  };

  const setMeshColor = () => {
    // console.log(111, currUuid.current, moveUuid.current);
    if (partRef.current) {
      (partRef.current as any).children[2].children[0].children.forEach(
        (child: any) => {
          if (child.isMesh && filterName(child.name)) {
            child.material.opacity = 0.7;
            if (
              child.uuid === moveUuid.current ||
              child.uuid === currUuid.current
            ) {
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
    // 地图边缘纹理动画
    mapHeightCountRef.current += 0.005;
    mapTexture.offset.y = 1 - (mapHeightCountRef.current % 1);

    // 流光动画
    if (flowLightTexture) {
      // mapBorderCountRef.current += 0.001;
      flowLightTexture.forEach((texture: any) => {
        texture.offset.y -= 0.001;
      });
    }

    // 地图厚度动画
    if (beginRef.current) {
      if (animationProgress.current < 1) {
        const pending = 0.4; // 动画持续时间
        animationProgress.current = Math.min(
          1,
          animationProgress.current + delta / pending
        );
        // Ease-out function (quadratic)  三次缓动函数
        const easedProgress = 1 - Math.pow(1 - animationProgress.current, 3);

        // 地图厚度增加
        borderMeshRef.current.scale.y = TARGETINCREASEHEIGHT * easedProgress;
        borderMeshRef.current.position.y =
          INITBORDERPOSITIONY +
          easedProgress * (TARGETINCREASEHEIGHT / 2) +
          0.06;
        // 地面高度增加
        (partRef.current as any).children[2].children[0].children.forEach(
          (child: any) => {
            if (child.isMesh && filterName(child.name)) {
              child.position.y =
                INITBORDERPOSITIONY + TARGETINCREASEHEIGHT * easedProgress;
            }
          }
        );

        // 流光高度增加
        flowLight.forEach((i: any) => {
          i.position.y =
            INITFLOWLIGHTPOSITIONY + TARGETINCREASEHEIGHT * easedProgress;
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
      {mapAnimationEnd && <OriginPoint position={{ x: 0, z: 0, y: 0.6 }} />}
      <InstancedGridOfSquares begin={begin} />
      {begin && <Wave />}
      {mapAnimationEnd &&
        borderLines.map((i) => <primitive object={i.border} key={i.name} />)}
      {flowLight.map((i, index) => (
        <primitive object={i} key={index} />
      ))}
      {<Name begin={begin} name="河南省" />}
      <LightCylinder
        mapAnimationEnd={mapAnimationEnd}
        composerBegin={composerBegin}
        isEnd={LightCylinderEnd}
        setEnd={setLightCylinderEnd}
      />

      {begin && <AnimationRing />}

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
