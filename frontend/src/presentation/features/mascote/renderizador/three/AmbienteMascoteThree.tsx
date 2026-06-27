import { CONFIGURACAO_MASCOTE } from "../../../../../infrastructure/config/mascoteConfig";

export function AmbienteMascoteThree() {
  const ambiente = CONFIGURACAO_MASCOTE.ambiente;

  return (
    <>
      <color attach="background" args={[ambiente.corCeu]} />
      <fog attach="fog" args={[ambiente.neblina.cor, ambiente.neblina.near, ambiente.neblina.far]} />

      <hemisphereLight
        args={[
          ambiente.luzHemisferio.sky,
          ambiente.luzHemisferio.ground,
          ambiente.luzHemisferio.intensity,
        ]}
        position={ambiente.luzHemisferio.posicao}
      />
      <directionalLight
        castShadow
        intensity={ambiente.luzDirecional.intensity}
        position={ambiente.luzDirecional.posicao}
      />
      <ambientLight intensity={ambiente.luzAmbiente.intensity} />
    </>
  );
}
