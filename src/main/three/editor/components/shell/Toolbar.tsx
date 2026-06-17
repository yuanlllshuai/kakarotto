import classNames from "classnames";
import { setMode } from "../../store/editorSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { EditorMode } from "../../types/editor";
import styles from "./Toolbar.module.scss";

const TOOL_ITEMS: { mode: EditorMode; label: string }[] = [
    { mode: "select", label: "选择" },
    { mode: "translate", label: "移动" },
    { mode: "rotate", label: "旋转" },
    { mode: "scale", label: "缩放" },
    { mode: "create-box", label: "创建立方体" },
];

export function Toolbar() {
    const dispatch = useAppDispatch();
    const currentMode = useAppSelector((state) => state.editor.mode);

    return (
        <div className={styles.toolbar}>
            {TOOL_ITEMS.map((item) => (
                <button
                    key={item.mode}
                    type="button"
                    className={classNames(styles.button, {
                        [styles.active]: currentMode === item.mode,
                    })}
                    onClick={() => dispatch(setMode(item.mode))}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
