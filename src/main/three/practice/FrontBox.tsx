import GradientBox from "./component/GradientBox";

const Index = () => {
  return (
    <>
      <object3D
        position={[0, 2, 2 * 1.305]}
        scale-x={0.3}
        rotation-y={Math.PI / 2}
      >
        <GradientBox
          colors={["#09a6ae", "#0ba1a9"]}
          hasHighlight={true}
          opacity={0.2}
          highlightProps={{
            meshProps: {
              "rotation-x": Math.PI / 2,
              "position-y": 2,
            },
            planProps: { args: [4, 4] },
            color: "#0ba1a9",
            intensity: 1,
          }}
          borderColor={[124, 246, 254, 0.02]}
          hasDashedLine={true}
          hideBorderIndexes={[2, 5, 7]}
        />
      </object3D>
    </>
  );
};

export default Index;
