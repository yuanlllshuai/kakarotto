import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { EditorAppDispatch, EditorRootState } from "./index";

export const useAppDispatch = () => useDispatch<EditorAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<EditorRootState> = useSelector;
