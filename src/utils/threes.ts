import * as THREE from 'three';
//@ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//@ts-ignore
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const DEFAULT_SIZE = { width: window.innerWidth, height: window.innerHeight };

type StartProps = {
    animateHandle?: (time: number, instence: Base) => void
}

export class Base {

    renderer: any;
    camera: any;
    scene: any;
    cube: any;
    geometry: any;
    material: any;
    axesHelper?: boolean

    constructor({ id = '', size = DEFAULT_SIZE, axesHelper = false, light = false }) {
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

    private resizeRendererToDisplaySize(renderer: any) {
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = Math.floor(canvas.clientWidth * pixelRatio);
        const height = Math.floor(canvas.clientHeight * pixelRatio);
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
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
        this.scene.background = new THREE.Color(0xffffff);
    }

    createCamera(size = DEFAULT_SIZE) {
        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 3;
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
        new OrbitControls(this.camera, this.renderer.domElement)
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
    render(time: number, that: any, props: StartProps) {
        if (this.resizeRendererToDisplaySize(that.renderer)) {
            const canvas = that.renderer.domElement;
            that.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            that.camera.updateProjectionMatrix();
        }
        if (props?.animateHandle) {
            props?.animateHandle(time, that);
        }
        that.renderer.render(that.scene, that.camera);
        requestAnimationFrame((time: number) => that.render(time, that, props));
    }

    start(props: StartProps) {
        const that = this;
        requestAnimationFrame((time: number) => that.render(time, that, props));
    }
}

export class Box extends Base {

    constructor(props: any) {
        super(props);
        this.createShape();
    }

    createShape() {
        // 盒子几何体
        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        this.geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth, 1, 1, 1);
        // 网格基础材料,MeshBasicMaterial不会受光源影响
        this.material = new THREE.MeshPhongMaterial({ color: 0x44aa88, flatShading: true });
        // 创建立方体
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);
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
        this.solarSystem = new THREE.Object3D();
        this.scene.add(this.solarSystem);
        this.objects.push(this.solarSystem);

        this.earthOrbit = new THREE.Object3D();
        this.earthOrbit.position.x = 7;
        this.solarSystem.add(this.earthOrbit);
        this.objects.push(this.earthOrbit);

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
        // 在摄像机视角设置方位，y轴在摄像机的上方
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

