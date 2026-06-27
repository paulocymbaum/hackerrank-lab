import { CONFIGURACAO_MASCOTE } from "../../../../infrastructure/config/mascoteConfig";

export function MascoteConfetti() {
  const { confetti, particulasConfetti } = CONFIGURACAO_MASCOTE.ui;

  return (
    <div className="mascote-confete" aria-hidden="true">
      {Array.from({ length: particulasConfetti }, (_, indice) => (
        <span
          key={indice}
          className="mascote-confete__particula"
          style={{
            left: `${8 + (indice * 37) % 84}%`,
            animationDelay: `${(indice % 6) * 0.08}s`,
            backgroundColor: confetti[indice % confetti.length],
          }}
        />
      ))}
    </div>
  );
}
