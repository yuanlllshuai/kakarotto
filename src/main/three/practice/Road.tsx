import LinkRoad from "./component/LinkRoad";

const Index = () => {
  return (
    <>
      {[-1.2, -0.4, 0.4, 1.2].map((i: number) => (
        <object3D key={`${i}`} position={[i, 4, -2.75]}>
          <LinkRoad />
        </object3D>
      ))}
      {[-1.2, -0.4, 0.4, 1.2].map((i: number) => (
        <object3D
          key={`${i}`}
          rotation-y={-Math.PI / 2}
          position={[2.75, 4, i]}
        >
          <LinkRoad />
        </object3D>
      ))}
      {[-1.2, -0.4, 0.4, 1.2].map((i: number) => (
        <object3D
          key={`${i}`}
          rotation-y={Math.PI / 2}
          position={[-2.75, 4, i]}
        >
          <LinkRoad />
        </object3D>
      ))}
    </>
  );
};

export default Index;
