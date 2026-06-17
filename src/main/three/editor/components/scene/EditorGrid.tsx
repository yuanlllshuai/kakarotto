import { Grid } from "@react-three/drei";
import * as THREE from "three";
import { gridConfig } from "../../constants/grid";

export function EditorGrid() {
    return (
        <Grid position={[0, 0, 0]} args={[5, 5]} {...gridConfig} side={THREE.DoubleSide} />
    );
}
