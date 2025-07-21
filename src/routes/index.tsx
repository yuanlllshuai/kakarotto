import {
  // createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Main from "@/main/index";
import ErrorPage from "@/components/ErrorPage";
import Index from "@/main/home";
import {
  // ThreeGltf,
  ThreeLearn,
  ThreeSolar,
  ThreeMapPlane,
  ThreeShader,
} from "@/main/three";
import Settings from "@/main/settings";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Main />} errorElement={<ErrorPage />}>
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Index />}></Route>
      </Route>
      <Route path="three">
        <Route path="index" element={<ThreeLearn />} />
        <Route path="gltf" lazy={() => import("@/main/three/gltf/index")} />
        <Route path="solar" element={<ThreeSolar />} />
        <Route path="map-plane" element={<ThreeMapPlane />} />
        <Route path="shader" element={<ThreeShader />} />
      </Route>
      <Route path="settings" element={<Settings />} />
      <Route path="*" errorElement={<ErrorPage />} element={<ErrorPage />} />
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
