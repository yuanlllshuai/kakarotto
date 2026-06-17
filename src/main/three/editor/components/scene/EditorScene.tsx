import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useEditorRefs, useOrbitControlsApi } from "../../context/EditorContext";
import { usePlaneRaycast } from "../../hooks/usePlaneRaycast";
import { editorStore } from "../../store";
import { clearSelection, hoverEntity } from "../../store/editorSlice";
import { removeEntity } from "../../store/sceneSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getActiveTool } from "../../tools/registry";
import type { ToolContext } from "../../tools/types";
import { EditorOrbitControls } from "../controls/EditorOrbitControls";
import { MeshEntityView } from "../mesh/MeshEntityView";
import { MeshPreview } from "../mesh/MeshPreview";
import { EditorGrid } from "./EditorGrid";
import { EditorLighting } from "./EditorLighting";
import { GroundPlane } from "./GroundPlane";

export function EditorScene() {
    const dispatch = useAppDispatch();
    const entities = useAppSelector((state) => state.scene.entities);
    const { mode, selectedId, hoveredId, interaction } = useAppSelector(
        (state) => state.editor,
    );
    const refs = useEditorRefs();
    const { setEnabled } = useOrbitControlsApi();
    const { getGridPosition, getGridPositionFromPoint } = usePlaneRaycast();
    const dragSessionRef = useRef({
        entityId: null as string | null,
        hasMoved: false,
        startX: 0,
        startY: 0,
    });

    const isInteracting = interaction.type !== "idle";
    const isTransformMode =
        mode === "translate" || mode === "rotate" || mode === "scale";
    const blockTransform =
        interaction.type === "placing" || interaction.type === "dragging";
    const planePointerEnabled = !(isTransformMode && selectedId);

    const getToolContext = (): ToolContext => ({
        dispatch,
        getState: () => editorStore.getState(),
        refs,
        raycast: { getGridPosition, getGridPositionFromPoint },
        setOrbitEnabled: setEnabled,
        dragSession: dragSessionRef.current,
    });

    useEffect(() => {
        const tool = getActiveTool(mode);

        const handlePointerMove = (e: PointerEvent) => {
            tool.onPointerMove?.(getToolContext(), e);
        };

        const handlePointerUp = (e: PointerEvent) => {
            tool.onPointerUp?.(getToolContext(), e);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [mode, dispatch, getGridPosition, getGridPositionFromPoint, refs, setEnabled]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Avoid deleting while typing in inputs
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
                return;
            }

            if (e.key === "Escape") {
                if (interaction.type !== "idle") return;
                dispatch(clearSelection());
                return;
            }

            if (e.key !== "Delete" && e.key !== "Backspace") return;
            if (!selectedId) return;
            if (interaction.type !== "idle") return;

            e.preventDefault();
            dispatch(removeEntity(selectedId));
            dispatch(clearSelection());
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [dispatch, interaction.type, selectedId]);

    const handlePlanePointerDown = (e: ThreeEvent<PointerEvent>) => {
        getActiveTool(mode).onPlanePointerDown?.(getToolContext(), e);
    };

    const handleEntityPointerDown = (entityId: string) => (e: ThreeEvent<PointerEvent>) => {
        getActiveTool(mode).onEntityPointerDown?.(getToolContext(), e, entityId);
    };

    return (
        <>
            <EditorOrbitControls />
            <GroundPlane
                onPointerDown={handlePlanePointerDown}
                pointerEnabled={planePointerEnabled}
            />
            <EditorGrid />
            <EditorLighting />
            {interaction.type === "placing" && <MeshPreview entity={interaction.preview} />}
            {entities.map((entity) => (
                <MeshEntityView
                    key={entity.id}
                    entity={entity}
                    isSelected={selectedId === entity.id}
                    isHovered={hoveredId === entity.id}
                    mode={mode}
                    blockTransform={blockTransform}
                    onPointerOver={(e) => {
                        if (isInteracting || mode === "create-box") return;
                        e.stopPropagation();
                        dispatch(hoverEntity(entity.id));
                    }}
                    onPointerOut={(e) => {
                        e.stopPropagation();
                        if (dragSessionRef.current.entityId === entity.id) return;
                        dispatch(hoverEntity(null));
                    }}
                    onPointerDown={handleEntityPointerDown(entity.id)}
                />
            ))}
        </>
    );
}
