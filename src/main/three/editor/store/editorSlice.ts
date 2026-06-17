import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditorMode, EditorState, InteractionState } from "../types/editor";
import { INITIAL_EDITOR_STATE } from "../types/editor";
import type { MeshEntity, Vec3 } from "../types/scene";

const editorSlice = createSlice({
    name: "editor",
    initialState: INITIAL_EDITOR_STATE,
    reducers: {
        setMode(state, action: PayloadAction<EditorMode>) {
            state.mode = action.payload;
            state.interaction = { type: "idle" };
        },
        selectEntity(state, action: PayloadAction<string | null>) {
            state.selectedId = action.payload;
        },
        hoverEntity(state, action: PayloadAction<string | null>) {
            state.hoveredId = action.payload;
        },
        setInteraction(state, action: PayloadAction<InteractionState>) {
            state.interaction = action.payload;
        },
        startPlacing(state, action: PayloadAction<MeshEntity>) {
            state.interaction = { type: "placing", preview: action.payload };
            state.selectedId = null;
            state.hoveredId = null;
        },
        updatePlacingPreview(state, action: PayloadAction<Vec3>) {
            if (state.interaction.type !== "placing") return;
            state.interaction.preview.transform.position = action.payload;
        },
        endPlacing(state) {
            state.interaction = { type: "idle" };
        },
        startDragging(state, action: PayloadAction<string>) {
            state.interaction = { type: "dragging", entityId: action.payload };
        },
        endDragging(state) {
            state.interaction = { type: "idle" };
        },
        clearSelection(state) {
            state.selectedId = null;
            state.hoveredId = null;
        },
        resetEditor() {
            return INITIAL_EDITOR_STATE;
        },
    },
});

export const {
    setMode,
    selectEntity,
    hoverEntity,
    setInteraction,
    startPlacing,
    updatePlacingPreview,
    endPlacing,
    startDragging,
    endDragging,
    clearSelection,
    resetEditor,
} = editorSlice.actions;

export const editorReducer = editorSlice.reducer;

export type { EditorState };
