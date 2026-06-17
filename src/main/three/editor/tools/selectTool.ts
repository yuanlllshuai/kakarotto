import { DRAG_THRESHOLD } from "../constants/interaction";
import {
    endDragging,
    selectEntity,
    startDragging,
    clearSelection,
} from "../store/editorSlice";
import { updateEntityPosition } from "../store/sceneSlice";
import type { EditorTool } from "./types";

export const selectTool: EditorTool = {
    onPlanePointerDown(ctx, e) {
        if (e.button !== 0) return;
        e.stopPropagation();
        ctx.dispatch(clearSelection());
    },

    onEntityPointerDown(ctx, e, entityId) {
        if (e.button !== 0) return;
        e.stopPropagation();
        ctx.setOrbitEnabled(false);
        ctx.dragSession.entityId = entityId;
        ctx.dragSession.hasMoved = false;
        ctx.dragSession.startX = e.clientX;
        ctx.dragSession.startY = e.clientY;
        ctx.dispatch(startDragging(entityId));
    },

    onPointerMove(ctx, e) {
        const { editor } = ctx.getState();
        if (editor.interaction.type !== "dragging") return;

        const entityId = editor.interaction.entityId;
        const distance = Math.hypot(
            e.clientX - ctx.dragSession.startX,
            e.clientY - ctx.dragSession.startY,
        );

        if (!ctx.dragSession.hasMoved) {
            if (distance < DRAG_THRESHOLD) return;
            ctx.dragSession.hasMoved = true;
        }

        const position = ctx.raycast.getGridPosition(e.clientX, e.clientY, entityId);
        if (!position) return;
        ctx.dispatch(updateEntityPosition({ id: entityId, position }));
    },

    onPointerUp(ctx, e) {
        const { editor } = ctx.getState();
        if (editor.interaction.type !== "dragging") return;

        const entityId = editor.interaction.entityId;

        if (ctx.dragSession.hasMoved) {
            const position =
                ctx.raycast.getGridPosition(e.clientX, e.clientY, entityId) ??
                ctx.getState().scene.entities.find((item) => item.id === entityId)?.transform
                    .position;

            if (position) {
                ctx.dispatch(updateEntityPosition({ id: entityId, position }));
            }
        }

        ctx.dispatch(selectEntity(entityId));
        ctx.dispatch(endDragging());
        ctx.dragSession.entityId = null;
        ctx.dragSession.hasMoved = false;
        ctx.setOrbitEnabled(true);
    },
};
