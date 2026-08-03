import "@fontsource-variable/tasa-orbiter";
import "@fontsource/sarabun/400.css";
import "@fontsource/sarabun/400-italic.css";
import "./style.css";

import { render } from "preact";
import { App } from "./App.tsx";

render(<App />, document.getElementById("app")!);
