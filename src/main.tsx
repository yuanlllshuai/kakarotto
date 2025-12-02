import {
  createRoot,
  // hydrateRoot
} from "react-dom/client";
import axios from "axios";
import App from "./App.tsx";
import "./index.css";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.common["Authorization"] = "Bearer token";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

(window as any).CESIUM_BASE_URL = "node_modules/cesium/Build/Cesium";

const domNode = document.getElementById("root") as HTMLElement;
// hydrateRoot(domNode, <App />);

createRoot(domNode!).render(<App />);
