import { OrbitControls } from "@react-three/drei";
import { useAppSelector } from "../../store/hooks";
import { useOrbitControlsApi } from "../../context/EditorContext";

export function EditorOrbitControls() {
    const interaction = useAppSelector((state) => state.editor.interaction);
    const { orbitControlsRef } = useOrbitControlsApi();

    const isInteracting = interaction.type !== "idle";

    return <OrbitControls ref={orbitControlsRef} makeDefault enabled={!isInteracting} />;
}
