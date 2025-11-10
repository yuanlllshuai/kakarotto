import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import styles from "./index.module.scss";
import * as THREE from "three";
import ScreenFull from "@/components/ScreenFull";
import * as d3 from "d3";
import { Select } from "antd";

const { Option } = Select;

const MapModel = ({ prvince }: { prvince: string }) => {
  const [borders, setBorders] = useState<any[]>([]);
  const [shaps, setShapes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(0);

  const parentRef = useRef<any>();

  useEffect(() => {
    if (prvince) {
      const loader = new THREE.FileLoader();
      setLoading(true);
      loader.load(
        `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${prvince}_full`,
        function (data) {
          initMap(JSON.parse(data as string));
          setLoading(false);
        }
      );
    }
  }, [prvince]);

  const initMap = (map: any) => {
    // console.log(map);
    const center = map.features[0].properties.centroid;
    const projection1 = d3
      .geoMercator()
      .center([center[0], center[1]])
      .scale(80)
      .translate([0, 0]);
    const allBorders: any[] = [];
    const allShaps: any[] = [];
    let minX = 0;
    let maxX = 0;
    let minZ = 0;
    let maxZ = 0;
    let totalX = 0;
    let totalZ = 0;
    let total = 0;
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
    setScale(13 / Math.max(crossX, crossZ));
    const depth = (0.12 * Math.max(crossX, crossZ)) / 2.96;
    const projection2 = d3
      .geoMercator()
      .center([totalX / total, totalZ / total])
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
            color: "#02A1E2",
            transparent: true,
            opacity: 0.6,
          });
          const material1 = new THREE.MeshBasicMaterial({
            color: "#3480C4",
            transparent: true,
            opacity: 0.5,
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

  if (loading) {
    return <></>;
  }

  return (
    <object3D ref={parentRef} scale={scale}>
      {borders.map((i) => (
        <primitive object={i.line} key={i.name} />
      ))}
      {shaps.map((i) => (
        <primitive object={i.mesh} key={i.name} rotation-x={-Math.PI / 2} />
      ))}
    </object3D>
  );
};

function Index() {
  const [prvinces, setPrvinces] = useState<any[]>([]);
  const [prvince, setPrvince] = useState<string>("");

  useEffect(() => {
    const loader = new THREE.FileLoader();
    loader.load(
      "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
      function (data) {
        const prvinceOptions = JSON.parse(data as string).features.map(
          (i: any) => ({
            adcode: i.properties.adcode + "",
            name: i.properties.name,
          })
        );
        setPrvince(prvinceOptions?.[0]?.adcode);
        setPrvinces(prvinceOptions);
      }
    );
  }, []);

  const handleChange = (value: string) => {
    setPrvince(value);
  };

  const render = () => {
    return (
      <div className={styles.model}>
        <Canvas
          shadows
          camera={{ position: [0, 10, 10], near: 0.1, far: 1000 }}
          scene={{
            background: new THREE.Color("rgb(2, 3, 34)"),
          }}
        >
          {/* <axesHelper scale={10} /> */}
          <OrbitControls makeDefault />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} decay={0} intensity={3} />
          {/* <directionalLight position={[100, 100, 100]} intensity={0.5} /> */}
          <Suspense fallback={<></>}>
            <MapModel prvince={prvince} />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div className={styles.container} id="province-map-container">
      <ScreenFull containerId="province-map-container">{render()}</ScreenFull>
      {prvinces.length !== 0 && (
        <div className={styles.select}>
          <Select
            value={prvince}
            style={{ width: 120 }}
            showSearch
            onChange={handleChange}
            filterOption={(input, option: any) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {prvinces.map(({ name, adcode }) => (
              <Option value={adcode} key={adcode}>
                {name}
              </Option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
}

export default Index;
