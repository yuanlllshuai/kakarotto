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
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Progress } from "antd";
import AnimateCard from "@/components/AnimateCard";

const { Option } = Select;

const Camera = memo(
  ({
    setCameraEnd,
    begin,
  }: {
    setCameraEnd: (isEnd: boolean) => void;
    begin: boolean;
  }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const tweenRef = useRef<any>(null);

    useEffect(() => {
      if (!begin) {
        setCameraEnd(false);
        return;
      }
      const beginPos = [-12, 12, 16];
      const endPos = [0, 10, 26];
      const startPoint = new THREE.Vector3(...beginPos);
      const endPoint = new THREE.Vector3(...endPos);

      tweenRef.current = new TWEEN.Tween(startPoint)
        .to(endPoint, 3000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate((position) => {
          if (cameraRef.current) {
            cameraRef.current.position.copy(position);
          }
        })
        .onComplete(() => {
          setCameraEnd(true);
        })
        .start();
    }, [begin]);

    useFrame(() => {
      if (tweenRef.current) {
        tweenRef.current.update();
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
  }
);

type Prvince = {
  adcode: string;
  name: string;
};

function Index() {
  const [prvinces, setPrvinces] = useState<Prvince[]>([]);
  const [prvince, setPrvince] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [cameraEnd, setCameraEnd] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [lastAnimationEnd, setLastAnimationEnd] = useState<boolean>(false);

  useEffect(() => {
    const loader = new THREE.FileLoader();
    loader.load(
      "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
      function (data) {
        const prvinceOptions = JSON.parse(data as string)
          .features.map((i: Record<string, any>) => ({
            adcode: i.properties.adcode + "",
            name: i.properties.name,
          }))
          .filter((i: Prvince) => !!i.name);
        setPrvince(prvinceOptions?.[0]?.adcode);
        setName(prvinceOptions?.[0]?.name);
        setPrvinces(prvinceOptions);
      }
    );
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      // 虚假的进度条
      setProgress(50);
      setTimeout(() => {
        setProgress(99);
      }, 500);
      setTimeout(() => {
        setProgress(100);
      }, 1000);
    }
  }, [mapLoaded]);

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
          <Camera setCameraEnd={setCameraEnd} begin={mapLoaded} />
          {/* <axesHelper scale={20} /> */}
          <OrbitControls
            makeDefault
            enableRotate={cameraEnd}
            enableZoom={cameraEnd}
          />
          <ambientLight intensity={3} />
          <Suspense fallback={<></>}>
            <MapModel
              prvince={prvince}
              name={name}
              cameraEnd={cameraEnd}
              mapLoaded={mapLoaded}
              setMapLoaded={setMapLoaded}
              setLastAnimationEnd={setLastAnimationEnd}
            />
          </Suspense>
          <EffectComposer>
            <Bloom
              intensity={1.0} // The bloom intensity.
              mipmapBlur
              luminanceThreshold={1}
            />
          </EffectComposer>
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
            getPopupContainer={() =>
              document.getElementById("province-map-container") as HTMLElement
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
      {progress !== 100 && (
        <div className={styles.loading}>
          <div style={{ width: "80%" }}>
            <Progress percent={progress} showInfo={false} />
          </div>
        </div>
      )}
      <AnimateCard begin={lastAnimationEnd} />
    </div>
  );
}

export default Index;
