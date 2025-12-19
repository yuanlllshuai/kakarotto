import GradientBox from "./component/GradientBox";
import Line from "./component/Line";
import { Html } from "@react-three/drei";
import Ring from "./component/Ring";

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
  return (
    <>
      <object3D position={[0, 2, 0]}>
        <GradientBox
          colors={["#007898", "#29a1c5"]}
          borderColor={[142, 225, 245, 0.02]}
        />
        <object3D position={[-0.5, 2.1, -1]}>
          <object3D
            position={[0, 0, 0]}
            scale={0.22}
            scale-y={0.05}
            scale-z={0.14}
          >
            <GradientBox
              colors={["#3ccadc", "#3ccadc"]}
              borderColor={[142, 225, 245, 0.02]}
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
              opacity: 0.8,
            }}
          >
            <div>优化</div>
          </Html>
        </object3D>
        <object3D position={[0.8, 2.1, -1]}>
          <object3D position={[0, 0, 0]} scale={0.18} scale-y={0.05}>
            <GradientBox
              colors={["#3ccadc", "#3ccadc"]}
              borderColor={[142, 225, 245, 0.02]}
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
            <div>生产</div>
            <div>过程</div>
          </Html>
        </object3D>
        <object3D position={[0.8, 2.1, 0.2]}>
          <object3D position={[0, 0, 0]} scale={0.18} scale-y={0.05}>
            <GradientBox
              colors={["#3ccadc", "#3ccadc"]}
              borderColor={[142, 225, 245, 0.02]}
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
            <div>预测</div>
            <div>矫正</div>
          </Html>
        </object3D>
        <object3D position={[-0.4, 2.1, 1.3]}>
          <object3D position={[0, 0, 0]} scale={0.18} scale-y={0.05}>
            <GradientBox
              colors={["#3ccadc", "#3ccadc"]}
              borderColor={[142, 225, 245, 0.02]}
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
            <div>预测</div>
            <div>矫正</div>
          </Html>
        </object3D>
        <object3D position={[-0.5, 2.1, -0.2]}>
          <object3D
            position={[0, 0, 0]}
            scale={0.34}
            scale-y={0.05}
            scale-z={0.08}
          >
            <GradientBox
              colors={["#015d80", "#015d80"]}
              borderColor={[142, 225, 245, 0.02]}
            />
          </object3D>
          <Html
            position={[0, 0.1, 0]}
            rotation-x={-Math.PI / 2}
            // rotation-y={Math.PI / 2}
            transform={true}
            style={{
              userSelect: "none",
              color: "#b1efff",
              fontSize: 5,
              opacity: 0.8,
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            <div>优化操作控制</div>
          </Html>
        </object3D>
        <object3D position={[-0.5, 2.1, 0.3]}>
          <object3D
            position={[0, 0, 0]}
            scale={0.34}
            scale-y={0.05}
            scale-z={0.08}
          >
            <GradientBox
              colors={["#015d80", "#015d80"]}
              borderColor={[142, 225, 245, 0.02]}
            />
          </object3D>
          <Html
            position={[0, 0.1, 0]}
            rotation-x={-Math.PI / 2}
            // rotation-y={Math.PI / 2}
            transform={true}
            style={{
              userSelect: "none",
              color: "#b1efff",
              fontSize: 5,
              opacity: 0.8,
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            <div>MVs, CVs约束</div>
          </Html>
        </object3D>
        <object3D position={[1.12, 2.1, 0.94]}>
          <object3D
            position={[0, 0, 0]}
            scale={0.34}
            scale-y={0.05}
            scale-z={0.08}
          >
            <GradientBox
              colors={["#015d80", "#015d80"]}
              borderColor={[142, 225, 245, 0.02]}
            />
          </object3D>
          <Html
            position={[0, 0.1, 0]}
            rotation-x={-Math.PI / 2}
            // rotation-y={Math.PI / 2}
            transform={true}
            style={{
              userSelect: "none",
              color: "#b1efff",
              fontSize: 5,
              opacity: 0.8,
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            <div>过程信息</div>
          </Html>
        </object3D>
        <object3D position={[1.12, 2.1, 1.5]}>
          <object3D
            position={[0, 0, 0]}
            scale={0.34}
            scale-y={0.05}
            scale-z={0.08}
          >
            <GradientBox
              colors={["#015d80", "#015d80"]}
              borderColor={[142, 225, 245, 0.02]}
            />
          </object3D>
          <Html
            position={[0, 0.1, 0]}
            rotation-x={-Math.PI / 2}
            // rotation-y={Math.PI / 2}
            transform={true}
            style={{
              userSelect: "none",
              color: "#b1efff",
              fontSize: 5,
              opacity: 0.8,
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            <div>复杂多输入多输出</div>
          </Html>
        </object3D>
        <object3D position={[-1.3, 2.1, 1.5]}>
          <object3D
            position={[0, 0, 0]}
            scale={0.2}
            scale-y={0.05}
            scale-z={0.08}
          >
            <GradientBox
              colors={["#015d80", "#015d80"]}
              borderColor={[142, 225, 245, 0.02]}
            />
          </object3D>
          <Html
            position={[0, 0.1, 0]}
            rotation-x={-Math.PI / 2}
            // rotation-y={Math.PI / 2}
            transform={true}
            style={{
              userSelect: "none",
              color: "#b1efff",
              fontSize: 5,
              opacity: 0.8,
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            <div>可靠性</div>
          </Html>
        </object3D>
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
    </>
  );
};

export default Index;
