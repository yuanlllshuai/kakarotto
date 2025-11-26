import { memo, useEffect, useRef } from "react";
import * as THREE from "three";

import Cloudy from "./Cloudy";
import Sun from "./Sun";
import Overcast from "./Overcast";
import Rain from "./Rain";
import Snow from "./Snow";
import { useFrame } from "@react-three/fiber";
import * as TWEEN from "@tweenjs/tween.js";

const Index = memo(
  ({
    begin,
    weather,
    position,
  }: {
    position: THREE.Vector3;
    weather: number | null;
    begin: boolean;
  }) => {
    const groupRef = useRef<any>(null);
    const tweenRef = useRef<any>(null);
    const beginRef = useRef<boolean>(false);

    useEffect(() => {
      if (begin) {
        beginRef.current = true;
        const startPoint = new THREE.Vector3(0, 0, 0);
        const endPoint = new THREE.Vector3(0.9, 0.9, 0.9);
        tweenRef.current = new TWEEN.Tween(startPoint)
          .to(endPoint, 1000)
          .easing(TWEEN.Easing.Cubic.Out)
          .onUpdate((scale) => {
            if (groupRef.current) {
              groupRef.current.scale.copy(scale);
              groupRef.current.scale.copy(scale);
            }
          })
          .start();
      }
    }, [begin]);

    useFrame(() => {
      if (tweenRef.current && beginRef.current) {
        tweenRef.current.update();
      }
    });

    if (!begin) {
      return <></>;
    }

    return (
      <group
        ref={groupRef}
        scale={[0, 0, 0]}
        position={[position.x, 6, position.z]}
      >
        {weather === 0 && <Sun position={new THREE.Vector3(0, 0, 0)} />}
        {weather === 1 && <Cloudy />}
        {weather === 2 && <Overcast />}
        {weather === 3 && <Rain />}
        {weather === 4 && <Rain size="middle" />}
        {weather === 5 && <Rain size="large" />}
        {weather === 6 && <Rain size="large" type="lightning" />}
        {weather === 7 && <Snow size="small" />}
        {weather === 8 && <Snow size="middle" />}
        {weather === 9 && <Snow size="large" />}
      </group>
    );
  }
);

export default Index;
