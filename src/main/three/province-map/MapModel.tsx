import { useEffect, useState, useRef } from "react";
import { useTexture, CycleRaycast } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import * as d3 from "d3";
import Name from "./components/Name";
import LightCylinder from "./components/LightCylinder";
import mapHeightPng from "../res/border.png";
import InstancedGridOfSquares from "../gltf/InstancedGridOfSquares";
import Wave from "../gltf/Wave";
import OriginPoint from "../gltf/OriginPoint";
import AnimationRing from "../gltf/AnimationRing";
import PointLabel from "../gltf/PointLabel";
import FlyLine from "../gltf/FlyLine";
import * as TWEEN from "@tweenjs/tween.js";

const MapModel = ({
  prvince,
  name,
  cameraEnd,
  mapLoaded,
  setMapLoaded,
  setLastAnimationEnd,
}: {
  prvince: string;
  name: string;
  cameraEnd: boolean;
  mapLoaded: boolean;
  setMapLoaded: (loading: boolean) => void;
  setLastAnimationEnd: (isEnd: boolean) => void;
}) => {
  const { gl, raycaster, camera, mouse } = useThree();

  const [borders, setBorders] = useState<any[]>([]);
  const [shaps, setShapes] = useState<any[]>([]);
  const [scale, setScale] = useState<number>(0);
  const [depth, setDepth] = useState<number>(0);
  const [labels, setLabels] = useState<any[]>([]);
  const [mapHsl, setMapHsl] = useState<any>(null);
  const [mapDepthEnd, setMapDepthEnd] = useState<boolean>(false);
  // 流光轨迹
  const [flowLight, setFlowLight] = useState<any[]>([]);
  // 流光纹理
  const [flowLightTexture, setFlowLightTexture] = useState<any[]>([]);
  // 地图高度动画step
  const mapHeightCountRef = useRef(0);
  const parentRef = useRef<any>();
  const shapRef = useRef<any>();
  const isScrollingRef = useRef(false);
  const scrollTimeout = useRef<any>(null);
  const currMapName = useRef<string>("");
  const lastMapName = useRef<string>("");
  const clickMapName = useRef<string>("");
  const tweenRef = useRef<any>(null);
  const mapHslRef = useRef<any>(null);

  // 地图边缘纹理
  const [mapTexture] = useTexture([mapHeightPng]);
  mapTexture.wrapS = THREE.RepeatWrapping;
  mapTexture.wrapT = THREE.RepeatWrapping;
  mapTexture.magFilter = THREE.NearestFilter;
  mapTexture.colorSpace = THREE.SRGBColorSpace;
  mapTexture.rotation = Math.PI;

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

  // 增加鼠标移动事件
  useEffect(() => {
    if (cameraEnd) {
      window.addEventListener("mousemove", handleMouseMove);
      setMapDepthAnimation();
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cameraEnd]);

  useEffect(() => {
    if (cameraEnd && scale !== 0) {
      setMapDepthAnimation();
    }
  }, [cameraEnd, scale]);

  useEffect(() => {
    if (prvince) {
      const loader = new THREE.FileLoader();
      setMapDepthEnd(false);
      loader.load(
        `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${prvince}${
          prvince === "710000" ? "" : "_full"
        }`,
        function (data1) {
          loader.load(
            `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${prvince}`,
            function (data2) {
              initMap(JSON.parse(data1 as string), JSON.parse(data2 as string));
              setMapLoaded(true);
            }
          );
        }
      );
    }
  }, [prvince]);

  const setMapDepthAnimation = () => {
    if (shapRef.current) {
      (shapRef.current as any).children.forEach((child: any) => {
        const hsl = { ...mapHsl };
        hsl.l += 0.2;
        child.material[0].color.setHSL(hsl.h, hsl.s, hsl.l);
        mapHslRef.current = hsl;
      });
    }
    tweenRef.current = new TWEEN.Tween({ scale: 0 })
      .to({ scale }, 400)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(({ scale }) => {
        if (parentRef.current) {
          parentRef.current.scale.y = scale;
        }
      })
      .onComplete(() => {
        setMapDepthEnd(true);
      })
      .start();
  };

  const handleMouseMove = (event: any) => {
    if (event.target.tagName !== "CANVAS" || !cameraEnd) {
      return;
    }
    event.preventDefault();
    handleMove();
  };

  // 处理移动事件
  const handleMove = () => {
    raycaster.setFromCamera(mouse, camera);
    if (!shapRef.current) {
      return;
    }
    const intersects = raycaster.intersectObjects(shapRef.current.children);
    lastMapName.current = currMapName.current;
    if (intersects.length > 0) {
      const intersect: any = intersects[0];
      currMapName.current = intersect.object.name;
    } else {
      currMapName.current = "";
    }
    if (lastMapName.current !== currMapName.current) {
      setMapColor();
    }
  };

  const setMapColor = () => {
    if (shapRef.current) {
      (shapRef.current as any).children.forEach((child: any) => {
        if (
          child.name === currMapName.current ||
          child.name === clickMapName.current
        ) {
          const hsl = { ...mapHslRef.current };
          hsl.l += 0.2;
          child.material[0].color.setHSL(hsl.h, hsl.s, hsl.l);
        } else {
          const hsl = { ...mapHslRef.current };
          child.material[0].color.setHSL(hsl.h, hsl.s, hsl.l);
        }
      });
    }
  };

  const onRaycastChanged = (hits: THREE.Intersection[]) => {
    if (isScrollingRef.current) {
      return null;
    }
    if (hits.length > 0) {
      const intersect: any = hits[0];
      clickMapName.current =
        clickMapName.current === intersect.object.name
          ? ""
          : intersect.object.name;
    }
    setMapColor();
    return null;
  };

  const getFlowLight = (map: any, { depth, center, scale }: any) => {
    const projection = d3
      .geoMercator()
      .center(center) // 地图中心点坐标
      .scale(80)
      .translate([0, 0]);
    let maxAreaPolygons: any[] = [];
    map.features.forEach((elem: any) => {
      const coordinates = elem.geometry.coordinates;
      coordinates.forEach((multiPolygon: any) => {
        if (Array.isArray(coordinates[0][0][0])) {
          multiPolygon.forEach((polygon: any) => {
            maxAreaPolygons =
              maxAreaPolygons.length >= polygon.length
                ? maxAreaPolygons
                : polygon;
          });
        } else {
          maxAreaPolygons =
            maxAreaPolygons.length >= multiPolygon.length
              ? maxAreaPolygons
              : multiPolygon;
        }
      });
    });
    const positions = [];
    for (let i = 0; i < maxAreaPolygons.length; i++) {
      const [x, z] = projection(maxAreaPolygons[i]) as number[];
      if (!isNaN(x) && !isNaN(z)) {
        positions[i * 3] = x;
        positions[i * 3 + 1] = depth;
        positions[i * 3 + 2] = z;
      }
    }
    const vertices = getVertices(positions);
    const [texture1, tubeMesh1] = dealFlowLight(vertices, scale);
    const [texture2, tubeMesh2] = dealFlowLight(vertices, scale);
    texture2.offset.y = 0.5;
    setFlowLight([tubeMesh1, tubeMesh2]);
    setFlowLightTexture([texture1, texture2]);
  };

  const getComputeData: (map: any) => {
    depth: number;
    center: [number, number];
    scale: number;
  } = (map) => {
    const center = map.features[0].properties.centroid;
    const projection = d3
      .geoMercator()
      .center([center[0], center[1]])
      .scale(80)
      .translate([0, 0]);
    let minX = 0;
    let maxX = 0;
    let minZ = 0;
    let maxZ = 0;
    let totalX = 0;
    let totalZ = 0;
    let total = 0;
    // 不同省份面积有大有小
    // 首次遍历获取地图缩放比例及厚度换算公式
    map.features.forEach((elem: any) => {
      const coordinates = elem.geometry.coordinates;
      coordinates.forEach((multiPolygon: any) => {
        if (Array.isArray(coordinates[0][0][0])) {
          multiPolygon.forEach((polygon: any) => {
            for (let i = 0; i < polygon.length; i++) {
              const [x, z] = projection(polygon[i]) as number[];
              if (!isNaN(x) && !isNaN(z)) {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minZ = Math.min(minZ, z);
                maxZ = Math.max(maxZ, z);
                totalX += polygon[i][0];
                totalZ += polygon[i][1];
                total += 1;
              }
            }
          });
        } else {
          for (let i = 0; i < multiPolygon.length; i++) {
            const [x, z] = projection(multiPolygon[i]) as number[];
            if (!isNaN(x) && !isNaN(z)) {
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minZ = Math.min(minZ, z);
              maxZ = Math.max(maxZ, z);
              totalX += multiPolygon[i][0];
              totalZ += multiPolygon[i][1];
              total += 1;
            }
          }
        }
      });
    });
    const crossX = maxX - minX;
    const crossZ = maxZ - minZ;
    const compScale = (13 / Math.max(crossX, crossZ)) * 2;
    setScale(compScale);
    const depth = (0.12 * Math.max(crossX, crossZ)) / 2.96;
    setDepth(depth);
    mapTexture.repeat.set(1.5 * compScale, 1.5 * compScale);
    return {
      center: [totalX / total, totalZ / total],
      depth,
      scale: compScale,
    };
  };

  const initMap = (map1: any, map2: any) => {
    const { depth, center, scale } = getComputeData(map1);
    getFlowLight(map2, { depth, center, scale });
    const allBorders: any[] = [];
    const allShaps: any[] = [];
    const labelArr: any[] = [];

    const projection = d3
      .geoMercator()
      .center(center) // 地图中心点坐标
      .scale(80)
      .translate([0, 0]);
    const projectionCenter = d3
      .geoMercator()
      .center(center) // 地图中心点坐标
      .scale(80 * scale)
      .translate([0, 0]);
    map1.features.forEach((elem: any, index1: number) => {
      const [centerX, centerZ] = projectionCenter(
        elem.properties.centroid || elem.properties.center
      ) as number[];
      labelArr.push({
        position: {
          x: centerX,
          y: depth * scale,
          z: centerZ,
        },
        label: elem.properties.name,
        weather: index1 % 10,
      });
      const coordinates = elem.geometry.coordinates;
      coordinates.forEach((multiPolygon: any, index2: number) => {
        if (Array.isArray(coordinates[0][0][0])) {
          multiPolygon.forEach((polygon: any, index3: number) => {
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0xb1d2ff,
            });
            const shape = new THREE.Shape();
            const lineGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(polygon.length * 3);
            for (let i = 0; i < polygon.length; i++) {
              const [x, z] = projection(polygon[i]) as number[];
              if (!isNaN(x) && !isNaN(z)) {
                if (i === 0) {
                  shape.moveTo(x, -z);
                }
                shape.lineTo(x, -z);
                positions[i * 3] = x;
                positions[i * 3 + 1] = depth;
                positions[i * 3 + 2] = z;
              }
            }
            const extrudeSettings = {
              depth,
              bevelEnabled: false,
            };

            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const material = new THREE.MeshBasicMaterial({
              color: "#204e8f",
              transparent: true,
              opacity: 0.4,
            });
            const hsl = { h: 0, s: 0, l: 0 };
            material.color.getHSL(hsl);
            setMapHsl(hsl);
            const material1 = new THREE.MeshBasicMaterial({
              // color: "#1ba0d4ff",
            });
            lineGeometry.setAttribute(
              "position",
              new THREE.BufferAttribute(positions, 3)
            );
            const line = new THREE.Line(lineGeometry, lineMaterial);
            const name = elem.properties.name + index1 + index2 + index3;
            allBorders.push({
              line,
              name,
            });
            const mesh = new THREE.Mesh(geometry, [material, material1]);
            mesh.material[1].map = mapTexture;
            mesh.name = name;
            mapTexture.offset.y = 1.5;
            allShaps.push({
              mesh,
              name,
            });
          });
        } else {
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xb1d2ff,
          });
          const shape = new THREE.Shape();
          const lineGeometry = new THREE.BufferGeometry();
          const positions = new Float32Array(multiPolygon.length * 3);
          for (let i = 0; i < multiPolygon.length; i++) {
            const [x, z] = projection(multiPolygon[i]) as number[];
            if (!isNaN(x) && !isNaN(z)) {
              if (i === 0) {
                shape.moveTo(x, -z);
              }
              shape.lineTo(x, -z);
              positions[i * 3] = x;
              positions[i * 3 + 1] = depth;
              positions[i * 3 + 2] = z;
            }
          }
          const extrudeSettings = {
            depth,
            bevelEnabled: false,
          };

          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const material = new THREE.MeshBasicMaterial({
            color: "#204e8f",
            transparent: true,
            opacity: 0.4,
          });
          const hsl = { h: 0, s: 0, l: 0 };
          material.color.getHSL(hsl);
          setMapHsl(hsl);
          const material1 = new THREE.MeshBasicMaterial({
            // color: "#1ba0d4ff",
          });
          lineGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
          );
          const line = new THREE.Line(lineGeometry, lineMaterial);
          const name = elem.properties.name + index1 + index2;
          allBorders.push({
            line,
            name,
          });
          const mesh = new THREE.Mesh(geometry, [material, material1]);
          mesh.material[1].map = mapTexture;
          mesh.name = name;
          mapTexture.offset.y = 1.5;
          allShaps.push({
            mesh,
            name,
          });
        }
      });
    });
    setBorders(allBorders);
    setShapes(allShaps);
    setLabels(labelArr);
  };

  const getVertices = (points: any) => {
    const vertices = [new THREE.Vector3(points[0], points[1], points[2])];
    let i = 1;
    const numPoints = points.length / 3;
    while (i < numPoints) {
      const currX = points[i * 3];
      const currY = points[i * 3 + 1];
      const currZ = points[i * 3 + 2];
      vertices.push(new THREE.Vector3(currX, currY, currZ));
      i += 1;
    }
    return vertices;
  };

  // 生成流光
  const dealFlowLight = (vertices: any, scale: number) => {
    const tubeWidth = 0.012 * (8.78266872973055 / scale);
    const len = vertices.length;
    const curve = new THREE.CatmullRomCurve3(vertices, false);
    const points = curve.getPoints(len);
    const smoothCurve = new THREE.CatmullRomCurve3(points, false);
    const tubeGeometry = new THREE.TubeGeometry(
      smoothCurve,
      len,
      tubeWidth,
      8,
      false
    );

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 100;
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, 0, 100);
    const createGradient = (gradient: any) => {
      gradient.addColorStop(0, "rgba(160,32,240,1)");
      gradient.addColorStop(0.02, "rgba(160,32,240,0.8)");
      gradient.addColorStop(0.05, "rgba(160,32,240,0.4)");
      gradient.addColorStop(0.07, "rgba(160,32,240,0.2)");
      gradient.addColorStop(0.1, "rgba(160,32,240,0.1)");
      gradient.addColorStop(0.2, "rgba(255,255,255,0.1)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0)");
      gradient.addColorStop(0.6, "rgba(255,255,255,0)");
      gradient.addColorStop(0.7, "rgba(255,255,255,0)");
      gradient.addColorStop(0.8, "rgba(255,255,255,0)");
      gradient.addColorStop(0.9, "rgba(255,255,255,0)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
    };
    createGradient(gradient);
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
    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    return [texture, tubeMesh];
  };

  useFrame((_state, delta) => {
    mapHeightCountRef.current += delta / 2;
    mapTexture.offset.y = 1 - (mapHeightCountRef.current % 1);

    if (flowLightTexture) {
      flowLightTexture.forEach((texture: any) => {
        texture.offset.y -= 0.0015;
      });
    }

    if (tweenRef.current) {
      tweenRef.current.update(); // Update tween animations
    }
  });

  if (!mapLoaded) {
    return <></>;
  }

  return (
    <>
      <object3D ref={parentRef} scale={[scale, 0, scale]} position={[0, 0, 0]}>
        {mapDepthEnd &&
          borders.map((i) => <primitive object={i.line} key={i.name} />)}
        <object3D ref={shapRef} onClick={(e: any) => e.stopPropagation()}>
          {shaps.map((i) => (
            <primitive object={i.mesh} key={i.name} rotation-x={-Math.PI / 2} />
          ))}
        </object3D>
        {flowLight.map((i, index) => (
          <primitive object={i} key={index} />
        ))}
      </object3D>
      <Name begin={mapDepthEnd} name={name} />
      <object3D position={[0, 0.4, 0]}>
        <InstancedGridOfSquares begin={mapDepthEnd} />
      </object3D>
      {mapDepthEnd && <Wave />}
      {mapDepthEnd && (
        <OriginPoint position={{ x: 0, z: 0, y: depth * scale }} />
      )}
      {mapDepthEnd && <AnimationRing />}
      {labels.map(
        ({
          position,
          label,
          weather,
        }: {
          position: any;
          label: string;
          weather: number;
        }) => (
          <PointLabel
            key={label}
            position={position}
            scale={1}
            label={label}
            visible={mapDepthEnd}
            weather={weather}
            weatherBegin={mapDepthEnd}
          />
        )
      )}
      {mapDepthEnd &&
        labels.map(({ position, label }: { position: any; label: string }) => (
          <FlyLine key={label} position={position} />
        ))}
      {mapDepthEnd && (
        <LightCylinder
          position={[0, depth * scale, 0]}
          setLastAnimationEnd={setLastAnimationEnd}
        />
      )}
      {/* {mapDepthEnd && (
        <LightCylinder
          position={[
            labels[labels.length - 1].position.x,
            depth * scale,
            labels[labels.length - 1].position.z,
          ]}
        />
      )} */}
      {mapDepthEnd && (
        <CycleRaycast
          preventDefault={true} // Call event.preventDefault() (default: true)
          scroll={false} // Wheel events (default: true)
          keyCode={0} // Keyboard events (default: 9 [Tab])
          onChanged={onRaycastChanged}
          portal={shapRef.current}
        />
      )}
    </>
  );
};

export default MapModel;
