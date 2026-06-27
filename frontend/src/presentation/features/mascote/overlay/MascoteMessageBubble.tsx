import { useTranslation } from "../../../../application/hooks/useTranslation";
import type { EmocaoMascote } from "../../../../application/mascote/dominio/tiposMascote";

type PropsBalaoMascote = {
  mensagem: string | null;
  emocao: EmocaoMascote;
  aoDispensar: () => void;
};

export function MascoteMessageBubble(props: PropsBalaoMascote) {
  const { t } = useTranslation();

  if (!props.mensagem) return null;

  return (
    <div
      className="mascote-balao"
      role="status"
      aria-live="polite"
      data-emocao={props.emocao}
    >
      <p className="mascote-balao__texto">{props.mensagem}</p>
      <button
        type="button"
        className="mascote-balao__fechar"
        onClick={props.aoDispensar}
        aria-label={t("mascote.dismissMessage")}
      >
        ×
      </button>
    </div>
  );
}
