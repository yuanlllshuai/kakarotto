import * as THREE from 'three';
//@ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//@ts-ignore
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const DEFAULT_SIZE = { width: window.innerWidth, height: window.innerHeight };

type StartProps = {
    animate?: boolean
}

export class Base {

    renderer: any;
    camera: any;
    scene: any;
    cube: any;
    geometry: any;
    material: any;
    axesHelper?: boolean

    constructor({ id = '', size = DEFAULT_SIZE, axesHelper = false }) {
        // 创建画布区域
        this.init(id);
        // 创建场景
        this.createScene();
        // 创建相机
        this.createCamera(size);
        // 添加灯光
        this.setLight();
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
        this.camera.position.x = 3;
        this.camera.position.y = 3;
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
        const axesHelper = new THREE.AxesHelper(5);
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
        if (props?.animate) {
            time *= 0.001;
            that.cube.rotation.x = time;
            that.cube.rotation.y = time;
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
        this.material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
        // 创建立方体
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);
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

