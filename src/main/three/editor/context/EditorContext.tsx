import { createContext, useContext, useRef, type RefObject } from "react";
import type * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export interface EditorRefs {
    planeRef: RefObject<THREE.Mesh>;
    orbitControlsRef: RefObject<OrbitControlsImpl>;
}

interface EditorContextValue {
    refs: EditorRefs;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const planeRef = useRef<THREE.Mesh>(null);
    const orbitControlsRef = useRef<OrbitControlsImpl>(null);

    return (
        <EditorContext.Provider value={{ refs: { planeRef, orbitControlsRef } }}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditorRefs() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditorRefs must be used within EditorProvider");
    }
    return context.refs;
}

export function useOrbitControlsApi() {
    const { orbitControlsRef } = useEditorRefs();

    const setEnabled = (enabled: boolean) => {
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = enabled;
        }
    };

    return { orbitControlsRef, setEnabled };
}
