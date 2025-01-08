import * as THREE from 'three';

interface Base{
  renderer: any;
  camera: any;
  scene: any;
  cube: any;
  geometry: any;
  material: any;
  axesHelper?: boolean
}

export class ColorGUIHelper {
  object: any;
  prop: any;

  constructor(object: any, prop: any) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

export class DegRadHelper {

  obj: any;
  prop: any;

  constructor(obj: any, prop: any) {
    this.obj = obj;
    this.prop = prop;
  }
  get value() {
    return THREE.MathUtils.radToDeg(this.obj[this.prop]);
  }
  set value(v) {
    this.obj[this.prop] = THREE.MathUtils.degToRad(v);
  }
}

export class MinMaxGUIHelper {
  obj: any;
  minProp: any;
  maxProp: any;
  minDif: any;

  constructor(obj: any, minProp: any, maxProp: any, minDif: any) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    // eslint-disable-next-line no-self-assign
    this.min = this.min;  // 这将调用min的setter
  }
}

export function makeXYZGUI(gui: any, vector3: any, name: any, onChangeFn: any) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
  folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  folder.open();
}

export const DEFAULT_SIZE = { width: window.innerWidth, height: window.innerHeight };