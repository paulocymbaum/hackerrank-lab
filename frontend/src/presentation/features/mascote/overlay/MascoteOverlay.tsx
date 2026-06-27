import { Cat, X } from "lucide-react";
import { useGatilhosMascote } from "../../../../application/mascote/hooks/useGatilhosMascote";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { useMascoteStore } from "../../../../application/mascote/store/mascoteStore";
import { Icon } from "../../../design-system/icons/Icon";
import { MascoteConfetti } from "./MascoteConfetti";
import { MascoteMessageBubble } from "./MascoteMessageBubble";
import { MascoteRenderizador } from "../renderizador/MascoteRenderizador";
import "./mascote.styles.css";

export function MascoteOverlay() {
  useGatilhosMascote();
  const { t } = useTranslation();

  const visivel = useMascoteStore((estado) => estado.visivel);
  const emocao = useMascoteStore((estado) => estado.emocao);
  const mensagem = useMascoteStore((estado) => estado.mensagem);
  const contextoSaudacao = useMascoteStore((estado) => estado.contextoSaudacao);
  const mostrarConfetti = useMascoteStore((estado) => estado.mostrarConfetti);
  const alternarVisibilidade = useMascoteStore((estado) => estado.alternarVisibilidade);
  const dispensarMensagem = useMascoteStore((estado) => estado.dispensarMensagem);

  if (!visivel) {
    return (
      <button
        type="button"
        className="mascote-gatilho-reabrir"
        onClick={alternarVisibilidade}
        aria-label={t("mascote.show")}
        title={t("mascote.show")}
      >
        <Icon icon={Cat} size={16} />
      </button>
    );
  }

  return (
    <div className="mascote-camada" aria-hidden={false}>
      <section className="mascote-painel">
        <header className="mascote-painel__barra">
          <button
            type="button"
            className="mascote-painel__ocultar"
            onClick={alternarVisibilidade}
            aria-label={t("mascote.hide")}
            title={t("mascote.hide")}
          >
            <Icon icon={X} size={14} />
          </button>
        </header>

        <div className="mascote-cena" data-emocao={emocao}>
          {mostrarConfetti ? <MascoteConfetti /> : null}
          <MascoteRenderizador
            emocao={emocao}
            contextoSaudacao={contextoSaudacao}
            visivel={visivel}
            tituloZoom={t("mascote.zoom.tooltip")}
          />
        </div>
      </section>

      <MascoteMessageBubble
        mensagem={mensagem}
        emocao={emocao}
        aoDispensar={dispensarMensagem}
      />
    </div>
  );
}
