export function EditorLighting() {
    return (
        <>
            <pointLight position={[10, 10, 10]} decay={0} intensity={3} />
            <directionalLight position={[-10, -2, 0]} intensity={1} />
        </>
    );
}
