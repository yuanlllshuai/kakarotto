import { Center, Text3D } from "@react-three/drei";
import font from "@/fonts/SimHei_Regular.json";
type Props = {
  content: [string] | [string, string];
  position: [number, number, number];
  color?: string;
  lineSpace?: number;
  rotationX?: number;
  rotationY?: number;
};

const Index = ({
  content,
  color = "#76add3",
  position,
  lineSpace = 0.25,
  rotationX = 0,
  rotationY = Math.PI / 2,
}: Props) => {
  return (
    <>
      <Center position={position}>
        <Text3D
          rotation-x={rotationX}
          rotation-y={rotationY}
          scale-x={1.2}
          height={0.001}
          size={0.2}
          font={font as any}
        >
          {content[0]}
          <meshBasicMaterial color={color} transparent={true} opacity={0.8} />
        </Text3D>
      </Center>

      {content[1] && (
        <Center position={[position[0], position[1] - lineSpace, position[2]]}>
          <Text3D
            rotation-x={rotationX}
            rotation-y={rotationY}
            height={0.001}
            size={0.12}
            font={font as any}
          >
            {content[1]}
            <meshBasicMaterial color={color} transparent={true} opacity={0.8} />
          </Text3D>
        </Center>
      )}
    </>
  );
};

export default Index;
