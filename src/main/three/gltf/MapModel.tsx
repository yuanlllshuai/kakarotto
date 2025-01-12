import { useEffect, useState, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import {
  useGLTF,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';

import PointLabel from './PointLabel';
import FlyLine from './FlyLine';
import OriginPoint from './OriginPoint';
import InstancedGridOfSquares from './InstancedGridOfSquares';
import Wave from './Wave';
import Name from './Name';

import mapHeightPng from '../res/border.png';

const MapModel = ({begin}:any) => {
  const { raycaster, camera, mouse } = useThree();
  const { scene } = useGLTF('/gltf_models/map/map.gltf');
  // const { scene } = useGLTF('http://111.229.183.248/gltf_models/girl/scene.gltf');
  const [labelPosition, setLabelPosition] = useState<any>({ x: 0, y: 0, z: 0 });
  const [labelText, setLabelText] = useState('');
  // 标签缩放比例
  const [labelScale, setLabelScale] = useState(1);
  // 是否展示标签
  const [showTag, setShowTag] = useState(false);
  // const [borderLine, setBorderLine] = useState<any>({});
  // 流光轨迹
  const [flowLight, setFlowLight] = useState<any>();
  // 流光纹理
  const [flowLightTexture, setFlowLightTexture] = useState<any>();

  const [borderLine, setBorderLine] = useState<any>();

  // 地图ref
  const partRef = useRef();
  // 地图原始颜色
  const blockColorMapRef = useRef<any>({});
  // 鼠标是否移动中
  const isDraggingRef = useRef(false);
  // 鼠标是否按下
  const isClickDownRef = useRef(false);
  // 点击次数
  const clickNumRef = useRef(0);
  // 延迟显示label
  const showTagRef = useRef(false);
  // 地图高度动画step
  const mapHeightCountRef = useRef(0);
  // 地图边沿动画step
  const mapBorderCountRef = useRef(0);
  // 地图高度边缘
  const borderMeshRef = useRef<any>();
  // 地图原始高度
  const mapOriginHeightRef = useRef(0);
  // 是否开始动画
  const beginRef = useRef(false);

  // 地图边缘纹理
  const [mapTexture] = useTexture([mapHeightPng]);
  mapTexture.repeat.set(1, 1);
  mapTexture.wrapS = THREE.RepeatWrapping;
  mapTexture.wrapT = THREE.RepeatWrapping;
  mapTexture.magFilter = THREE.NearestFilter;
  mapTexture.colorSpace = THREE.SRGBColorSpace;
  mapTexture.rotation = Math.PI;

  useEffect(() => {
    if (partRef.current) {
      // console.log(scene)
      const blockColors: any = {};
      (partRef.current as any).traverse((child: any) => {
        if (child.isMesh) {
          if (child.name.includes('市')) {
            const hsl = { h: 0, s: 0, l: 0 };
            child.material.color.getHSL(hsl);
            blockColors[child.uuid] = { ...hsl };
            dealCity(child);
          }
          if (child.name.includes('河南边界')) {
            dealBorder(child);
          }
          if (child.name.includes('挤压')) {
            dealFlowLight(child);
          }
          if (child.name.includes('光柱')) {
            child.visible = false;
          }
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
      blockColorMapRef.current = blockColors;
      // setTimeout(() => {
      //   beginRef.current = true;
      // },1000)
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

  useEffect(() => {
    if (begin) {
      beginRef.current = true;
    }
  },[begin])

  // 处理市区
  const dealCity = (mesh: any) => {
    mesh.material.side = THREE.DoubleSide;
    mesh.material.transparent = true;
    mesh.material.opacity = 0.7;
    mesh.position.y -=0.46;
  }

  const filterPoints = (points: any) => {
    const offsetX = 0.6;
    const offsetY = 0.8;
    const numPoints = points.length / 3;
    const vertices = [new THREE.Vector3(points[0], points[1], points[2])];
    let errorIndex = null;
    let isError = false;
    let i = 1;
    while (i < numPoints) {
      const beginIndex = errorIndex || i;
      const prevX = points[(beginIndex - 1) * 3];
      const prevY = points[(beginIndex - 1) * 3 + 1];

      const currX = points[i * 3];
      const currY = points[i * 3 + 1];
      const currZ = points[i * 3 + 2];

      if (Math.abs(currX - prevX) > offsetX || Math.abs(currY - prevY) > offsetY) {
        i += 1;
        isError = true;
      } else {
        i += 1;
        if (isError) {
          isError=false
        } else {
          vertices.push(new THREE.Vector3(currX, currY, currZ))
        }
        errorIndex = i;
      }
    }
    return vertices;
  }

  // 生成流光
  const dealFlowLight = (mesh: any) => {
    const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry);
    const positions = edgesGeometry.attributes.position.array;
    // console.log(edgesGeometry.attributes.position.count)
    const vertices = filterPoints(positions);
    const len = vertices.length;
    // console.log(len)
    const curve = new THREE.CatmullRomCurve3(vertices, false);
    const points = curve.getPoints(len);
    const smoothCurve = new THREE.CatmullRomCurve3(points, false); 
    const tubeGeometry = new THREE.TubeGeometry(smoothCurve, len, 0.08, 8, false);
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 100;
    const context = canvas.getContext('2d')!;
    const gradient = context.createLinearGradient(0, 0, 0, 100);
    const createGradient = (gradient: any, color: string) => {
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.1, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.2, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.4, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.6, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.7, 'rgba(255,255,255,0)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
    }
    createGradient(gradient,'#A020F0');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1, 100);
    const texture = new THREE.CanvasTexture(canvas);
    texture.repeat.set(0, 1);
    texture.wrapS = THREE.RepeatWrapping; // 防止拉伸
    texture.wrapT = THREE.RepeatWrapping; // 防止拉伸
    texture.rotation = Math.PI / 2;
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false
    }) 
    setFlowLightTexture(texture)
    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    tubeMesh.position.copy(mesh.position);
    tubeMesh.rotation.copy(mesh.rotation);
    tubeMesh.scale.copy(mesh.scale);
    tubeMesh.position.y = -0.46;
    // tubeMesh.position.y -= 0.46;
    setFlowLight(tubeMesh);

    // 边缘线
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
    const line = new THREE.LineSegments(lineGeometry, lineMaterial);
    line.position.copy(mesh.position);
    line.rotation.copy(mesh.rotation);
    line.scale.copy(mesh.scale);
    line.position.y = 0.56;
    setBorderLine(line);
  }

  const dealBorder = (mesh: any) => {
    mesh.material.map = mapTexture;
    mesh.material.metalness = 0;
    borderMeshRef.current = mesh;
    mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.28, 0));
    mapOriginHeightRef.current = mesh.position.y;
    borderMeshRef.current.scale.y = 0.01;
    borderMeshRef.current.position.y = -0.8;
  }

  const handleMouseDown = (event: any) => {
    event.preventDefault();
    isDraggingRef.current = false;
    isClickDownRef.current = true;
  };

  const handleMouseMove = (event: any) => {
    event.preventDefault();
    if (isClickDownRef.current) {
      isDraggingRef.current = true;
    } else {
      isDraggingRef.current = false;
    }
  };

  const handleMouseUp = (event: any) => {
    event.preventDefault();
    if (!isDraggingRef.current || clickNumRef.current === 0) {
      handleClick(event);
      clickNumRef.current += 1;
    }
    isDraggingRef.current = false;
    isClickDownRef.current = false;
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
            const hsl = { ...blockColorMapRef.current[child.uuid] };
            hsl.l += 0.2;
            child.material.color.setHSL(hsl.h, hsl.s, hsl.l);
          } else {
            const hsl = { ...blockColorMapRef.current[child.uuid] };
            child.material.color.setHSL(hsl.h, hsl.s, hsl.l);
          }
        }
      });
    }
  }

  useFrame((_state, delta) => {
    if (labelPosition) {
      // 缩放
      const vector = new THREE.Vector3().copy(labelPosition).sub(camera.position)
      const distance = vector.length()
      const newScale = 1 / (distance / 10)
      setLabelScale(Math.max(0.7, Math.min(0.8, newScale)));
    }

    // 地图边缘纹理动画
    mapHeightCountRef.current += 0.01;
    mapTexture.offset.y = 1 - mapHeightCountRef.current % 1;

    // 流光动画
    if (flowLightTexture) {
      mapBorderCountRef.current += 0.0005;
      flowLightTexture.offset.y = 1 - mapBorderCountRef.current % 1;
    }
    
    // 地图厚度动画
    if (beginRef.current) {
      const pending = 0.5;
      const times = pending / delta;
      
      if (borderMeshRef.current && borderMeshRef.current.scale.y < 1) {
        const speed = 1 / times;
        // 地图厚度增加
        borderMeshRef.current.scale.y += speed;
        const speed2 = 0.96 / times;
        // 地面高度增加
        (partRef.current as any).children[2].children[0].children.forEach((child: any) => {
          if (child.isMesh && child.name.includes('市')) { 
            child.position.y += speed2;
          }
        })
        // 流光高度增加
        flowLight.position.y += speed2;
      }
    }
  })
  return (
    <>
      <primitive ref={partRef} object={scene} scale={1} position={[0, -22, 0]} />
      <PointLabel
        position={labelPosition}
        scale={labelScale}
        label={labelText}
        visible={showTag}
      />
      {
        labelPosition.x !== 0 &&<FlyLine position={labelPosition} />
      }
      <OriginPoint />
      <InstancedGridOfSquares />
      <Wave />
      {/* {borderLine && <primitive object={borderLine} />} */}
      {flowLight && (<primitive object={flowLight} />)}
      <Name begin={ begin} />
    </>
  )
}

export default MapModel;