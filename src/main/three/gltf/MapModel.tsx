import { useEffect, useState, useRef, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import {
  useGLTF,
  useTexture
} from '@react-three/drei';

import * as THREE from 'three';
import border from '../res/border.png';

import PointLabel from './PointLabel';
import FlyLine from './FlyLine';
import OriginPoint from './OriginPoint';
import InstancedGridOfSquares from './InstancedGridOfSquares';
import Wave from './Wave';

const MapModel = () => {
  const partRef = useRef();
  const { raycaster, camera, mouse } = useThree();
  const { scene } = useGLTF('/gltf_models/map/map14.gltf');
  // const { scene } = useGLTF('http://111.229.183.248/gltf_models/girl/scene.gltf');
  const [labelPosition, setLabelPosition] = useState<any>({ x: 0, y: 0, z: 0 });
  const [labelText, setLabelText] = useState('');
  const luminanceMap = useRef<any>({});
  const [labelScale, setLabelScale] = useState(1);
  const [showTag, setShowTag] = useState(false);

  const isDragging = useRef(false);
  const isConsole = useRef();
  const isClickDown = useRef(false);
  const clickNum = useRef(0);
  const showTagRef = useRef(false);
  const countRef = useRef(0);
  const gradientTextureRef = useRef<any>(null);
  const borderMesh = useRef<any>();
  const bottomY = useRef(0);
  const begin = useRef(false);
  // const borderTextureRef = useRef<any>(null);

  const [texture] = useTexture([border]);
  texture.repeat.set(1, 1);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.rotation = Math.PI;

  
  useEffect(() => {
    if (partRef.current) {
      console.log(scene)
      const luminances: any = {};
      (partRef.current as any).traverse((child: any) => {
        if (child.isMesh) {
          if (child.name.includes('市')) {
            child.material.side = THREE.DoubleSide;
            child.material.transparent = true;
            child.material.opacity = 0.7;
            const hsl = { h: 0, s: 0, l: 0 };
            child.material.color.getHSL(hsl);
            luminances[child.uuid] = { ...hsl };
            child.position.y -= 0.46;
          }
          // if (child.name.includes('挤压')) {
          //   child.material.side = THREE.DoubleSide;
          //   child.material.metalness = 0;
          //   // child.scale.x = 0.2;
          //   // child.scale.y = 0.2;
          //   child.position.y -= 0.11;
          //   dealBorderLine(child);
          // }
          if (child.name.includes('河南边界')) {
            borderMesh.current = child;
            bottomY.current = child.position.y;
            borderMesh.current.scale.y = 0.01;
            borderMesh.current.position.y -= 0.27;
            dealBorder(child);
            // const geometryHeight = child.geometry.boundingBox.max.y - child.geometry.boundingBox.min.y;
            // console.log(geometryHeight,child.scale.y)
            // child.position.y -=geometryHeight/2;

          }
          // if (child.name.includes('河南地块')) {
            
          //   // dealBorder(child);
          // }
          if (child.name === '底') {
            child.material.transparent = true;
            child.material.opacity = 0;
          }
          if (child.name === '底边界') {
            child.material.transparent = true;
            child.material.opacity = 0.3;
          }
        }
      });
      luminanceMap.current = luminances;
      setTimeout(() => {
        begin.current = true;
      },2000)
    }
  }, [partRef.current]);

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const dealBorderLine = (mesh: any) => {
    // console.log(222,mesh)
    // const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry);
    // const lineGeometry = new THREE.BufferGeometry();
    // const positions = edgesGeometry.attributes.position.array;
    // lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // // 创建描线材质
    // const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
    // // 创建描线网格
    // const line = new THREE.LineSegments(lineGeometry, lineMaterial);
    // // line.geometry.lineW
    // line.position.copy(mesh.position);
    // line.rotation.copy(mesh.rotation);
    // line.scale.copy(mesh.scale);
    // line.position.y = 0.56;
    // setBorderLine(line);

    // const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry);
    // const positions = edgesGeometry.attributes.position.array;

    // const newVertices: any = [];
    // const newIndices = [];
    // const numPoints = positions.length / 3;

    // for (let i = 0; i < numPoints; i++) {
    //   const point = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    //   const nextPoint = new THREE.Vector3(
    //     positions[((i + 1) % numPoints) * 3],
    //     positions[((i + 1) % numPoints) * 3 + 1],
    //     positions[((i + 1) % numPoints) * 3 + 2]
    //   );
    //   const direction = nextPoint.clone().sub(point).normalize();
    //   const normal = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
    //   const offset = normal.clone().multiplyScalar(1); // 调整宽度

    //   newVertices.push(point.clone().add(offset).toArray());
    //   newVertices.push(point.clone().sub(offset).toArray());

    //   newIndices.push(i * 2, i * 2 + 1, ((i + 1) % numPoints) * 2);
    //   newIndices.push(((i + 1) % numPoints) * 2, i * 2 + 1, ((i + 1) % numPoints) * 2 + 1);
    // }

    // const ringGeometry = new THREE.BufferGeometry();
    // ringGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newVertices, 3));
    // ringGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(newIndices), 1));

    // const ringMaterial = new THREE.MeshBasicMaterial({ color: '#FFF', side: THREE.DoubleSide });
    // const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    // ring.position.copy(mesh.position);
    // ring.rotation.copy(mesh.rotation);
    // ring.scale.copy(mesh.scale);
    // ring.position.y = 0.56;

    // setBorderLine(ring);

    // 创建渐变纹理
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context: any = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, 'blue');
    gradient.addColorStop(0.3, 'blue');
    gradient.addColorStop(1, 'white');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    const gradientTexture = new THREE.CanvasTexture(canvas);
    gradientTexture.wrapS = THREE.RepeatWrapping;
    gradientTexture.wrapT = THREE.RepeatWrapping;
    gradientTexture.repeat.set(1, 1);
    gradientTextureRef.current = gradientTexture;
    mesh.material.map = gradientTexture;
  }

  const dealBorder = (mesh: any) => {
    // mesh.material.color= new THREE.Color('#FFF')
    mesh.material.map = texture;
    mesh.material.metalness = 0;
  }

  const handleMouseDown = (event: any) => {
    event.preventDefault();
    isDragging.current = false;
    isClickDown.current = true;
  };

  const handleMouseMove = (event: any) => {
    event.preventDefault();
    if (isClickDown.current) {
      isDragging.current = true;
    }
  };

  const handleMouseUp = (event: any) => {
    event.preventDefault();
    if (!isDragging.current||clickNum.current===0) {
      handleClick(event);
      clickNum.current += 1;
    }
    isDragging.current = false;
    isClickDown.current = false;
  };

  // 处理点击事件
  const handleClick = (event: any) => {
    event.preventDefault();
    raycaster.setFromCamera(mouse, camera);
    if (!partRef.current) {
      return;
    }
    const intersects = raycaster.intersectObjects(scene.children[2].children[0].children);
    if (intersects.length > 0) {
      const intersect: any = intersects[0];
      if (intersect.object.name.includes('市')) {
        setShowTag(false);
        showTagRef.current = false;
        setTimeout(() => {
          setShowTag(true);
          showTagRef.current = true;
          setLabelPosition(intersect.point);
        },300)
        setMeshColor(intersect.object.uuid)
        setLabelText(intersect.object.name);
      }
    }
  };

  const setMeshColor = (uuid: string) => {
    if (partRef.current) {
      (partRef.current as any).children[2].children[0].children.forEach((child: any) => {
        if (child.isMesh && child.name.includes('市')) {
          if (child.uuid === uuid) {
            if (isConsole.current !== child.uuid) {
              // console.log(child);
              isConsole.current = child.uuid;
            }
            const hsl = { ...luminanceMap.current[child.uuid] };
            hsl.l += 0.2;
            child.material.color.setHSL(hsl.h, hsl.s, hsl.l);
          } else {
            const hsl = { ...luminanceMap.current[child.uuid] };
            child.material.color.setHSL(hsl.h, hsl.s, hsl.l);
          }
        }
      });
    }
  }

  // const createLine = (position: any) => {
  //   const curve = new THREE.CubicBezierCurve3(
  //     new THREE.Vector3(0, 0.8, 0),
  //     new THREE.Vector3(0, 0, 0),
  //     new THREE.Vector3(0, 4, 0),
  //     new THREE.Vector3(position.x, 0.8, position.z)
  //   );
  //   const points = curve.getPoints(200);
  //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
  //   const material = new THREE.MeshPhongMaterial({ color: 'red', flatShading: true });
  //   const line = new THREE.Line(geometry, material);
  // }

  useFrame((state, delta) => {
    if (labelPosition) {
      // 缩放
      const vector = new THREE.Vector3().copy(labelPosition).sub(camera.position)
      const distance = vector.length()
      const newScale = 1 / (distance / 10)
      setLabelScale(Math.max(0.7, Math.min(0.8, newScale)));
    }

    countRef.current += 0.01;
    texture.offset.y = 1 - countRef.current % 1;
    
    if (gradientTextureRef.current) {
      gradientTextureRef.current.offset.x += 0.005;
      gradientTextureRef.current.needsUpdate = true;
      // const positions = borderLine.geometry.attributes.position.array;
      // const numVertices = positions.length / 3;
      // for (let i = 0; i < numVertices; i++) {
      //   const angle = ((i + countRef.current) / numVertices) * Math.PI * 2;
      //   const x = positions[i * 3] + Math.cos(angle) * 0.1; // 添加一些偏移
      //   const y = positions[i * 3 + 1] + Math.sin(angle) * 0.1; // 添加一些偏移
      //   const z = positions[i * 3 + 2];

      //   positions[i * 3] = x;
      //   positions[i * 3 + 1] = y;
      //   positions[i * 3 + 2] = z;
      //   // 更新描线几何体的顶点位置
      //   borderLine.geometry.attributes.position.needsUpdate = true;
      // }
    }
    if (begin.current) {
      const pending = 0.5;
      const times = pending / delta;
      
      if (borderMesh.current && borderMesh.current.scale.y < 1) {
        const speed = 1 / times;
        // borderMesh.current.scale.y = countRef.current;
        borderMesh.current.scale.y += speed;
      }
      if (borderMesh.current && borderMesh.current.position.y < bottomY.current / 2) {
        const speed= 0.27 / times
        // borderMesh.current.position.y +=0.01;
        borderMesh.current.position.y += speed;
        // console.log(borderMesh.current.position.y)

        const speed2 = 0.48 / times;
        (partRef.current as any).children[2].children[0].children.forEach((child: any) => {
          if (child.isMesh && child.name.includes('市')) { 
            child.position.y += speed2;
          }
        })
      }
    }
    // if (countRef.current<=0.8) {
    //   scene.children[2].children[0].children.map(i => {
    //     i.position.y += countRef.current / 2;
    //   })
    // }
    // if (borderMesh.current&&countRef.current<=0.6) {
    //   borderMesh.current.position.y += countRef.current*2;
    // }
    // if (partRef.current) {
    //   const speed = 0.4 / times;
    //   (partRef.current as any).traverse((child: any) => {
    //     if (child.isMesh) {
    //       if (child.name.includes('市')&& child.position.y<=0.2) { 
    //         child.position.y += speed;
    //       }
    //     }
    //   })
    // }
  })
  return (
    <>
      <primitive ref={partRef} object={scene} scale={1} position={[0, -22, 0]} />
      {
        labelPosition.x !== 0 && (
          <PointLabel
            position={labelPosition}
            scale={labelScale}
            label={labelText}
            visible={showTag}
          />
        )
      }
      {
        labelPosition.x !== 0 &&<FlyLine position={labelPosition} />
      }
      <OriginPoint />
      <InstancedGridOfSquares />
      <Wave />
      {/* {borderLine && <primitive object={borderLine} />} */}
    </>
  )
}

export default MapModel;