import { configureStore } from "@reduxjs/toolkit";
import { editorReducer } from "./editorSlice";
import { sceneReducer } from "./sceneSlice";

export const editorStore = configureStore({
    reducer: {
        scene: sceneReducer,
        editor: editorReducer,
    },
});

export type EditorRootState = ReturnType<typeof editorStore.getState>;
export type EditorAppDispatch = typeof editorStore.dispatch;
