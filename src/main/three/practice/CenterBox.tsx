import GradientBox from "./component/GradientBox";
import Line from "./component/Line";
import { Html } from "@react-three/drei";
import Ring from "./component/Ring";
import Label from "./component/Label";

const Index = () => {
  const text = (
    content: string = "",
    position: [number, number],
    color: string = "#00FFFF",
    fontSize: number = 8
  ) => {
    return (
      <Html
        position={[position[0], 4, position[1]]}
        rotation-x={-Math.PI / 2}
        transform={true}
        style={{
          userSelect: "none",
          color,
          fontSize,
        }}
      >
        <span>{content}</span>
      </Html>
    );
  };
  const box1 = (
    position: [number, number, number],
    content: string[],
    size: [number, number] = [0.18, 0.18]
  ) => {
    return (
      <object3D position={position}>
        <object3D
          position={[0, 0, 0]}
          scale={size[0]}
          scale-y={0.05}
          scale-z={size[1]}
        >
          <GradientBox
            colors={["#3ccadc"]}
            borderColor={[142, 225, 245, 0.02]}
            isGradient={false}
            opacity={0.6}
          />
        </object3D>
        <Html
          position={[0, 0.1, 0]}
          rotation-x={-Math.PI / 2}
          // rotation-y={Math.PI / 2}
          transform={true}
          style={{
            userSelect: "none",
            color: "#000",
            fontSize: 5,
            display: "flex",
            flexDirection: "column",
            opacity: 0.8,
            letterSpacing: 1,
          }}
        >
          {content.map((i) => (
            <div key={i}>{i}</div>
          ))}
        </Html>
      </object3D>
    );
  };
  const box2 = (
    position: [number, number, number],
    content: string,
    size: [number, number] = [0.34, 0.08]
  ) => {
    return (
      <object3D position={position}>
        <object3D
          position={[0, 0, 0]}
          scale={size[0]}
          scale-y={0.05}
          scale-z={size[1]}
        >
          <GradientBox
            colors={["#015d80", "#015d80"]}
            borderColor={[142, 225, 245, 0.02]}
            opacity={0.6}
          />
        </object3D>
        <Html
          position={[0, 0.1, 0]}
          rotation-x={-Math.PI / 2}
          transform={true}
          style={{
            userSelect: "none",
            color: "#b1efff",
            fontSize: 5,
            opacity: 0.8,
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          <div>{content}</div>
        </Html>
      </object3D>
    );
  };
  return (
    <>
      <object3D position={[0, 2, 0]}>
        <GradientBox
          colors={["#007898", "#29a1c5"]}
          borderColor={[142, 225, 245, 0.02]}
        />
        {box1([-0.5, 2.1, -1], ["优化"], [0.22, 0.14])}
        {box1([0.8, 2.1, -1], ["生产", "过程"])}
        {box1([0.8, 2.1, 0.2], ["预测", "矫正"])}
        {box1([-0.4, 2.1, 1.3], ["预测", "矫正"])}
        {box2([-0.5, 2.1, -0.2], "优化操作控制")}
        {box2([-0.5, 2.1, 0.3], "MVs, CVs约束")}
        {box2([1.12, 2.1, 0.94], "过程信息")}
        {box2([1.12, 2.1, 1.5], "复杂多输入多输出")}
        {box2([-1.3, 2.1, 1.5], "可靠性", [0.2, 0.08])}
      </object3D>
      <object3D position={[0, 4, 0]} scale-y={0.001}>
        <Line
          points={[
            [-0.8, 0, 1.1],
            [-1.45, 0, 1.1],
            [-1.45, 0, -1],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [-1.9, 0, -1.2],
            [-1.64, 0, -1.2],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [-1.32, 0, -1.2],
            [-1.1, 0, -1.2],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [-0.04, 0, -1.2],
            [0.32, 0, -1.2],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [1.22, 0, -1.2],
            [1.7, 0, -1.2],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [0.43, 0, 1.45],
            [0.08, 0, 1.45],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [1.55, 0, -1.1],
            [1.55, 0, -0.2],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [1.55, 0, 0.1],
            [1.55, 0, 1.25],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [1.22, 0, 0],
            [1.35, 0, 0],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [1.3, 0, 0.1],
            [1.3, 0, 1.25],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [0.15, 0, -1.1],
            [0.15, 0, -0],
          ]}
          color="cyan"
        />
      </object3D>
      <Ring position={[-1.445, 4, -1.2]} />
      <Ring position={[1.55, 4, 0]} />
      {text("y", [-1.75, -1.45], "#d396f7", 5)}
      {text("+", [-1.6, -1.4])}
      {text("-", [-1.6, -1.0])}
      {text("u", [0.15, -1.35], "#d396f7", 5)}
      {text("y", [1.55, -1.45], "#d396f7", 5)}
      {text("e", [1.65, 0.6], "#d396f7", 5)}
      {text("y", [1.25, -0.2], "#d396f7", 5)}
      {text("y", [-1, 0.9], "#d396f7", 5)}
      {text("+", [1.4, -0.17])}
      {text("-", [1.4, 0.15])}
      {text("min J(K)", [-0.5, -0.65], "#d396f7", 5)}
      <Label
        position={[2, 3.6, 0]}
        content={["窑APC控制器", "Kiln APC Controller"]}
        color="#5bd2e4"
      />
    </>
  );
};

export default Index;
