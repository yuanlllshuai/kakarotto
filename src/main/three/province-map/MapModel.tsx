import { useEffect, useState, useRef, memo } from "react";
import { useTexture, CycleRaycast } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import * as d3 from "d3";
import Name from "./components/Name";
import LightCylinder from "./components/LightCylinder";
import mapHeightPng from "../res/border.png";
import InstancedGridOfSquares from "../gltf/InstancedGridOfSquares";
import Wave from "../gltf/Wave";
import OriginPoint from "../gltf/OriginPoint";
import AnimationRing from "../gltf/AnimationRing";
import PointLabel from "../gltf/PointLabel";
import FlyLine from "../gltf/FlyLine";
import * as TWEEN from "@tweenjs/tween.js";
import { Props, Border, Shape, Label } from "./type";

const MapModel = memo(
  ({
    prvince,
    name,
    cameraEnd,
    mapLoaded,
    openWeather,
    setMapLoaded,
    setLastAnimationEnd,
  }: Props) => {
    const { gl, raycaster, camera, mouse } = useThree();

    // 地图区块边线Line
    const [borders, setBorders] = useState<Border[]>([]);
    // 地图区块Mesh
    const [shaps, setShapes] = useState<Shape[]>([]);
    // 地图缩放比例（不同省份面积大小不同）
    const [scale, setScale] = useState<number>(0);
    // 地图厚度
    const [depth, setDepth] = useState<number>(0);
    // 位置标签信息
    const [labels, setLabels] = useState<Label[]>([]);
    // 地图颜色
    const [mapHsl, setMapHsl] = useState<THREE.HSL | null>(null);
    // 地图厚度动画是否结束
    const [mapDepthEnd, setMapDepthEnd] = useState<boolean>(false);
    // 边界流光轨迹
    const [flowLight, setFlowLight] = useState<THREE.Mesh[]>([]);
    // 边界流光纹理
    const [flowLightTexture, setFlowLightTexture] = useState<
      THREE.CanvasTexture[]
    >([]);
    // 区块边界流光轨迹
    const [blockFlowLight, setBlockFlowLight] = useState<THREE.Mesh[]>([]);
    // 区块边界流光纹理
    const [blockFlowLightTexture, setBlockFlowLightTexture] = useState<
      THREE.CanvasTexture[]
    >([]);
    // 展示区域名称
    const [showName, setShowName] = useState<string>("");

    const lastPrvince = useRef<string>("");
    // 地图厚度动画step
    const mapDepthCountRef = useRef(0);
    const parentRef = useRef<any>();
    const shapRef = useRef<any>();
    // 当前是否处于滚轮滚动状态
    const isScrollingRef = useRef(false);
    // 滚动事件防抖定时器
    const scrollTimeout = useRef<any>(null);
    // 记录当前高亮区块名称
    const currMapName = useRef<string>("");
    // 记录前一次高亮区块名称
    const lastMapName = useRef<string>("");
    // 记录当前点击后的高亮区块名称
    const clickMapName = useRef<string>("");
    // 地图上升动画
    const tweenBeginRef = useRef<any>(null);
    // 地图下降动画
    const tweenEndRef = useRef<any>(null);
    // 地图颜色
    const mapHslRef = useRef<THREE.HSL | null>(null);

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

    // 增加鼠标移动事件
    useEffect(() => {
      if (cameraEnd) {
        window.addEventListener("mousemove", handleMouseMove);
      }
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, [cameraEnd]);

    // 相机动画结束后开启地图厚度动画
    useEffect(() => {
      if (cameraEnd && scale !== 0) {
        if (!lastPrvince.current) {
          setMapDepthAnimation();
        } else {
          setTimeout(() => {
            setMapDepthAnimation();
          }, 500);
        }
      }
    }, [cameraEnd, scale]);

    // 省份切换后获取地图坐标数据
    useEffect(() => {
      if (prvince) {
        setMapDepthEnd(false);
        const loader = new THREE.FileLoader();
        // 地图边界及区块坐标
        loader.load(
          `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${prvince}${
            prvince === "710000" ? "" : "_full"
          }`,
          function (data1) {
            // 地图边界坐标，主要用于绘制地图边界流光效果
            loader.load(
              `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${prvince}`,
              function (data2) {
                if (!lastPrvince.current) {
                  initMap(
                    JSON.parse(data1 as string),
                    JSON.parse(data2 as string)
                  );
                  setMapLoaded(true);
                } else {
                  tweenEndRef.current = new TWEEN.Tween({ scaleY: scale })
                    .to({ scaleY: 0 }, 500)
                    .easing(TWEEN.Easing.Cubic.InOut)
                    .onUpdate(({ scaleY }) => {
                      if (parentRef.current) {
                        parentRef.current.scale.y = scaleY;
                      }
                    })
                    .onComplete(() => {
                      initMap(
                        JSON.parse(data1 as string),
                        JSON.parse(data2 as string)
                      );
                      setMapLoaded(true);
                    })
                    .start();
                }
                lastPrvince.current = prvince;
              }
            );
          }
        );
      }
    }, [prvince]);

    // 省份切换后改变展示名称
    useEffect(() => {
      if (mapDepthEnd && name !== showName) {
        if (!showName) {
          setShowName(name);
        } else {
          setTimeout(() => {
            setShowName(name);
          }, 500);
        }
      }
    }, [mapDepthEnd, name]);

    // 创建地图厚度动画
    const setMapDepthAnimation = () => {
      // 降低所有区块透明度
      if (shapRef.current) {
        (shapRef.current as any).children.forEach((child: any) => {
          if (mapHsl) {
            const hsl = { ...mapHsl };
            hsl.l += 0.2;
            child.material[0].color.setHSL(hsl.h, hsl.s, hsl.l);
            mapHslRef.current = hsl;
          }
        });
      }
      tweenBeginRef.current = new TWEEN.Tween({ scaleY: 0 })
        .to({ scaleY: scale }, 500)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(({ scaleY }) => {
          if (parentRef.current) {
            parentRef.current.scale.y = scaleY;
          }
        })
        .onComplete(() => {
          setMapDepthEnd(true);
        })
        .start();
    };

    // 鼠标移动事件，只在相机动画结束和在画布上移动时执行
    const handleMouseMove: React.EventHandler<any> = (event) => {
      if (event.target.tagName !== "CANVAS" || !cameraEnd) {
        return;
      }
      event.preventDefault();
      handleMove();
    };

    // 处理移动事件，射线检测鼠标经过区域
    const handleMove = () => {
      raycaster.setFromCamera(mouse, camera);
      if (!shapRef.current) {
        return;
      }
      const intersects = raycaster.intersectObjects(shapRef.current.children);
      lastMapName.current = currMapName.current;
      if (intersects.length > 0) {
        const intersect = intersects[0];
        currMapName.current = intersect.object.name;
      } else {
        currMapName.current = "";
      }
      if (lastMapName.current !== currMapName.current) {
        // 鼠标经过的区块高亮
        setMapColor();
      }
    };

    // 设置鼠标经过或点击过的区块高亮
    const setMapColor = () => {
      if (shapRef.current) {
        shapRef.current.children.forEach((child: THREE.Mesh) => {
          if (mapHslRef.current) {
            if (
              child.name === currMapName.current ||
              child.name === clickMapName.current
            ) {
              const hsl = { ...mapHslRef.current };
              hsl.l += 0.2;
              (child.material as THREE.MeshBasicMaterial[])[0].color.setHSL(
                hsl.h,
                hsl.s,
                hsl.l
              );
            } else {
              const hsl = { ...mapHslRef.current };
              (child.material as THREE.MeshBasicMaterial[])[0].color.setHSL(
                hsl.h,
                hsl.s,
                hsl.l
              );
            }
          }
        });
      }
    };

    // 鼠标点击时的射线检测
    const onRaycastChanged = (hits: THREE.Intersection[]) => {
      if (isScrollingRef.current) {
        return null;
      }
      if (hits.length > 0) {
        const intersect = hits[0];
        clickMapName.current =
          clickMapName.current === intersect.object.name
            ? ""
            : intersect.object.name;
      }
      setMapColor();
      return null;
    };

    // 最大区域的流光效果
    // const getFlowLight = (
    //   map: any,
    //   {
    //     depth,
    //     center,
    //     scale,
    //   }: { depth: number; center: [number, number]; scale: number }
    // ) => {
    //   const projection = d3
    //     .geoMercator()
    //     .center(center) // 地图中心点坐标
    //     .scale(80)
    //     .translate([0, 0]);
    //   let maxAreaPolygons: [number, number][] = [];
    //   map.features.forEach((elem: any) => {
    //     const coordinates = elem.geometry.coordinates;
    //     coordinates.forEach((multiPolygon: any) => {
    //       if (Array.isArray(coordinates[0][0][0])) {
    //         multiPolygon.forEach((polygon: any) => {
    //           maxAreaPolygons =
    //             maxAreaPolygons.length >= polygon.length
    //               ? maxAreaPolygons
    //               : polygon;
    //         });
    //       } else {
    //         maxAreaPolygons =
    //           maxAreaPolygons.length >= multiPolygon.length
    //             ? maxAreaPolygons
    //             : multiPolygon;
    //       }
    //     });
    //   });
    //   const positions = [];
    //   for (let i = 0; i < maxAreaPolygons.length; i++) {
    //     const [x, z] = projection(maxAreaPolygons[i]) as [number, number];
    //     if (!isNaN(x) && !isNaN(z)) {
    //       positions[i * 3] = x;
    //       positions[i * 3 + 1] = depth;
    //       positions[i * 3 + 2] = z;
    //     }
    //   }
    //   const vertices = getVertices(positions);
    //   const [texture1, tubeMesh1] = dealFlowLight(vertices, scale);
    //   const [texture2, tubeMesh2] = dealFlowLight(vertices, scale);
    //   texture2.offset.y = 0.5;
    //   setFlowLight([tubeMesh1, tubeMesh2]);
    //   setFlowLightTexture([texture1, texture2]);
    // };

    // 多区域的流光效果
    const getFlowLight = (
      map: any,
      {
        depth,
        center,
        scale,
      }: { depth: number; center: [number, number]; scale: number }
    ) => {
      let areaPolygons: [number, number][][] = [];
      map.features.forEach((elem: any) => {
        const coordinates = elem.geometry.coordinates;
        coordinates.forEach((multiPolygon: any) => {
          if (Array.isArray(coordinates[0][0][0])) {
            multiPolygon.forEach((polygon: any) => {
              if (polygon.length >= 20) {
                areaPolygons.push(polygon);
              }
            });
          } else {
            if (multiPolygon.length >= 20) {
              areaPolygons.push(multiPolygon);
            }
          }
        });
      });
      const { flowLightArr, flowLightTextureArr } = getFlowMesh(
        areaPolygons,
        {
          depth,
          center,
          scale,
        },
        false
      );
      setFlowLight(flowLightArr);
      setFlowLightTexture(flowLightTextureArr);
    };

    // 获取创建的所有流光纹理和Mesh
    const getFlowMesh = (
      areaPolygons: any,
      {
        depth,
        center,
        scale,
      }: { depth: number; center: [number, number]; scale: number },
      isBlock: boolean // 区块还是整个地图
    ) => {
      const projection = d3
        .geoMercator()
        .center(center) // 地图中心点坐标
        .scale(80)
        .translate([0, 0]);
      const positions: number[][] = [];
      areaPolygons.forEach((item: [number, number][], index: number) => {
        positions[index] = [];
        item.forEach((i: [number, number], ind: number) => {
          const [x, z] = projection(i) as [number, number];
          positions[index][ind * 3] = x;
          positions[index][ind * 3 + 1] = depth;
          positions[index][ind * 3 + 2] = z;
        });
      });
      const flowLightArr: THREE.Mesh[] = [];
      const flowLightTextureArr: THREE.CanvasTexture[] = [];
      positions.forEach((item: number[]) => {
        const vertices = getVertices(item);
        // 区块只需要一条流光效果
        if (isBlock) {
          const [texture1, tubeMesh1] = dealFlowLight(vertices, scale, isBlock);
          flowLightArr.push(tubeMesh1);
          flowLightTextureArr.push(texture1);
        } else {
          // 边界需要两条流光效果
          const [texture1, tubeMesh1] = dealFlowLight(vertices, scale, isBlock);
          const [texture2, tubeMesh2] = dealFlowLight(vertices, scale, isBlock);
          texture2.offset.y = 0.5;
          flowLightArr.push(tubeMesh1, tubeMesh2);
          flowLightTextureArr.push(texture1, texture2);
        }
      });
      return { flowLightArr, flowLightTextureArr };
    };

    // 计算当前省份地图厚度、缩放比例及中心点
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
      let minX = 0; // x方向坐标最小值
      let maxX = 0; // x方向坐标最大值
      let minZ = 0; // z方向坐标最小值
      let maxZ = 0; // z方向坐标最大值
      let totalX = 0; // x方向坐标值总和
      let totalZ = 0; // y方向坐标值总和
      let total = 0; // 总坐标数
      // 不同省份面积有大有小
      // 首次遍历获取地图缩放比例及厚度换算公式
      map.features
        .filter((i: any) => !!i.properties.name)
        .forEach((elem: any) => {
          const coordinates = elem.geometry.coordinates;
          coordinates.forEach((multiPolygon: any) => {
            if (Array.isArray(coordinates[0][0][0])) {
              multiPolygon.forEach((polygon: any) => {
                for (let i = 0; i < polygon.length; i++) {
                  const [x, z] = projection(polygon[i]) as [number, number];
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
            } else {
              for (let i = 0; i < multiPolygon.length; i++) {
                const [x, z] = projection(multiPolygon[i]) as [number, number];
                if (!isNaN(x) && !isNaN(z)) {
                  minX = Math.min(minX, x);
                  maxX = Math.max(maxX, x);
                  minZ = Math.min(minZ, z);
                  maxZ = Math.max(maxZ, z);
                  totalX += multiPolygon[i][0];
                  totalZ += multiPolygon[i][1];
                  total += 1;
                }
              }
            }
          });
        });
      const crossX = maxX - minX; // x方向横跨距离
      const crossZ = maxZ - minZ; // z方向横跨距离
      // console.log(Math.max(crossX, crossZ));
      // 设置一个基准值26，不同省份按照比例缩放，使视觉上大小显示一致
      // 对于全国地图，使其再放大一些
      const compScale =
        (26 / Math.max(crossX, crossZ)) * (prvince === "100000" ? 1.5 : 1);
      setScale(compScale);
      // 以北京市为准（Math.max(crossX, crossZ)值为2.96），设置地图厚度为0.12，其他省份以此缩放
      const depth = (0.12 * Math.max(crossX, crossZ)) / 2.96;
      setDepth(depth);
      // 纹理重复数，设置基准值1.5，其他省份以此缩放
      mapTexture.repeat.set(1.5 * compScale, 1.5 * compScale);
      return {
        center: [totalX / total, totalZ / total], // 地图经过墨卡托投影后的中心点
        depth,
        scale: compScale,
      };
    };

    // 地图初始化
    const initMap = (map1: any, map2: any) => {
      const { depth, center, scale } = getComputeData(map1);
      // 生成地图边界流光
      getFlowLight(map2, { depth, center, scale });
      const allBorders: Border[] = [];
      const allShaps: Shape[] = [];
      const labelArr: Label[] = [];
      const blockPolygons: [number, number][][] = [];

      const projection = d3
        .geoMercator() // 墨卡托投影
        .center(center) // 投影中心
        .scale(80) // 投影缩放
        .translate([0, 0]); // 移动到坐标原点

      const projectionCenter = d3
        .geoMercator()
        .center(center)
        .scale(80 * scale)
        .translate([0, 0]);
      map1.features
        .filter((i: any) => !!i.properties.name)
        .forEach((elem: any, index1: number) => {
          // 各区块中心标签数据
          const [centerX, centerZ] = projectionCenter(
            elem.properties.centroid || elem.properties.center
          ) as [number, number];
          labelArr.push({
            position: new THREE.Vector3(centerX, depth * scale, centerZ),
            label: elem.properties.name,
            weather: index1 % 10,
          });
          const coordinates = elem.geometry.coordinates;
          coordinates.forEach((multiPolygon: any, index2: number) => {
            if (Array.isArray(coordinates[0][0][0])) {
              multiPolygon.forEach((polygon: any, index3: number) => {
                if (polygon.length >= 20) {
                  blockPolygons.push(polygon);
                }
                const lineMaterial = new THREE.LineBasicMaterial({
                  color: 0xb1d2ff,
                });
                const shape = new THREE.Shape();
                const lineGeometry = new THREE.BufferGeometry();
                const positions = new Float32Array(polygon.length * 3);
                for (let i = 0; i < polygon.length; i++) {
                  const [x, z] = projection(polygon[i]) as [number, number];
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

                const geometry = new THREE.ExtrudeGeometry(
                  shape,
                  extrudeSettings
                );
                const material = new THREE.MeshBasicMaterial({
                  color: "#204e8f",
                  transparent: true,
                  opacity: 0.4,
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
            } else {
              if (multiPolygon.length >= 20) {
                blockPolygons.push(multiPolygon);
              }
              const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xb1d2ff,
              });
              const shape = new THREE.Shape();
              const lineGeometry = new THREE.BufferGeometry();
              const positions = new Float32Array(multiPolygon.length * 3);
              for (let i = 0; i < multiPolygon.length; i++) {
                const [x, z] = projection(multiPolygon[i]) as [number, number];
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

              const geometry = new THREE.ExtrudeGeometry(
                shape,
                extrudeSettings
              );
              const material = new THREE.MeshBasicMaterial({
                color: "#204e8f",
                transparent: true,
                opacity: 0.4,
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
              const name = elem.properties.name + index1 + index2;
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
            }
          });
        });
      setBorders(allBorders);
      setShapes(allShaps);
      setLabels(labelArr);

      // 创建区块流光
      const { flowLightArr, flowLightTextureArr } = getFlowMesh(
        blockPolygons,
        {
          depth,
          center,
          scale,
        },
        true
      );
      setBlockFlowLight(flowLightArr);
      setBlockFlowLightTexture(flowLightTextureArr);
    };

    // 数组坐标转三维向量坐标
    const getVertices = (points: number[]) => {
      const vertices = [new THREE.Vector3(points[0], points[1], points[2])];
      let i = 1;
      const numPoints = points.length / 3;
      while (i < numPoints) {
        const currX = points[i * 3];
        const currY = points[i * 3 + 1];
        const currZ = points[i * 3 + 2];
        vertices.push(new THREE.Vector3(currX, currY, currZ));
        i += 1;
      }
      return vertices;
    };

    // 生成流光
    const dealFlowLight = (
      vertices: THREE.Vector3[],
      scale: number,
      isBlock: boolean
    ) => {
      const tubeWidth = (isBlock ? 0.003 : 0.006) * (8.78266872973055 / scale);
      const len = vertices.length;
      const curve = new THREE.CatmullRomCurve3(vertices, false);
      const points = curve.getPoints(len);
      const smoothCurve = new THREE.CatmullRomCurve3(points, false);
      const tubeGeometry = new THREE.TubeGeometry(
        smoothCurve,
        len,
        tubeWidth,
        8,
        false
      );

      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 100;
      const context = canvas.getContext("2d")!;
      const gradient = context.createLinearGradient(0, 0, 0, 100);
      const createGradient = (gradient: CanvasGradient) => {
        gradient.addColorStop(0, "rgba(160,32,240,1)");
        if (isBlock) {
          gradient.addColorStop(0.05, "rgba(255,255,255,0)");
          gradient.addColorStop(0.1, "rgba(255,255,255,0)");
          gradient.addColorStop(0.2, "rgba(255,255,255,0)");
        } else {
          gradient.addColorStop(0.02, "rgba(160,32,240,0.8)");
          gradient.addColorStop(0.05, "rgba(160,32,240,0.4)");
          gradient.addColorStop(0.07, "rgba(160,32,240,0.2)");
          gradient.addColorStop(0.1, "rgba(160,32,240,0.1)");
          gradient.addColorStop(0.2, "rgba(255,255,255,0.1)");
        }
        gradient.addColorStop(0.3, "rgba(255,255,255,0)");
        gradient.addColorStop(0.4, "rgba(255,255,255,0)");
        gradient.addColorStop(0.5, "rgba(255,255,255,0)");
        gradient.addColorStop(0.6, "rgba(255,255,255,0)");
        gradient.addColorStop(0.7, "rgba(255,255,255,0)");
        gradient.addColorStop(0.8, "rgba(255,255,255,0)");
        gradient.addColorStop(0.9, "rgba(255,255,255,0)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
      };
      createGradient(gradient);
      context.fillStyle = gradient;
      context.fillRect(0, 0, 1, 100);
      const texture: any = new THREE.CanvasTexture(canvas);
      texture.repeat.set(0, 1);
      texture.wrapS = THREE.RepeatWrapping; // 防止拉伸
      texture.wrapT = THREE.RepeatWrapping; // 防止拉伸
      texture.rotation = Math.PI / 2;
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        emissive: "cyan",
        emissiveIntensity: 2,
      });
      const tubeMesh = new THREE.Mesh(tubeGeometry, material);
      return [texture, tubeMesh];
    };

    useFrame((_state, delta) => {
      // 地图纹理动画
      mapDepthCountRef.current += delta / 2;
      mapTexture.offset.y = 1 - (mapDepthCountRef.current % 1);

      // 流光动画
      flowLightTexture.forEach((texture: any) => {
        texture.offset.y -= 0.0015;
      });
      blockFlowLightTexture.forEach((texture: any) => {
        texture.offset.y -= 0.0015;
      });

      // 地图厚度动画
      if (tweenBeginRef.current) {
        tweenBeginRef.current.update();
      }
      // 地图厚度动画
      if (tweenEndRef.current) {
        tweenEndRef.current.update();
      }
    });

    if (!mapLoaded) {
      return <></>;
    }

    return (
      <>
        <object3D
          ref={parentRef}
          scale={[scale, 0, scale]}
          position={[0, 0, 0]}
        >
          {mapDepthEnd &&
            borders.map((i) => <primitive object={i.line} key={i.name} />)}
          <object3D ref={shapRef} onClick={(e: any) => e.stopPropagation()}>
            {shaps.map((i) => (
              <primitive
                object={i.mesh}
                key={i.name}
                rotation-x={-Math.PI / 2}
              />
            ))}
          </object3D>
          {flowLight.map((i, index) => (
            <primitive object={i} key={index} />
          ))}
          {mapDepthEnd &&
            blockFlowLight.map((i, index) => (
              <primitive object={i} key={index} />
            ))}
        </object3D>
        <Name
          begin={mapDepthEnd}
          name={showName}
          position={
            prvince === "100000"
              ? new THREE.Vector3(-6, 0.5, 16)
              : new THREE.Vector3(0, 0.5, 16)
          }
        />
        <object3D position={[0, 0.4, 0]}>
          <InstancedGridOfSquares begin={mapDepthEnd} />
        </object3D>
        {mapDepthEnd && <Wave />}
        {mapDepthEnd && (
          <OriginPoint position={{ x: 0, z: 0, y: depth * scale }} />
        )}
        {mapDepthEnd && <AnimationRing />}
        {labels.map(({ position, label, weather }: Label) => (
          <PointLabel
            key={label}
            position={position}
            scale={1}
            label={label}
            visible={mapDepthEnd}
            weather={weather}
            weatherBegin={mapDepthEnd && openWeather}
          />
        ))}
        {mapDepthEnd &&
          labels.map(
            ({ position, label }: { position: any; label: string }) => (
              <FlyLine key={label} position={position} />
            )
          )}
        {mapDepthEnd && (
          <LightCylinder
            position={[0, depth * scale, 0]}
            setLastAnimationEnd={setLastAnimationEnd}
          />
        )}
        {mapDepthEnd && (
          <CycleRaycast
            preventDefault={true}
            scroll={false}
            keyCode={0}
            onChanged={onRaycastChanged}
            portal={shapRef.current}
          />
        )}
      </>
    );
  }
);

export default MapModel;
