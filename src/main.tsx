import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@sth87/shadcn-design-system/index.css";

createRoot(document.getElementById("root")!).render(<App />);
