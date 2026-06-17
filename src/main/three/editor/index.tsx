import { Provider } from "react-redux";
import ScreenFull from "@/components/ScreenFull";
import { editorStore } from "./store";
import { EditorViewport } from "./components/shell/EditorShell";
import styles from "./index.module.scss";

export const Component = () => {
    return (
        <Provider store={editorStore}>
            <div className={styles.container} id="editor-container">
                <ScreenFull containerId="editor-container">
                    <EditorViewport />
                </ScreenFull>
            </div>
        </Provider>
    );
};
