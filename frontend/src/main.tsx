import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./presentation/app/App";
import { bootstrapQuizScorePersistence } from "./infrastructure/bootstrap/quizScoreBootstrap";
import "./presentation/design-system/index.css";

bootstrapQuizScorePersistence();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
