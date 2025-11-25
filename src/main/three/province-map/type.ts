import * as THREE from "three";

type Position = {
  x: number,
  y: number,
  z: number
}

export type Props = {
  prvince: string;
  name: string;
  cameraEnd: boolean;
  mapLoaded: boolean;
  setMapLoaded: (loading: boolean) => void;
  setLastAnimationEnd: (isEnd: boolean) => void;
};

export type Border = {
  line: THREE.Line;
  name: string;
};

export type Shape = {
  mesh: THREE.Mesh,
  name: string
}

export type Label = {
  position: Position,
  label: string,
  weather: number
}