import * as THREE from "three";

export type Props = {
  prvince: string;
  name: string;
  cameraEnd: boolean;
  mapLoaded: boolean;
  openWeather: boolean;
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
  position: THREE.Vector3,
  label: string,
  weather: number | null
}