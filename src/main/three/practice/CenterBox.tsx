import GradientBox from "./component/GradientBox";
import Line from "./component/Line";
import { Html } from "@react-three/drei";
import Ring from "./component/Ring";

const Index = () => {
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
              opacity={0.7}
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
              opacity={0.7}
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
              opacity={0.7}
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
              opacity={0.7}
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
        <object3D position={[-0.5, 2.1, -0.3]}>
          <object3D
            position={[0, 0, 0]}
            scale={0.34}
            scale-y={0.05}
            scale-z={0.08}
          >
            <GradientBox
              colors={["#015d80", "#015d80"]}
              opacity={0.7}
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
        <object3D position={[-0.5, 2.1, 0.2]}>
          <object3D
            position={[0, 0, 0]}
            scale={0.34}
            scale-y={0.05}
            scale-z={0.08}
          >
            <GradientBox
              colors={["#015d80", "#015d80"]}
              opacity={0.7}
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
              opacity={0.7}
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
              opacity={0.7}
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
              opacity={0.7}
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
            [-0.8, 2, 1.1],
            [-1.45, 2, 1.1],
            [-1.45, 2, -1],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [-1.8, 2, -1.2],
            [-1.1, 2, -1.2],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [-0.04, 2, -1.2],
            [0.32, 2, -1.2],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [1.22, 2, -1.2],
            [1.7, 2, -1.2],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [0.43, 2, 1.45],
            [0.08, 2, 1.45],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [1.5, 2, -1.1],
            [1.5, 2, -0.15],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [1.5, 2, 0.1],
            [1.5, 2, 1.25],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [1.22, 2, 0],
            [1.35, 2, 0],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [1.3, 2, 0.1],
            [1.3, 2, 1.25],
          ]}
          color="cyan"
        />
        <Line
          points={[
            [0.15, 2, -1.1],
            [0.15, 2, -0.11],
          ]}
          color="cyan"
        />
      </object3D>
      <object3D position={[0, 4, 0]} scale={0.01}>
        <Ring />
      </object3D>
    </>
  );
};

export default Index;
