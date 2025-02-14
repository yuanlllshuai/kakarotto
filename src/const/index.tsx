// import { Home, AllApplication } from '@icon-park/react';

export const navConfig = [
    { key: 'main', label: '首页', icon: 'shouyehome', path: '/' },
    {
        key: 'charts', label: 'Echarts', icon: 'charts', paths: ['/bar', '/line', '/pie'],
        children: [
            { key: 'bar', label: '柱状图', path: '/bar' },
            { key: 'line', label: '折线图', path: '/line' },
            { key: 'pie', label: '饼图', path: '/pie' },
        ]
    },
    {
        key: 'three', label: 'Three.js', paths: ['/three/index', '/three/gltf', '/three/solar'],
        children: [
            { key: 'learn', label: '学习', path: '/three/index' },
            { key: 'line', label: 'Gltf', path: '/three/gltf' },
            { key: 'pie', label: '太阳系', path: '/three/solar' },
            { key: 'pie', label: '地图平面', path: '/three/map-plane' },
            { key: 'pie', label: '着色器', path: '/three/shader' },
        ]
    },
    { key: 'settings', label: '设置', icon: 'settings', path: '/settings' },
]