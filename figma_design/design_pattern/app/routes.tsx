import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/dashboard";
import { Robots } from "./components/robots";
import { Store } from "./components/store";
import { ControlPanel } from "./components/control-panel";
import { MallGuide } from "./components/mall-guide";
import { Layout } from "./components/layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "robots", Component: Robots },
      { path: "store", Component: Store },
      { path: "control/:robotId", Component: ControlPanel },
      { path: "scenarios/mall-guide", Component: MallGuide },
    ],
  },
]);
