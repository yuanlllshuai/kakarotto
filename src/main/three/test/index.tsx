import { Suspense, useEffect, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
} from '@react-three/drei';
import styles from './index.module.scss';
import * as THREE from 'three';
import mapPng from '@/assets/map6.png';

const mapSize = 3046 / 2;
const consoleNum = 0;

const getGrayColor= (r:number, g:number, b:number) =>{
  // 心理学灰度公式： Gray = R*0.299 + G*0.587 + B*0.114
  // 考虑精度：Gray = (R*299 + G*587 + B*114) / 1000
  // 考虑精度 + 速度：Gray = (R*38 + G*75 + B*15) >> 7
  return (r * 38 + g * 75 + b * 15) >> 7
}

const MapModel = () => {
  const geometryRef = useRef<any>();
  useEffect(() => {
    // const textureLoader = new THREE.TextureLoader();
    // const heightMap = textureLoader.load('/map6.png');
    const vertices = geometryRef.current.attributes.position.array;
    const img = new Image();
    img.src = mapPng;
    img.width = mapSize;
    img.height = mapSize;
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const context:any = canvas.getContext('2d');
      canvas.width = mapSize;
      canvas.height = mapSize;
      context.drawImage(img, 0, 0, mapSize, mapSize);
      const imageData = context.getImageData(0, 0, mapSize, mapSize).data;
      // const grayArr1 = [];
      // for (let i = 0; i < imageData.length;i+=4){
      //   grayArr1.push(imageData[i])
      // }
      // const grayArr2 = [];
      // for (let i = mapSize-1; i >=0;i-=1){
      //   for (let j = 0; j < mapSize; j++){
      //     grayArr2.push(grayArr1[i * mapSize + j]);
      //   }
      // }
      // // 将高度图数据映射到几何体
      // for (let i = 0, j = 0; i < vertices.length; i += 3,j+=1){
      //   const heightValue = (grayArr2[j] / 255)
      //   vertices[i + 2] = heightValue * 100;
      // }
      // for (let i = 0, j = 0; i < vertices.length; i += 3, j += 4) {
      //   const r = imageData[j];
      //   const g = imageData[j+1];
      //   const b = imageData[j + 2];
      //   const gray = getGrayColor(r, g, b);
      //   if (consoleNum<=100) {
      //     // console.log(gray===r)
      //     // consoleNum += 1;
      //   }
      //   const heightValue = (gray / 255); // 获取灰度值
      //   vertices[i + 2] = heightValue * 100; // 缩放高度
      // }
      for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
          const vertexIndex = (y * mapSize + x) * 3;
          const pixelIndex = ((mapSize - 1 - y) * mapSize + x) * 4; // 反转 y 轴
      
          // 调整 x 和 y 值,使原点在中心
          vertices[vertexIndex] = (x / (mapSize - 1) - 0.5) * mapSize; // x 坐标
          vertices[vertexIndex + 1] = (y / (mapSize - 1) - 0.5) * mapSize; // y 坐标
      
          // 映射高度值
          const heightValue = imageData[pixelIndex] / 255; // 使用红色通道的值
          vertices[vertexIndex + 2] = heightValue * 100; // 映射到 z 轴
        }
      }
      // for (let y = 0; y < mapSize; y++) {
      //   for (let x = 0; x < mapSize; x++) {
      //     const vertexIndex = (y * mapSize + x) * 3;
      //     const pixelIndex = (y * mapSize + x) * 4;
      //     const heightValue = imageData[pixelIndex] / 255;
      //     vertices[vertexIndex + 2] = heightValue * 100;
      //   }
      // }
      // console.log(heightMap)
      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }
  },[])
  return (
    // mesh &&<primitive object={mesh} scale={1} position={[0, 0, 0]} />
    <mesh scale={1} position={[0, 0, 0]}>
      <meshPhongMaterial
        color={0x00ff00}
        flatShading={false}
        side={THREE.DoubleSide}
      />
      <planeGeometry ref={geometryRef} args={[mapSize,mapSize,mapSize,mapSize]}/>
    </mesh>
  )
}


function Index() {

  const render = () => {
    return (
      <div className={styles.model}>
        <Canvas
          shadows
          camera={{ position: [mapSize, mapSize, mapSize],near:0.1,far:mapSize*10 }}
          scene={{
            background: new THREE.Color('rgb(2, 3, 34)'),
          }}
        >
          <axesHelper scale={mapSize} />
          <OrbitControls makeDefault />
          <ambientLight intensity={1} />
          <pointLight position={[mapSize, mapSize, mapSize]} decay={0} intensity={3} />
          {/* <directionalLight position={[100, 100, 100]} intensity={0.5} /> */}
          <Suspense fallback={<></>}>
            <MapModel/>
          </Suspense>
        </Canvas>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {render()}
    </div>
  )
}

export default Index;