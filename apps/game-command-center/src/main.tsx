import * as ReactDOM from "react-dom/client";
import { GameCommandCenterApp } from "./App";
import "./styles.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(<GameCommandCenterApp />);
