// import { Home, AllApplication } from '@icon-park/react';

export const navConfig = [
  { key: "main", label: "首页", icon: "shouyehome", path: "/" },
  {
    key: "charts",
    label: "Echarts",
    icon: "charts",
    paths: ["/bar", "/line", "/pie"],
    children: [
      { key: "bar", label: "柱状图", path: "/bar" },
      { key: "line", label: "折线图", path: "/line" },
      { key: "pie", label: "饼图", path: "/pie" },
    ],
  },
  {
    key: "three",
    label: "Three.js",
    paths: ["/three/index", "/three/gltf", "/three/solar"],
    icon: "cube-three",
    children: [
      { key: "learn", label: "学习", path: "/three/index" },
      { key: "gltf", label: "Gltf", path: "/three/gltf" },
      { key: "solar", label: "太阳系", path: "/three/solar" },
      { key: "map-plane", label: "地图平面", path: "/three/map-plane" },
      { key: "shader", label: "着色器", path: "/three/shader" },
      { key: "province-map", label: "省份地图", path: "/three/province-map" },
    ],
  },
  { key: "settings", label: "设置", icon: "settings", path: "/settings" },
];
