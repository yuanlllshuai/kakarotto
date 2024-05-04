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
        key: 'three', label: 'Three', paths: ['/bar1', '/line1', '/pie1'],
        children: [
            { key: 'bar', label: '柱状图', path: '/bar1' },
            { key: 'line', label: '折线图', path: '/line1' },
            { key: 'pie', label: '饼图', path: '/pie1' },
        ]
    },
    { key: 'settings', label: '设置', icon: 'settings', path: '/settings' },
]