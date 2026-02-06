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

export const mixamoToVRoidMap: any = {
    "Armature":"Root",
    // 根骨骼与躯干
    "Hips": "J_Bip_C_Hips",
    "Spine": "J_Bip_C_Spine",
    "Spine1": "J_Bip_C_Chest",
    "Spine2": "J_Bip_C_UpperChest",
    "Neck": "J_Bip_C_Neck",
    "Head": "J_Bip_C_Head",

    // 左臂部分
    "LeftShoulder": "J_Bip_L_Shoulder",
    "LeftArm": "J_Bip_L_UpperArm",
    "LeftForeArm": "J_Bip_L_LowerArm",
    "LeftHand": "J_Bip_L_Hand",

    // 右臂部分
    "RightShoulder": "J_Bip_R_Shoulder",
    "RightArm": "J_Bip_R_UpperArm",
    "RightForeArm": "J_Bip_R_LowerArm",
    "RightHand": "J_Bip_R_Hand",

    // 左腿部分
    "LeftUpLeg": "J_Bip_L_UpperLeg",
    "LeftLeg": "J_Bip_L_LowerLeg",
    "LeftFoot": "J_Bip_L_Foot",
    "LeftToeBase": "J_Bip_L_ToeBase",

    // 右腿部分
    "RightUpLeg": "J_Bip_R_UpperLeg",
    "RightLeg": "J_Bip_R_LowerLeg",
    "RightFoot": "J_Bip_R_Foot",
    "RightToeBase": "J_Bip_R_ToeBase",

    // 手指部分 (左手)
    "LeftHandThumb1": "J_Bip_L_ThumbIntermediate",
    "LeftHandThumb2": "J_Bip_L_ThumbProximal",
    "LeftHandThumb3": "J_Bip_L_ThumbDistal",
    "LeftHandIndex1": "J_Bip_L_IndexProximal",
    "LeftHandIndex2": "J_Bip_L_IndexIntermediate",
    "LeftHandIndex3": "J_Bip_L_IndexDistal",
    "LeftHandMiddle1": "J_Bip_L_MiddleProximal",
    "LeftHandMiddle2": "J_Bip_L_MiddleIntermediate",
    "LeftHandMiddle3": "J_Bip_L_MiddleDistal",
    "LeftHandRing1": "J_Bip_L_RingProximal",
    "LeftHandRing2": "J_Bip_L_RingIntermediate",
    "LeftHandRing3": "J_Bip_L_RingDistal",
    "LeftHandPinky1": "J_Bip_L_LittleProximal",
    "LeftHandPinky2": "J_Bip_L_LittleIntermediate",
    "LeftHandPinky3": "J_Bip_L_LittleDistal",

    // 手指部分 (右手)
    "RightHandThumb1": "J_Bip_R_ThumbIntermediate",
    "RightHandThumb2": "J_Bip_R_ThumbProximal",
    "RightHandThumb3": "J_Bip_R_ThumbDistal",
    "RightHandIndex1": "J_Bip_R_IndexProximal",
    "RightHandIndex2": "J_Bip_R_IndexIntermediate",
    "RightHandIndex3": "J_Bip_R_IndexDistal",
    "RightHandMiddle1": "J_Bip_R_MiddleProximal",
    "RightHandMiddle2": "J_Bip_R_MiddleIntermediate",
    "RightHandMiddle3": "J_Bip_R_MiddleDistal",
    "RightHandRing1": "J_Bip_R_RingProximal",
    "RightHandRing2": "J_Bip_R_RingIntermediate",
    "RightHandRing3": "J_Bip_R_RingDistal",
    "RightHandPinky1": "J_Bip_R_LittleProximal",
    "RightHandPinky2": "J_Bip_R_LittleIntermediate",
    "RightHandPinky3": "J_Bip_R_LittleDistal"
};