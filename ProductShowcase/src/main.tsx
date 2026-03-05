import React from "react";
import ReactDOM from "react-dom/client";
import { TeamProvider } from "./context/TeamContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TeamProvider>
      <App />
    </TeamProvider>
  </React.StrictMode>
);