export const navConfig = [
  { key: "main", label: "首页", icon: "shouyehome", path: "/" },
  {
    key: "charts",
    label: "Echarts",
    icon: "charts",
    children: [
      { key: "bar", label: "柱状图", path: "/bar" },
      { key: "line", label: "折线图", path: "/line" },
      { key: "pie", label: "饼图", path: "/pie" },
    ],
  },
  {
    key: "three",
    label: "Three.js",
    icon: "cube-three",
    children: [
      { key: "learn", label: "学习", path: "/three/index" },
      // { key: "gltf", label: "Gltf", path: "/three/gltf" },
      { key: "solar", label: "太阳系", path: "/three/solar" },
      { key: "map-plane", label: "地图平面", path: "/three/map-plane" },
      { key: "shader", label: "着色器", path: "/three/shader" },
      { key: "province-map", label: "省份地图", path: "/three/province-map" },
      { key: "practice1", label: "练习1", path: "/three/practice1" },
      { key: "practice2", label: "练习2", path: "/three/practice2" },
    ],
  },
  {
    key: "cesium",
    label: "Cesium.js",
    icon: "earth",
    children: [
      {
        key: "flight-tracker",
        label: "航班跟踪器",
        path: "/cesium/flight-tracker",
      },
      {
        key: "building",
        label: "建筑",
        path: "/cesium/building",
      },
    ],
  },
  { key: "settings", label: "设置", icon: "settings", path: "/settings" },
];

export const fontChar =
  "操作变量干扰被控窑控制器abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

export const CesiumAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmEyNDI5Mi0zYTRhLTRlMzItOTM2MS0xNTVmNjcyMThiMzEiLCJpZCI6MzY1NzU2LCJpYXQiOjE3NjQ2NTY1MTd9.gDooJhL6g0ohUhvA4LLpAkg1TihL_q1S5Tr0UCDkjhM";
