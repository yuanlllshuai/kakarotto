import LinkRoad from "./component/LinkRoad";

const Index = () => {
  return (
    <>
      <object3D position={[0, 4, -2.75]}>
        <LinkRoad />
      </object3D>
      <object3D position={[2.75, 4, 0]} rotation-y={-Math.PI / 2}>
        <LinkRoad />
      </object3D>
      <object3D position={[-2.75, 4, 0]} rotation-y={Math.PI / 2}>
        <LinkRoad />
      </object3D>
    </>
  );
};

export default Index;
