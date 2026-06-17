import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { EDITOR_CAMERA, SCENE_BACKGROUND } from "../../constants/camera";
import { EditorProvider } from "../../context/EditorContext";
import { EditorScene } from "../scene/EditorScene";
import { Toolbar } from "./Toolbar";
import styles from "../../index.module.scss";

export function EditorShell() {
    return (
        <div className={styles.model}>
            <Toolbar />
            <Canvas
                shadows
                camera={{
                    position: EDITOR_CAMERA.position,
                    near: EDITOR_CAMERA.near,
                    far: EDITOR_CAMERA.far,
                }}
                scene={{
                    background: new THREE.Color(SCENE_BACKGROUND),
                }}
            >
                <axesHelper scale={10} />
                <Suspense fallback={null}>
                    <EditorScene />
                </Suspense>
            </Canvas>
        </div>
    );
}

export function EditorViewport() {
    return (
        <EditorProvider>
            <EditorShell />
        </EditorProvider>
    );
}
