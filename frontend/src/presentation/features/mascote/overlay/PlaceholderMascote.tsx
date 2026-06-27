import type { EmocaoMascote } from "../../../../application/mascote/dominio/tiposMascote";

type PropsPlaceholder = {
  emocao: EmocaoMascote;
};

export function PlaceholderMascote(props: PropsPlaceholder) {
  return (
    <div className="mascote-placeholder" data-emocao={props.emocao} aria-hidden="true">
      <span className="mascote-placeholder__icone" role="img" aria-label="Gato mascote">
        🐱
      </span>
    </div>
  );
}
