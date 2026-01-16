import {
  // createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
// import Main from "@/main/index";
import { Component } from "@/components/ErrorPage";
// import Index from "@/main/home";
// import {
//   ThreeGltf,
//   ThreeLearn,
//   ThreeSolar,
//   ThreeMapPlane,
//   ThreeShader,
//   ThreeProvinceMap,
//   ThreePractive,
//   ThreePractive2,
// } from "@/main/three";
// import { CesiumFlight, CesiumBuilding } from "@/main/cesium";
// import Settings from "@/main/settings";

const router = createHashRouter(
  createRoutesFromElements(
    <Route
      path="/"
      lazy={() => import("@/main/index")}
      errorElement={<Component />}
    >
      <Route errorElement={<Component />}>
        <Route index lazy={() => import("@/main/home")}></Route>
      </Route>
      <Route path="three">
        <Route path="index" lazy={() => import("@/main/three/learn/index")} />
        {/* <Route path="gltf" lazy={() => import("@/main/three/gltf/index")} /> */}
        <Route path="solar" lazy={() => import("@/main/three/solar/index")} />
        <Route
          path="map-plane"
          lazy={() => import("@/main/three/map-plane/index")}
        />
        <Route path="shader" lazy={() => import("@/main/three/shader/index")} />
        <Route
          path="province-map"
          lazy={() => import("@/main/three/province-map/index")}
        />
        <Route
          path="practice1"
          lazy={() => import("@/main/three/practice/index")}
        />
        <Route
          path="practice2"
          lazy={() => import("@/main/three/practice2/index")}
        />
      </Route>
      <Route path="cesium">
        <Route
          path="flight-tracker"
          lazy={() => import("@/main/cesium/flight-tracker/index")}
        />
        <Route
          path="building"
          lazy={() => import("@/main/cesium/building/index")}
        />
      </Route>
      <Route path="settings" lazy={() => import("@/main/settings")} />
      <Route
        path="*"
        errorElement={<Component />}
        lazy={() => import("@/components/ErrorPage")}
      />
    </Route>
  )
);

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Main />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         errorElement: <ErrorPage />,
//         children: [{ index: true, element: <Index /> }],
//       },
//       {
//         path: "three",
//         children: [
//           {
//             path: "index",
//             element: <ThreeLearn />,
//           },
//           {
//             path: "gltf",
//             element: <ThreeGltf />,
//           },
//           {
//             path: "solar",
//             element: <ThreeSolar />,
//           },
//           {
//             path: "map-plane",
//             element: <ThreeMapPlane />,
//           },
//           {
//             path: "shader",
//             element: <ThreeShader />,
//           },
//         ],
//       },
//       {
//         path: "settings",
//         element: <Settings />,
//       },
//       {
//         path: "*",
//         errorElement: <ErrorPage />,
//         element: <ErrorPage />,
//       },
//     ],
//   },
// ]);

export default router;
