import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;
  varying vec3 vPosition;

  float hash11(float p) {
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  mat2 rotate2d(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(
      c, -s,
      s, c
    );
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float a = hash12(ip);
    float b = hash12(ip + vec2(1, 0));
    float c = hash12(ip + vec2(0, 1));
    float d = hash12(ip + vec2(1, 1));
    
    vec2 t = smoothstep(0.0, 1.0, fp);
    return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
  }

  float fbm(vec2 p, int octaveCount) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < octaveCount; ++i) {
      value += amplitude * noise(p);
      p *= rotate2d(0.45);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    uv = 2.0 * uv - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    // Use vertical position to create a lightning path
    float lightningPath = smoothstep(0.0, 1.0, abs(vPosition.y) / 2.0);
    uv += 2.0 * fbm(uv + 0.8 * iTime, 10) - 1.0;
    
    float dist = abs(uv.x);
    vec3 col = vec3(0.2, 0.3, 0.8) * pow(mix(0.0, 0.07, hash11(iTime)) / dist, 1.0);
    
    col = pow(col, vec3(1.0));

    // Set alpha to 0 for non-lightning areas
    float alpha = smoothstep(0.0, 0.1, length(col)) * lightningPath;
    gl_FragColor = vec4(col, alpha);
  }
`;

function LightningShaderMaterial() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = clock.getElapsedTime();
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={{
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      }}
      side={THREE.DoubleSide}
      transparent={true}
    />
  );
}

export default LightningShaderMaterial;
