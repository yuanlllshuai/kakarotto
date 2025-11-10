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
  const parentRef = useRef<any>();

  useEffect(() => {
    if (prvince) {
      const loader = new THREE.FileLoader();
      loader.load(
        `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${prvince}_full`,
        function (data) {
          initMap(JSON.parse(data as string));
        }
      );
    }
  }, [prvince]);

  const initMap = (map: any) => {
    console.log(map);
    const center = map.features[0].properties.centroid;
    const projection = d3
      .geoMercator()
      .center([center[0], center[1]])
      .scale(80)
      .translate([0, 0]);
    const allBorders: any[] = [];
    const allShaps: any[] = [];
    map.features.forEach((elem: any, index: number) => {
      const coordinates = elem.geometry.coordinates;
      coordinates.forEach((multiPolygon: any, ind: number) => {
        multiPolygon.forEach((polygon: any) => {
          const lineMaterial = new THREE.LineBasicMaterial({
            color: "white",
          });
          const shape = new THREE.Shape();
          const lineGeometry = new THREE.BufferGeometry();
          const positions = new Float32Array(polygon.length * 3);
          for (let i = 0; i < polygon.length; i++) {
            const [x, z] = projection(polygon[i]) as number[];
            if (i === 0) {
              shape.moveTo(x, -z);
            }
            shape.lineTo(x, -z);
            positions[i * 3] = x;
            positions[i * 3 + 1] = 1;
            positions[i * 3 + 2] = z;
          }
          const extrudeSettings = {
            depth: 1,
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
          allBorders.push({ line, name: elem.properties.name + index + ind });
          const mesh = new THREE.Mesh(geometry, [material, material1]);
          allShaps.push({ mesh, name: elem.properties.name + index + ind });
        });
      });
    });
    setBorders(allBorders);
    setShapes(allShaps);
  };

  return (
    <object3D ref={parentRef}>
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
          <axesHelper scale={5} />
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
            onChange={handleChange}
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
