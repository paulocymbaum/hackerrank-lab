import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./presentation/app/App";
import { bootstrapQuizScorePersistence } from "./infrastructure/bootstrap/quizScoreBootstrap";
import { bootstrapProjectDeliveryPersistence } from "./infrastructure/bootstrap/projectDeliveryBootstrap";
import { bootstrapProjectRun } from "./infrastructure/bootstrap/projectRunBootstrap";
import { applyLocaleToDocument, readPersistedLocale } from "./infrastructure/i18n/applyLocaleToDocument";
import { readPersistedTheme, applyThemeToDocument } from "./application/stores/themeStore";
import "./presentation/design-system/index.css";

bootstrapQuizScorePersistence();
bootstrapProjectDeliveryPersistence();
bootstrapProjectRun();

const initialLocale = readPersistedLocale();
if (initialLocale) applyLocaleToDocument(initialLocale);

const initialTheme = readPersistedTheme();
if (initialTheme) applyThemeToDocument(initialTheme);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
