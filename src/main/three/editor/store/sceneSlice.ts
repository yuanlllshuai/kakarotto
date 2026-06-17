import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MeshEntity, Transform, Vec3 } from "../types/scene";

interface SceneState {
    entities: MeshEntity[];
}

const initialState: SceneState = {
    entities: [],
};

const sceneSlice = createSlice({
    name: "scene",
    initialState,
    reducers: {
        addEntity(state, action: PayloadAction<MeshEntity>) {
            state.entities.push(action.payload);
        },
        updateEntity(
            state,
            action: PayloadAction<{ id: string; patch: Partial<MeshEntity> }>,
        ) {
            const entity = state.entities.find((item) => item.id === action.payload.id);
            if (!entity) return;
            Object.assign(entity, action.payload.patch);
        },
        updateEntityPosition(state, action: PayloadAction<{ id: string; position: Vec3 }>) {
            const entity = state.entities.find((item) => item.id === action.payload.id);
            if (!entity) return;
            entity.transform.position = action.payload.position;
        },
        updateEntityTransform(state, action: PayloadAction<{ id: string; transform: Transform }>) {
            const entity = state.entities.find((item) => item.id === action.payload.id);
            if (!entity) return;
            entity.transform = action.payload.transform;
        },
        removeEntity(state, action: PayloadAction<string>) {
            state.entities = state.entities.filter((item) => item.id !== action.payload);
        },
        resetScene(state) {
            state.entities = [];
        },
    },
});

export const {
    addEntity,
    updateEntity,
    updateEntityPosition,
    updateEntityTransform,
    removeEntity,
    resetScene,
} = sceneSlice.actions;

export const sceneReducer = sceneSlice.reducer;
