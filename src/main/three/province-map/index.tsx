import { Suspense, useEffect, useState, useRef, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import styles from "./index.module.scss";
import * as THREE from "three";
import ScreenFull from "@/components/ScreenFull";
import { Select } from "antd";
import * as TWEEN from "@tweenjs/tween.js";
import MapModel from "./MapModel";

const { Option } = Select;

const Camera = memo(({ setBegin, loading }: any) => {
  const cameraRef = useRef<any>(null);
  const tweenRef = useRef<any>(null);

  useEffect(() => {
    if (loading) return;
    const beginPos = [-18, 12, 12];
    const endPos = [-10, 10, 20];
    const startPoint = new THREE.Vector3(...beginPos);
    const endPoint = new THREE.Vector3(...endPos);

    tweenRef.current = new TWEEN.Tween(startPoint)
      .to(endPoint, 3000) // 3 seconds duration
      .easing(TWEEN.Easing.Cubic.InOut) // Cubic easing function
      .onUpdate((position) => {
        if (cameraRef.current) {
          cameraRef.current.position.copy(position);
        }
      })
      .onComplete(() => {
        setBegin(true);
      })
      .start();
  }, [loading]);

  useFrame(() => {
    if (tweenRef.current) {
      tweenRef.current.update(); // Update tween animations
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        args={[75, window.innerWidth / window.innerHeight, 0.1, 1000]}
        position={[-18, 12, 12]}
      />
    </>
  );
});

function Index() {
  const [prvinces, setPrvinces] = useState<any[]>([]);
  const [prvince, setPrvince] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [begin, setBegin] = useState<boolean>(false);

  useEffect(() => {
    const loader = new THREE.FileLoader();
    loader.load(
      "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
      function (data) {
        const prvinceOptions = JSON.parse(data as string)
          .features.map((i: any) => ({
            adcode: i.properties.adcode + "",
            name: i.properties.name,
          }))
          .filter((i: any) => !!i.name);
        setPrvince(prvinceOptions?.[0]?.adcode);
        setName(prvinceOptions?.[0]?.name);
        setPrvinces(prvinceOptions);
      }
    );
  }, []);

  const handleChange = (value: string, other: any) => {
    setPrvince(value);
    setName(other.children);
  };

  const render = () => {
    return (
      <div className={styles.model}>
        <Canvas
          scene={{
            background: new THREE.Color("rgb(2, 3, 34)"),
          }}
        >
          <Camera begin={begin} setBegin={setBegin} loading={loading} />
          <OrbitControls makeDefault enableRotate={begin} enableZoom={begin} />
          <ambientLight intensity={3} />
          <Suspense fallback={<></>}>
            <MapModel
              prvince={prvince}
              name={name}
              setMapLoading={setLoading}
            />
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
            style={{ width: 160 }}
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
