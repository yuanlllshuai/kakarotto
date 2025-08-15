import { color } from "echarts";

export const chartOptions = [
  // line chart
  {
    grid: {
      left: 15,
      right: 20,
      bottom: 10,
      top: 20,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLabel: {
        fontSize: 10,
        color: "#FFF",
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#ECECEC",
        },
      },
      boundaryGap: ["10%", "10%"],
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 10,
        color: "#FFF",
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: "line",
        areaStyle: {},
      },
    ],
  },
  // bar chart
  {
    grid: {
      left: 15,
      right: 20,
      bottom: 10,
      top: 20,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLabel: {
        fontSize: 10,
        color: "#FFF",
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#ECECEC",
        },
      },
      boundaryGap: ["10%", "10%"],
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 10,
        color: "#FFF",
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: "bar",
        areaStyle: {},
      },
    ],
  },
  // pie chart
  {
    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1],
      },
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "55%",
        center: ["50%", "50%"],
        data: [
          { value: 335, name: "Direct" },
          { value: 310, name: "Email" },
          { value: 274, name: "Union Ads" },
          { value: 235, name: "Video Ads" },
          { value: 400, name: "Search Engine" },
        ].sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: "radius",
        label: {
          color: "#FFF",
        },
        labelLine: {
          lineStyle: {
            color: "#FFF",
          },
          smooth: 0.2,
          length: 5,
          length2: 10,
        },
        itemStyle: {
          color: "#c23531",
          shadowBlur: 200,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function () {
          return Math.random() * 200;
        },
      },
    ],
  },
  // scatter chart
  {
    grid: {
      left: 15,
      right: 20,
      bottom: 10,
      top: 20,
      containLabel: true,
    },
    xAxis: {
      axisLabel: {
        fontSize: 10,
        color: "#FFF",
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#ECECEC",
        },
      },
      boundaryGap: ["10%", "10%"],
    },
    yAxis: {
      axisLabel: {
        fontSize: 10,
        color: "#FFF",
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: [
      {
        symbolSize: 10,
        data: [
          [10.0, 8.04],
          [8.07, 6.95],
          [13.0, 7.58],
          [9.05, 8.81],
          [11.0, 8.33],
          [14.0, 7.66],
          [13.4, 6.81],
          [10.0, 6.33],
          [14.0, 8.96],
          [12.5, 6.82],
          [9.15, 7.2],
          [11.5, 7.2],
          [3.03, 4.23],
          [12.2, 7.83],
          [2.02, 4.47],
          [1.05, 3.33],
          [4.05, 4.96],
          [6.03, 7.24],
          [12.0, 6.26],
          [12.0, 8.84],
          [7.08, 5.82],
          [5.02, 5.68],
        ],
        type: "scatter",
      },
    ],
  },
  // candlestick chart
  {
    grid: {
      left: 15,
      right: 20,
      bottom: 10,
      top: 20,
      containLabel: true,
    },
    xAxis: {
      axisLabel: {
        fontSize: 10,
        color: "#FFF",
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#ECECEC",
        },
      },
      boundaryGap: ["10%", "10%"],
      data: ["2017-10-24", "2017-10-25", "2017-10-26", "2017-10-27"],
    },
    yAxis: {
      axisLabel: {
        fontSize: 10,
        color: "#FFF",
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: [
      {
        type: "candlestick",
        data: [
          [20, 34, 10, 38],
          [40, 35, 30, 50],
          [31, 38, 33, 44],
          [38, 15, 5, 42],
        ],
      },
    ],
  },
  // radar chart
  {
    radar: {
      // shape: 'circle',
      indicator: [
        { name: "Sales", max: 6500 },
        { name: "Administ", max: 16000 },
        { name: "Information", max: 30000 },
        { name: "Custome", max: 38000 },
        { name: "Development", max: 52000 },
        { name: "Marketing", max: 25000 },
      ],
      axisName: {
        color: "#FFF",
      },
    },
    series: [
      {
        name: "Budget vs spending",
        type: "radar",
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: "Allocated Budget",
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: "Actual Spending",
          },
        ],
      },
    ],
  },
  // sankey chart
  {
    series: {
      type: "sankey",
      layout: "none",
      emphasis: {
        focus: "adjacency",
      },
      left: 26,
      right: 40,
      data: [
        {
          name: "a",
        },
        {
          name: "b",
        },
        {
          name: "a1",
        },
        {
          name: "a2",
        },
        {
          name: "b1",
        },
        {
          name: "c",
        },
      ],
      links: [
        {
          source: "a",
          target: "a1",
          value: 5,
        },
        {
          source: "a",
          target: "a2",
          value: 3,
        },
        {
          source: "b",
          target: "b1",
          value: 8,
        },
        {
          source: "a",
          target: "b1",
          value: 3,
        },
        {
          source: "b1",
          target: "a1",
          value: 1,
        },
        {
          source: "b1",
          target: "c",
          value: 2,
        },
      ],
    },
  },
  {
    toolbox: {
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {},
      },
    },
    series: [
      {
        name: "Funnel",
        type: "funnel",
        left: "10%",
        top: 20,
        bottom: 20,
        width: "80%",
        min: 0,
        max: 100,
        minSize: "0%",
        maxSize: "100%",
        sort: "descending",
        gap: 2,
        label: {
          show: true,
          position: "inside",
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: "solid",
          },
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontSize: 20,
          },
        },
        data: [
          { value: 60, name: "Visit" },
          { value: 40, name: "Inquiry" },
          { value: 20, name: "Order" },
          { value: 80, name: "Click" },
          { value: 100, name: "Show" },
        ],
      },
    ],
  },
];
