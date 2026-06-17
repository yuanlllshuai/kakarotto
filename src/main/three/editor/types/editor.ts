import type { MeshEntity } from "./scene";

export type EditorMode = "select" | "translate" | "rotate" | "scale" | "create-box";

export type InteractionState =
    | { type: "idle" }
    | { type: "placing"; preview: MeshEntity }
    | { type: "dragging"; entityId: string };

export interface EditorState {
    mode: EditorMode;
    selectedId: string | null;
    hoveredId: string | null;
    interaction: InteractionState;
}

export const INITIAL_EDITOR_STATE: EditorState = {
    mode: "select",
    selectedId: null,
    hoveredId: null,
    interaction: { type: "idle" },
};
