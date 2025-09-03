export const lablePoints = [
  { position: { "x": -4.996522319560944, "y": 0.5130102167765299, "z": -2.1517615194489212 }, label: "洛阳市",weather:1 },
  { position: { "x": -3.915982484423097, "y": 0.5130102167765299, "z": 3.5553806715444143 }, label: "南阳市" ,weather:6},
  { position: { "x": 6.6029257200785025, "y": 0.5130102167765281, "z": 7.846117822742893 }, label: "信阳市" ,weather:3},
  { position: { "x": 3.660415067586232, "y": 0.5130102167765299, "z": 3.9764096362265864 }, label: "驻马店市" ,weather:7},
  { position: { "x": 2.2081207465116, "y": 0.5130102167765299, "z": 0.6569772537611822 }, label: "漯河市" ,weather:4},
  { position:{"x": -1.0034154725631188,"y": 0.5130102167765317,"z": -0.20534941285079}, label: "平顶山市" ,weather:0},
  { position:{"x": 1.717903916843099,"y": 0.5130102167765299,"z": -1.455105140962294}, label: "许昌市" ,weather:null},
  { position:{"x": 6.017240829138762,"y": 0.5130102167765299,"z": 0.3914776218094733}, label: "周口市",weather:2 },
  { position:{"x": 4.282798459932984,"y": 0.5130102167765299,"z": -3.327788475170065}, label: "开封市" ,weather:null},
  { position:{"x": 0.6155166207476526,"y": 0.5130102167765299,"z": -3.676396508500657}, label: "郑州市",weather:1 },
  { position:{"x": -0.6125850592442847,"y": 0.5130102167765299,"z": -5.872256041181117}, label: "焦作市" ,weather:null},
  { position:{"x": 2.7035663204036084,"y": 0.5130102167765299,"z": -6.73744709354775}, label: "新乡市",weather:8 },
  { position:{"x": 3.580401839398025,"y": 0.5130102167765299,"z": -8.517540605821445}, label: "鹤壁市",weather:null },
  { position:{"x": 4.515106585459423,"y": 0.5130102167765264,"z": -9.63907603507069}, label: "安阳市" ,weather:0},
  { position:{"x": 7.223369704852956,"y": 0.5130102167765299,"z": -8.758870158552378}, label: "濮阳市" ,weather:null},
  { position:{"x": -3.4071283702546147,"y": 0.5165485501146565,"z": -5.826153265202718}, label: "济源市" ,weather:9},
  { position:{"x": 9.353668906507668,"y": 0.5165485501146565,"z": -2.3200756852023634}, label: "商丘市" ,weather:5},
  { position:{"x": -8.718371566449541,"y": 0.513460550121367,"z": -2.4392518996094736}, label: "三门峡",weather:0},
]

export const weatherMap:any = {
  0: '晴',
  1: '多云',
  2: '阴',
  3: '小雨',
  4: '中雨',
  5: '大雨',
  6: '雷阵雨',
  7:'小雪',
  8:'中雪',
  9:'大雪',
}

const crossWidth = 0.12;
const crossheight = 0.8;

export const crossVertices = new Float32Array([
  -crossWidth / 2,0,-crossheight / 2,
  crossWidth / 2, 0, -crossheight / 2,
  crossWidth / 2, 0, crossheight / 2,
  crossWidth / 2, 0, crossheight / 2,
  -crossWidth / 2, 0, crossheight / 2,
  -crossWidth / 2, 0, -crossheight / 2,
  
  crossWidth / 2, 0, -crossWidth / 2,
  crossheight / 2, 0, -crossWidth / 2,
  crossheight / 2, 0, crossWidth / 2,
  crossheight / 2, 0, crossWidth / 2,
  crossWidth / 2, 0, crossWidth / 2,
  crossWidth / 2, 0, -crossWidth / 2,

  -crossheight / 2, 0, -crossWidth / 2,
  -crossWidth / 2, 0, -crossWidth / 2,
  -crossWidth / 2, 0, crossWidth / 2,
  -crossWidth / 2, 0, crossWidth / 2,
  -crossheight / 2, 0, crossWidth / 2,
  -crossheight / 2, 0, -crossWidth / 2,
]);