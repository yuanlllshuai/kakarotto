import { useEffect, useState, useRef } from "react";
import { useTexture, CycleRaycast } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import * as d3 from "d3";
import Name from "./components/Name";
import mapHeightPng from "../res/border.png";
import InstancedGridOfSquares from "../gltf/InstancedGridOfSquares";
import Wave from "../gltf/Wave";
import OriginPoint from "../gltf/OriginPoint";
import AnimationRing from "../gltf/AnimationRing";
import PointLabel from "../gltf/PointLabel";
import FlyLine from "../gltf/FlyLine";

const MapModel = ({
  prvince,
  name,
  cameraEnd,
  mapLoaded,
  setMapLoaded,
}: {
  prvince: string;
  name: string;
  cameraEnd: boolean;
  mapLoaded: boolean;
  setMapLoaded: (loading: boolean) => void;
}) => {
  const { gl, raycaster, camera, mouse } = useThree();

  const [borders, setBorders] = useState<any[]>([]);
  const [shaps, setShapes] = useState<any[]>([]);
  const [scale, setScale] = useState<number>(0);
  const [depth, setDepth] = useState(0);
  const [labels, setLabels] = useState<any[]>([]);
  const [mapHsl, setMapHsl] = useState<any>(null);
  // 地图高度动画step
  const mapHeightCountRef = useRef(0);
  const parentRef = useRef<any>();
  const shapRef = useRef<any>();
  const isScrollingRef = useRef(false);
  const scrollTimeout = useRef<any>(null);
  const currMapName = useRef<string>("");
  const lastMapName = useRef<string>("");
  const clickMapName = useRef<string>("");

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

  useEffect(() => {
    if (cameraEnd) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cameraEnd]);

  useEffect(() => {
    if (prvince) {
      const loader = new THREE.FileLoader();
      // setMapLoaded(false);
      loader.load(
        `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${prvince}${
          prvince === "710000" ? "" : "_full"
        }`,
        function (data) {
          initMap(JSON.parse(data as string));
          setMapLoaded(true);
        }
      );
    }
  }, [prvince]);

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
          const hsl = { ...mapHsl };
          hsl.l += 0.2;
          child.material[0].color.setHSL(hsl.h, hsl.s, hsl.l);
        } else {
          const hsl = { ...mapHsl };
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
      });
    });
    const crossX = maxX - minX;
    const crossZ = maxZ - minZ;
    const compScale = (13 / Math.max(crossX, crossZ)) * 2;
    setScale(compScale);
    const depth = (0.12 * Math.max(crossX, crossZ)) / 2.96;
    mapTexture.repeat.set(1.5 * compScale, 1.5 * compScale);
    setDepth(depth);
    return {
      center: [totalX / total, totalZ / total],
      depth,
      scale: compScale,
    };
  };

  const initMap = (map: any) => {
    const { depth, center, scale } = getComputeData(map);

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
    map.features.forEach((elem: any, index1: number) => {
      const [centerX, centerZ] = projectionCenter(
        elem.properties.centroid || elem.properties.center
      ) as number[];
      labelArr.push({
        position: {
          x: centerX,
          y: depth,
          z: centerZ,
        },
        label: elem.properties.name,
      });
      const coordinates = elem.geometry.coordinates;
      coordinates.forEach((multiPolygon: any, index2: number) => {
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
            opacity: 0.7,
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
      });
    });
    setBorders(allBorders);
    setShapes(allShaps);
    setLabels(labelArr);
  };

  useFrame((_state, delta) => {
    // console.log(delta);
    mapHeightCountRef.current += delta / 4;
    mapTexture.offset.y = 1 - (mapHeightCountRef.current % 1);
  });

  if (!mapLoaded) {
    return <></>;
  }

  return (
    <>
      <object3D
        ref={parentRef}
        scale={scale}
        position={[0, -depth / 2 - 0.1, 0]}
      >
        {borders.map((i) => (
          <primitive object={i.line} key={i.name} />
        ))}
        <object3D ref={shapRef} onClick={(e: any) => e.stopPropagation()}>
          {shaps.map((i) => (
            <primitive object={i.mesh} key={i.name} rotation-x={-Math.PI / 2} />
          ))}
        </object3D>
      </object3D>
      <Name begin={cameraEnd} name={name} />
      <InstancedGridOfSquares begin={cameraEnd} />
      {cameraEnd && <Wave />}
      {cameraEnd && <OriginPoint position={{ x: 0, z: 0, y: 0 }} />}
      {cameraEnd && <AnimationRing />}
      {labels.map(({ position, label }: { position: any; label: string }) => (
        <PointLabel
          key={label}
          position={position}
          scale={1}
          label={label}
          visible={cameraEnd}
          weather={null}
          weatherBegin={cameraEnd}
        />
      ))}
      {cameraEnd &&
        labels.map(({ position, label }: { position: any; label: string }) => (
          <FlyLine key={label} position={position} />
        ))}
      {cameraEnd && (
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
