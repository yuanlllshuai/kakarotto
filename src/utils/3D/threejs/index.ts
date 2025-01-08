import * as THREE from 'three';
//@ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//@ts-ignore
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GUI } from 'lil-gui';
import { ColorGUIHelper, DegRadHelper, makeXYZGUI, DEFAULT_SIZE } from './common';

export class Base {
  private renderRequested: boolean = false;

  renderer: any;
  camera: any;
  scene: any;
  cube: any;
  geometry: any;
  material: any;
  controls: any;
  axesHelper?: boolean;
  animateHandle?: ((time: number, ins: any) => void) | null;

  constructor({ id = '', size = DEFAULT_SIZE, axesHelper = false, light = false, animateHandle = null }) {
    this.animateHandle = animateHandle;
    // 创建画布区域
    this.init(id);
    // 创建场景
    this.createScene();
    // 创建相机
    this.createCamera(size);
    if (light) {
      // 添加灯光
      this.setLight();
    }
    this.setController();
    if (axesHelper) {
      this.setAxesHelper();
    }
  }

  // 解决模糊问题
  private resizeRendererToDisplaySize(renderer: any) {
    const canvas = renderer.domElement;
    // 屏幕分辨率倍数
    const pixelRatio = window.devicePixelRatio;
    const width = Math.floor(canvas.clientWidth * pixelRatio);
    const height = Math.floor(canvas.clientHeight * pixelRatio);
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      // 将画布分辨率设置为与css宽高一致
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  init(id: string) {
    const canvas = document.getElementById(id) as HTMLElement;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  }

  createScene() {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0xffffff);
    this.scene.background = new THREE.Color(0x000000);
  }

  createCamera(size = DEFAULT_SIZE) {
    this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
    this.camera.position.x = 6;
    this.camera.position.y = 6;
    this.camera.position.z = 6;
  }

  setLight() {
    const color = 0xFFFFFF;
    const intensity = 3;
    const light1 = new THREE.DirectionalLight(color, intensity);
    const light2 = new THREE.DirectionalLight(color, intensity);
    light1.position.set(1, 2, 3);
    light2.position.set(-1, -2, -3);
    this.scene.add(light1);
    this.scene.add(light2);
  }

  setController() {
    const that = this;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    if (!this.animateHandle) {
      this.controls.enableDamping = true;
      this.controls.addEventListener('change', () => that.requestRenderIfNotRequested());
    }
  }

  setAxesHelper() {
    const axesHelper = new THREE.AxesHelper(10);
    this.scene.add(axesHelper);
  }

  getRenderer() {
    return this.renderer;
  }
  getCube() {
    return this.cube
  }
  getCamera() {
    return this.camera
  }

  requestRenderIfNotRequested() {
    if (!this.renderRequested) {
      this.renderRequested = true;
      requestAnimationFrame(() => this.start());
    }
  }
  
  render(that: any, time: number = 0) {
    this.renderRequested = false;
    this.controls.update();
    if (this.resizeRendererToDisplaySize(that.renderer)) {
      const canvas = that.renderer.domElement;
      // 将相机宽高比设为canvas的宽高比，解决拉伸问题
      that.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      that.camera.updateProjectionMatrix();
    }
    if (this.animateHandle) {
      this.animateHandle(time, that);
    }
    that.renderer.render(that.scene, that.camera);
    if (this.animateHandle) {
      requestAnimationFrame((time: number) => that.render(that, time));
    }
  }

  start() {
    const that = this;
    if (this.animateHandle) {
      // 自动旋转、拖拽、缩放均需循环渲染
      requestAnimationFrame((time: number) => that.render(that, time));
    } else {
      that.render(that)
    }
  }
}

export class Box extends Base {

  constructor(props: any) {
    super(props);
    this.createShape();
    this.addGround();
    // 背景光
    this.setHemisphereLight();
    // // 点光源
    // this.setPointLight();
    // // 平行光
    // this.setDirectionalLight();
    // 聚光灯
    this.setSpotLight();
  } 

  createShape() {
    // 盒子几何体
    const boxWidth = 2;
    const boxHeight = 2;
    const boxDepth = 2;
    this.geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth, 1, 1, 1);
    // 网格基础材料,MeshBasicMaterial不会受光源影响
    this.material = new THREE.MeshPhongMaterial({ color: 0x44aa88, flatShading: true });
    // 创建立方体
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.position.y = 2;
    this.scene.add(this.cube);
  }

  addGround() {
    const planeSize = 16;
    const loader = new THREE.TextureLoader();
    loader.load('/gltf_models/common/checker.png', (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);
      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
      // Reflect.deleteProperty(planeGeo.attributes, 'normal');
      // Reflect.deleteProperty(planeGeo.attributes, 'uv');
      const planeMat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
  
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.rotation.x = Math.PI * -.5;
      this.scene.add(mesh);
      this.start();
    });
  }

  // 半球光（环境光AmbientLight的替代方案）
  setHemisphereLight() {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    this.scene.add(light);
    // gui
    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
    gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
    // gui.add(light, 'intensity', 0, 5, 0.01);
  }

  // 设置方向光
  setDirectionalLight() {
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(3, 5, 0);
    light.target.position.set(0, 2, 0);
    this.scene.add(light);
    this.scene.add(light.target);

    // gui
    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 5, 0.01);
    gui.add(light.target.position, 'x', -10, 10);
    gui.add(light.target.position, 'z', -10, 10);
    gui.add(light.target.position, 'y', 0, 10);

    // helper
    const helper = new THREE.DirectionalLightHelper(light);
    this.scene.add(helper);

    function updateLight() {
      light.target.updateMatrixWorld();
      helper.update();
    }
    updateLight();
    makeXYZGUI(gui, light.position, 'position', updateLight);
    makeXYZGUI(gui, light.target.position, 'target', updateLight);
  }

  // 设置点光源
  setPointLight() {
    const color = 0xFFFFFF;
    const intensity = 150;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(3, 5, 0);
    this.scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    this.scene.add(helper);

    function updateLight() {
      helper.update();
    }
    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 250, 1);
    gui.add(light, 'distance', 0, 40).onChange(updateLight);
    makeXYZGUI(gui, light.position, 'position', updateLight);
  }

  // 设置聚光灯
  setSpotLight() {
    const color = 0xFFFFFF;
    const intensity = 150;
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(3, 5, 0);
    light.target.position.set(0, 2, 0);
    this.scene.add(light);
    this.scene.add(light.target);

    const helper = new THREE.SpotLightHelper(light);
    this.scene.add(helper);

    function updateLight() {
      helper.update();
    }
    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 5, 0.01);
    gui.add(light.target.position, 'x', -10, 10);
    gui.add(light.target.position, 'z', -10, 10);
    gui.add(light.target.position, 'y', 0, 10);
    gui.add(new DegRadHelper(light, 'angle'), 'value', 0, 45).name('angle').onChange(updateLight);
    gui.add(light, 'penumbra', 0, 1, 0.01);
    makeXYZGUI(gui, light.position, 'position', updateLight);
    makeXYZGUI(gui, light.target.position, 'target', updateLight);
  }
}

export class SolarSystem extends Base {
  objects: any[] = [];

  solarSystem: any;
  earthOrbit: any;
  moonOrbit: any;

  constructor(props: any) {
    super(props);
    this.systemInit();
    this.setCamera();
    this.setLight();
    this.createStar();
    // this.addAxesHelper();
  }

  systemInit() {
    // 太阳系场景图
    this.solarSystem = new THREE.Object3D();
    this.scene.add(this.solarSystem);
    this.objects.push(this.solarSystem);

    // 地球场景图
    this.earthOrbit = new THREE.Object3D();
    // 地球距离太阳的位置
    this.earthOrbit.position.x = 7;
    // 将地球体系放入太阳体系
    this.solarSystem.add(this.earthOrbit);
    this.objects.push(this.earthOrbit);

    // 月球场景图
    this.moonOrbit = new THREE.Object3D();
    this.moonOrbit.position.x = 1;
    this.earthOrbit.add(this.moonOrbit);
  }

  createStar() {
    const radius = 0.6;
    const widthSegments = 99;
    const heightSegments = 99;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );

    this.createSun(sphereGeometry);
    this.createEarth(sphereGeometry);
    this.createMoon(sphereGeometry);
  }

  createSun(sphereGeometry: any) {
    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5); // 扩大太阳的大小
    this.solarSystem.add(sunMesh);
    this.objects.push(sunMesh);
  }

  createEarth(sphereGeometry: any) {
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    this.earthOrbit.add(earthMesh)
    this.objects.push(earthMesh);
  }

  createMoon(sphereGeometry: any) {
    const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(.3, .3, .3);
    this.moonOrbit.add(moonMesh);
    this.objects.push(moonMesh);
  }

  setLight() {
    const color = 0xffffff;
    // 强度
    const intensity = 500;
    const light = new THREE.PointLight(color, intensity);
    this.scene.add(light);
  }

  setCamera() {
    // // 设置摄像机位置，在y轴
    // this.camera.position.set(0, 20, 0);
    // // 在摄像机视角设置方位，z轴在摄像机的上方
    // this.camera.up.set(0, 0, 1);
    // // 摄像机俯视，向原点方向看
    // this.camera.lookAt(0, 0, 0);

    // 设置摄像机位置，在z轴
    this.camera.position.set(0, 0, 20);
    // 在摄像机视角设置方位，摄像机的上方是正y轴，则下方是负y轴，左侧是负x轴，右侧是正x轴
    this.camera.up.set(0, 1, 0);
    // 摄像机直视，向原点方向看
    this.camera.lookAt(0, 0, 0);
  }
  addAxesHelper() {
    this.objects.forEach((node: any) => {
      const axes = new THREE.AxesHelper();
      axes.renderOrder = 1;
      node.add(axes);
    });
  }
}


export class Line extends Base {
  constructor(props: any) {
    super(props);
    this.setCamera();
    this.createShape()
  }
  setCamera() {
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);
  }
  createShape() {
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const points = [];
    points.push(new THREE.Vector3(- 20, 0, 0));
    points.push(new THREE.Vector3(0, 20, 0));
    points.push(new THREE.Vector3(20, 0, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }
}

// export class Gltf extends Base {
//     constructor(props: any) {
//         super(props);
//         this.createGltf();
//     }
//     createGltf() {
//         const that = this;
//         const loader = new GLTFLoader();
//         loader.load('/girl/scene.gltf', function (gltf: any) {
//             that.scene.add(gltf.scene);
//             const model = gltf.scene;
//             model.position.set(0, 0, 0);
//             model.scale.set(1, 1, 1);
//         }, undefined, function (error: any) {
//             console.error(error);
//         });
//     }
// }

