import { addEntity } from "../store/sceneSlice";
import { endPlacing, startPlacing, updatePlacingPreview } from "../store/editorSlice";
import { createBoxEntity } from "../types/scene";
import { randomMeshColor } from "../utils/color";
import type { ToolContext, EditorTool } from "./types";
import type { Vec3 } from "../types/scene";
import type { ThreeEvent } from "@react-three/fiber";

function resolvePlacePosition(ctx: ToolContext, e: ThreeEvent<PointerEvent>): Vec3 {
    const { editor } = ctx.getState();

    // Prefer the live preview position so click matches what the user sees.
    if (editor.interaction.type === "placing") {
        const { position } = editor.interaction.preview.transform;
        return [position[0], position[1], position[2]];
    }

    // Same raycast path as pointermove for consistency.
    const fromPointer = ctx.raycast.getGridPosition(e.clientX, e.clientY);
    if (fromPointer) return fromPointer;

    return ctx.raycast.getGridPositionFromPoint(e.point);
}

function placeBoxAt(ctx: ToolContext, position: Vec3) {
    const { editor } = ctx.getState();

    if (editor.interaction.type === "placing") {
        ctx.dispatch(
            addEntity(
                createBoxEntity(
                    position,
                    editor.interaction.preview.material.color,
                    `${Date.now()}`,
                ),
            ),
        );
        ctx.dispatch(startPlacing(createBoxEntity(position, randomMeshColor(), "preview")));
        return;
    }

    ctx.dispatch(
        addEntity(createBoxEntity(position, randomMeshColor(), `${Date.now()}`)),
    );
    ctx.dispatch(startPlacing(createBoxEntity(position, randomMeshColor(), "preview")));
}

export const createBoxTool: EditorTool = {
    onEntityPointerDown(ctx, e) {
        if (e.button !== 0) return;
        e.stopPropagation();
        placeBoxAt(ctx, resolvePlacePosition(ctx, e));
    },

    onPlanePointerDown(ctx, e) {
        if (e.button !== 0) return;
        e.stopPropagation();
        placeBoxAt(ctx, resolvePlacePosition(ctx, e));
    },

    onPointerMove(ctx, e) {
        const position = ctx.raycast.getGridPosition(e.clientX, e.clientY);
        const { editor } = ctx.getState();
        if (!position) {
            if (editor.interaction.type === "placing") {
                ctx.dispatch(endPlacing());
            }
            return;
        }

        if (editor.interaction.type === "placing") {
            ctx.dispatch(updatePlacingPreview(position));
            return;
        }
        ctx.dispatch(startPlacing(createBoxEntity(position, randomMeshColor(), "preview")));
    },
};
