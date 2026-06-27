import type { EstadoVisualMascote } from "../../../../application/mascote/dominio/tiposMascote";
import { CanvasMascoteThree } from "./three/CanvasMascoteThree";

type PropsRenderizador = EstadoVisualMascote & {
  tituloZoom: string;
};

export function MascoteRenderizador(props: PropsRenderizador) {
  return <CanvasMascoteThree {...props} />;
}
