import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { MascoteOverlay } from "../features/mascote/overlay/MascoteOverlay";

export function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <MascoteOverlay />
    </BrowserRouter>
  );
}
