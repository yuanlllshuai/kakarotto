export const blendshapesMap:any = {
  // '_neutral': '',
  'browDownLeft': 'browDown_L',
  'browDownRight': 'browDown_R',
  'browInnerUp': 'browInnerUp',
  'browOuterUpLeft': 'browOuterUp_L',
  'browOuterUpRight': 'browOuterUp_R',
  'cheekPuff': 'cheekPuff',
  'cheekSquintLeft': 'cheekSquint_L',
  'cheekSquintRight': 'cheekSquint_R',
  'eyeBlinkLeft': 'eyeBlink_L',
  'eyeBlinkRight': 'eyeBlink_R',
  'eyeLookDownLeft': 'eyeLookDown_L',
  'eyeLookDownRight': 'eyeLookDown_R',
  'eyeLookInLeft': 'eyeLookIn_L',
  'eyeLookInRight': 'eyeLookIn_R',
  'eyeLookOutLeft': 'eyeLookOut_L',
  'eyeLookOutRight': 'eyeLookOut_R',
  'eyeLookUpLeft': 'eyeLookUp_L',
  'eyeLookUpRight': 'eyeLookUp_R',
  'eyeSquintLeft': 'eyeSquint_L',
  'eyeSquintRight': 'eyeSquint_R',
  'eyeWideLeft': 'eyeWide_L',
  'eyeWideRight': 'eyeWide_R',
  'jawForward': 'jawForward',
  'jawLeft': 'jawLeft',
  'jawOpen': 'jawOpen',
  'jawRight': 'jawRight',
  'mouthClose': 'mouthClose',
  'mouthDimpleLeft': 'mouthDimple_L',
  'mouthDimpleRight': 'mouthDimple_R',
  'mouthFrownLeft': 'mouthFrown_L',
  'mouthFrownRight': 'mouthFrown_R',
  'mouthFunnel': 'mouthFunnel',
  'mouthLeft': 'mouthLeft',
  'mouthLowerDownLeft': 'mouthLowerDown_L',
  'mouthLowerDownRight': 'mouthLowerDown_R',
  'mouthPressLeft': 'mouthPress_L',
  'mouthPressRight': 'mouthPress_R',
  'mouthPucker': 'mouthPucker',
  'mouthRight': 'mouthRight',
  'mouthRollLower': 'mouthRollLower',
  'mouthRollUpper': 'mouthRollUpper',
  'mouthShrugLower': 'mouthShrugLower',
  'mouthShrugUpper': 'mouthShrugUpper',
  'mouthSmileLeft': 'mouthSmile_L',
  'mouthSmileRight': 'mouthSmile_R',
  'mouthStretchLeft': 'mouthStretch_L',
  'mouthStretchRight': 'mouthStretch_R',
  'mouthUpperUpLeft': 'mouthUpperUp_L',
  'mouthUpperUpRight': 'mouthUpperUp_R',
  'noseSneerLeft': 'noseSneer_L',
  'noseSneerRight': 'noseSneer_R',
  // '': 'tongueOut'
};

// 你好（0-1s），我叫小明（1-2.5s），请大家多多关照（2.5-4.5s）
export const speechData = {
    name: "XiaoMing_Intro",
    duration: 4.5,
    tracks: [
        // 1. 核心口型：下巴张开 (jawOpen)
        {
            name: "jawOpen",
            times: [0, 0.2, 0.4, 0.7, 0.9, 1.2, 1.4, 1.7, 2.0, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.2, 4.5],
            values: [0, 0.3, 0.1, 0.4, 0.15, 0.35, 0.45, 0.2, 0.4, 0.1, 0.35, 0.45, 0.3, 0.4, 0.35, 0.2, 0]
            // 分别对应：静 -> 这里的音节起伏 (你-好-我-叫-小-明...)
        },
        // 2. 辅助口型：噘嘴 (mouthPucker - 用于 o, u, ü 发音)
        {
            name: "mouthPucker",
            times: [0, 0.4, 0.9, 1.2, 2.7, 3.6, 3.9, 4.5],
            values: [0, 0.3, 0.4, 0.1, 0.2, 0.4, 0.3, 0] // 在“好、我、多、多”音节处增强
        },
        // 3. 辅助口型：漏斗状 (mouthFunnel - 用于 qing, guan 等发音)
        {
            name: "mouthFunnel",
            times: [0, 2.7, 3.0, 3.9, 4.2, 4.5],
            values: [0, 0.25, 0.1, 0.3, 0.1, 0]
        },
        // 4. 表情细节：微笑 (mouthSmileLeft/Right - 表现友好)
        {
            name: "mouthSmileLeft",
            times: [0, 1.0, 4.0, 4.5],
            values: [0.1, 0.1, 0.1, 0.1] // 全程保持微调，结尾加强
        },
        {
            name: "mouthSmileRight",
            times: [0, 1.0, 4.0, 4.5],
            values: [0.1, 0.1, 0.1, 0.1]
        },
        // 5. 生动性：眨眼 (eyeBlinkLeft/Right)
        {
            name: "eyeBlinkLeft",
            times: [0, 2.0, 2.15, 2.3, 4.5],
            values: [0, 0, 1, 0, 0] // 2秒处快速眨眼
        },
        {
            name: "eyeBlinkRight",
            times: [0, 2.0, 2.15, 2.3, 4.5],
            values: [0, 0, 1, 0, 0]
        },
        // 6. 生动性：挤腮 (cheekSquint - 说话时的肌肉联动)
        {
            name: "cheekSquintLeft",
            times: [0, 0.7, 1.4, 3.3, 4.5],
            values: [0, 0.3, 0.4, 0.3, 0]
        }
    ]
};