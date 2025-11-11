import { useEffect, useState, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import * as d3 from "d3";
import Name from "./components/Name";
import mapHeightPng from "../res/border.png";
import InstancedGridOfSquares from "../gltf/InstancedGridOfSquares";

const MapModel = ({
  prvince,
  name,
  setMapLoading,
}: {
  prvince: string;
  name: string;
  setMapLoading: (loading: boolean) => void;
}) => {
  const [borders, setBorders] = useState<any[]>([]);
  const [shaps, setShapes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(0);
  // const [composerBegin, setComposerBegin] = useState(false);
  // 地图高度动画step
  const mapHeightCountRef = useRef(0);
  const parentRef = useRef<any>();

  // 地图边缘纹理
  const [mapTexture] = useTexture([mapHeightPng]);
  mapTexture.wrapS = THREE.RepeatWrapping;
  mapTexture.wrapT = THREE.RepeatWrapping;
  mapTexture.magFilter = THREE.NearestFilter;
  mapTexture.colorSpace = THREE.SRGBColorSpace;
  mapTexture.rotation = Math.PI;

  // useEffect(() => {
  //   if (mapTexture) {
  //     setComposerBegin(true);
  //   }
  // }, [mapTexture]);

  useEffect(() => {
    if (prvince) {
      const loader = new THREE.FileLoader();
      setLoading(true);
      loader.load(
        `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${prvince}${
          prvince === "710000" ? "" : "_full"
        }`,
        function (data) {
          initMap(JSON.parse(data as string));
          setLoading(false);
          setMapLoading(false);
        }
      );
    }
  }, [prvince]);

  const initMap = (map: any) => {
    const { depth, center } = getComputeData(map);

    const allBorders: any[] = [];
    const allShaps: any[] = [];

    const projection2 = d3
      .geoMercator()
      .center(center) // 地图中心点坐标
      .scale(80)
      .translate([0, 0]);
    map.features.forEach((elem: any, index1: number) => {
      const coordinates = elem.geometry.coordinates;
      coordinates.forEach((multiPolygon: any, index2: number) => {
        multiPolygon.forEach((polygon: any, index3: number) => {
          const lineMaterial = new THREE.LineBasicMaterial({
            color: "white",
          });
          const shape = new THREE.Shape();
          const lineGeometry = new THREE.BufferGeometry();
          const positions = new Float32Array(polygon.length * 3);
          for (let i = 0; i < polygon.length; i++) {
            const [x, z] = projection2(polygon[i]) as number[];
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
          const material1 = new THREE.MeshBasicMaterial({
            color: "#1ba0d4ff",
          });
          lineGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
          );
          const line = new THREE.Line(lineGeometry, lineMaterial);
          allBorders.push({
            line,
            name: elem.properties.name + index1 + index2 + index3,
          });
          const mesh = new THREE.Mesh(geometry, [material, material1]);
          mesh.material[1].map = mapTexture;
          mapTexture.offset.y = 1.5;
          allShaps.push({
            mesh,
            name: elem.properties.name + index1 + index2 + index3,
          });
        });
      });
    });
    setBorders(allBorders);
    setShapes(allShaps);
  };

  const getComputeData: (map: any) => {
    depth: number;
    center: [number, number];
  } = (map) => {
    const center = map.features[0].properties.centroid;
    const projection1 = d3
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
            const [x, z] = projection1(polygon[i]) as number[];
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
    const compScale = 13 / Math.max(crossX, crossZ);
    setScale(compScale);
    const depth = (0.12 * Math.max(crossX, crossZ)) / 2.96;
    mapTexture.repeat.set(1.5 * compScale, 1.5 * compScale);
    return {
      center: [totalX / total, totalZ / total],
      depth,
    };
  };

  useFrame((_state, delta) => {
    // console.log(delta);
    mapHeightCountRef.current += delta / 4;
    mapTexture.offset.y = 1 - (mapHeightCountRef.current % 1);
  });

  if (loading) {
    return <></>;
  }

  return (
    <>
      <object3D ref={parentRef} scale={scale * 1.5}>
        {borders.map((i) => (
          <primitive object={i.line} key={i.name} />
        ))}
        {shaps.map((i) => (
          <primitive object={i.mesh} key={i.name} rotation-x={-Math.PI / 2} />
        ))}
      </object3D>
      <Name begin={!loading} name={name} />
      <InstancedGridOfSquares begin={true} />
    </>
  );
};

export default MapModel;
