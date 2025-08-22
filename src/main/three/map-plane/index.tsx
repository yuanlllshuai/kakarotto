import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import styles from "./index.module.scss";
import * as THREE from "three";
import mapPng from "@/assets/local.jpg";
import ScreenFull from "@/components/ScreenFull";

const mapSize = 1000;
const segments = mapSize - 1;

// const getGrayColor= (r:number, g:number, b:number) =>{
//   // 心理学灰度公式： Gray = R*0.299 + G*0.587 + B*0.114
//   // 考虑精度：Gray = (R*299 + G*587 + B*114) / 1000
//   // 考虑精度 + 速度：Gray = (R*38 + G*75 + B*15) >> 7
//   return (r * 38 + g * 75 + b * 15) >> 7
// }

const MapModel = () => {
  const geometryRef = useRef<any>();

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    const vertices = geometryRef.current.attributes.position.array;
    const loader = new THREE.TextureLoader();
    loader.load(mapPng, function (texture) {
      const canvas = document.createElement("canvas");
      const context: any = canvas.getContext("2d");
      canvas.width = mapSize;
      canvas.height = mapSize;
      context.drawImage(texture.image, 0, 0, mapSize, mapSize);
      const imageData = context.getImageData(0, 0, mapSize, mapSize).data;
      for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
          const vertexIndex = (y * mapSize + x) * 3;
          const pixelIndex = (y * mapSize + x) * 4;
          const heightValue = imageData[pixelIndex] / 255;
          vertices[vertexIndex + 2] = heightValue * 100;
        }
      }
      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    });
  };

  return (
    <mesh scale={1} position={[0, 0, 0]}>
      <meshPhongMaterial
        color={0x00ff00}
        flatShading={false}
        side={THREE.DoubleSide}
      />
      <planeGeometry
        ref={geometryRef}
        args={[mapSize, mapSize, segments, segments]}
      />
    </mesh>
  );
};

function Index() {
  const render = () => {
    return (
      <div className={styles.model}>
        <img src={mapPng} alt="" className={styles.img} />
        <Canvas
          shadows
          camera={{
            position: [mapSize, mapSize, mapSize],
            near: 0.1,
            far: mapSize * 10,
          }}
          scene={{
            background: new THREE.Color("rgb(2, 3, 34)"),
          }}
        >
          <axesHelper scale={mapSize} />
          <OrbitControls makeDefault />
          <ambientLight intensity={1} />
          <pointLight
            position={[mapSize, mapSize, mapSize]}
            decay={0}
            intensity={3}
          />
          <pointLight
            position={[-mapSize, mapSize, -mapSize]}
            decay={0}
            intensity={3}
          />
          {/* <directionalLight position={[100, 100, 100]} intensity={0.5} /> */}
          <Suspense fallback={<></>}>
            <MapModel />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div className={styles.container} id="map-plane-container">
      <ScreenFull containerId="map-plane-container">{render()}</ScreenFull>
    </div>
  );
}

export default Index;
