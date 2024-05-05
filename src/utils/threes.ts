import * as THREE from 'three';
//@ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const DEFAULT_SIZE = { width: window.innerWidth, height: window.innerHeight };

type Size = {
    width: number,
    height: number
}

export class Base {

    renderer: any;
    camera: any;
    scene: any;
    cube: any;
    geometry: any;
    material: any;

    constructor({ id = '', size = DEFAULT_SIZE }) {
        //创建画布区域
        this.init(id, size);
        // 创建场景
        this.createScene();
        // 创建相机
        this.createCamera();
        this.setCamera();
        this.setController();
        this.setAxesHelper();
    }
    init(id: string, size: Size) {
        this.renderer = new THREE.WebGLRenderer();
        const { width, height } = size;
        this.renderer.setSize(width, height);
        (document.getElementById(id) as HTMLElement).appendChild(this.renderer.domElement);
    }

    createScene() {
        this.scene = new THREE.Scene();
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    }

    setCamera() {
        this.camera.position.z = 5;
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
    render(r: any) {
        const renderer = r || this.getRenderer();
        renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render(r));
    }
}

export class Box extends Base {

    constructor(props: any) {
        super(props);
        this.createShape();
    }

    createShape() {
        // 盒子几何体
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        // 网格基础材料
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
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

