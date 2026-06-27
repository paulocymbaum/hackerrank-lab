import { useCallback, useRef, useState } from "react";
import {
  aplicarDeltaZoomArraste,
  type OpcoesZoomArrasteMascote,
} from "../dominio/controleZoomCameraMascote";

type OpcoesControleZoomMascote = OpcoesZoomArrasteMascote & {
  inicial: number;
};

export function useControleZoomMascote(opcoes: OpcoesControleZoomMascote) {
  const opcoesRef = useRef(opcoes);
  opcoesRef.current = opcoes;

  const [fatorZoomAlvo, definirFatorZoomAlvo] = useState(opcoes.inicial);
  const arrastandoRef = useRef(false);
  const ultimoYPixelsRef = useRef(0);

  const aoIniciarArrasteZoom = useCallback((evento: React.PointerEvent<HTMLElement>) => {
    if (evento.button !== 0) return;
    arrastandoRef.current = true;
    ultimoYPixelsRef.current = evento.clientY;
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }, []);

  const aoMoverArrasteZoom = useCallback((evento: React.PointerEvent<HTMLElement>) => {
    if (!arrastandoRef.current) return;

    const deltaY = evento.clientY - ultimoYPixelsRef.current;
    ultimoYPixelsRef.current = evento.clientY;

    definirFatorZoomAlvo((atual) =>
      aplicarDeltaZoomArraste(atual, deltaY, opcoesRef.current),
    );
  }, []);

  const aoEncerrarArrasteZoom = useCallback((evento: React.PointerEvent<HTMLElement>) => {
    if (!arrastandoRef.current) return;
    arrastandoRef.current = false;
    evento.currentTarget.releasePointerCapture(evento.pointerId);
  }, []);

  const redefinirZoom = useCallback(() => {
    definirFatorZoomAlvo(opcoesRef.current.inicial);
  }, []);

  return {
    fatorZoomAlvo,
    aoIniciarArrasteZoom,
    aoMoverArrasteZoom,
    aoEncerrarArrasteZoom,
    redefinirZoom,
  };
}
