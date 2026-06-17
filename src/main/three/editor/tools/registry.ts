import { clearSelection, selectEntity } from "../store/editorSlice";
import type { EditorMode } from "../types/editor";
import { createBoxTool } from "./createBoxTool";
import { selectTool } from "./selectTool";
import type { EditorTool } from "./types";

const transformTool: EditorTool = {
    onPlanePointerDown(ctx, e) {
        if (e.button !== 0) return;
        e.stopPropagation();
        const { editor } = ctx.getState();
        // Keep selection when a gizmo is active; plane clicks can pass through the gizmo.
        if (editor.selectedId) return;
        ctx.dispatch(clearSelection());
    },
    onEntityPointerDown(ctx, e, entityId) {
        if (e.button !== 0) return;
        e.stopPropagation();
        ctx.dispatch(selectEntity(entityId));
    },
};

export const toolRegistry: Record<EditorMode, EditorTool> = {
    select: selectTool,
    "create-box": createBoxTool,
    translate: transformTool,
    rotate: transformTool,
    scale: transformTool,
};

export function getActiveTool(mode: EditorMode): EditorTool {
    return toolRegistry[mode];
}
