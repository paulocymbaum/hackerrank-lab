# Arquitetura do Mascote 3D

Documento canônico do overlay do gato animado (Three.js). Backend **Spline removido** — render único via R3F.

---

## 1. Objetivo do sistema

O mascote é um **companheiro global** montado em `App.tsx`. Reage ao progresso do aluno (rotas, quiz, projeto), exibe mensagens traduzidas e renderiza cena 3D estilo **Harvest Moon**: gato fixo no polo do planeta, planeta rola como esteira, câmera em vista ¾.

| Camada | Responsabilidade |
|--------|------------------|
| **Gatilhos** | Detectar eventos (navegação, conclusão, pendências) |
| **Estado** | Emoção, mensagem, visibilidade, confetti |
| **Resolução** | Emoção → clip GLB + velocidade da esteira |
| **Física** | Simulador cinemático (esteira, câmera, ancora) |
| **Cena 3D** | Planeta, modelo via portal, câmera, zoom |
| **UI** | Painel, balão, confetti CSS |

---

## 2. Estado atual (pós-refatoração)

### 2.1 Árvore de componentes

```
App
└── MascoteOverlay
    ├── useGatilhosMascote()
    ├── MascoteConfetti?
    ├── MascoteRenderizador          → só Three.js
    │   └── CanvasMascoteThree
    │       ├── Canvas (R3F)
    │       │   ├── AmbienteMascoteThree
    │       │   ├── ProvedorLoopCenaMascote
    │       │   │   ├── CenaEsteiraMascote   (planeta + ancora vazia)
    │       │   │   └── Suspense
    │       │   │       └── ErroModeloMascote → PortalModeloMascote → ModeloGatoMascote
    │       └── PlaceholderMascote?    (DOM, só em falha GLB)
    └── MascoteMessageBubble
```

### 2.2 Mapa de arquivos

| Arquivo | Papel |
|---------|-------|
| `MascoteOverlay.tsx` | Shell UI + store |
| `MascoteRenderizador.tsx` | Delega para `CanvasMascoteThree` |
| `CanvasMascoteThree.tsx` | Canvas R3F, zoom DOM, preload GLB, Suspense |
| `CenaEsteiraMascote.tsx` | Planeta + ancora vazia no polo |
| `PortalModeloMascote.tsx` | `createPortal` → ancora (Suspense fora de `<group>`) |
| `ModeloGatoMascote.tsx` | `<Gltf />` + `useAnimacaoGatoMascote` |
| `PlanetaMascote.tsx` | Esfera + arbustos (config) |
| `useLoopCenaMascote.ts` | Loop por frame: resolver + física + aplicador Three |
| `aplicadorFisicaThreeMascote.ts` | Aplica `EstadoFisicaFrameMascote` nos refs R3F |
| `application/mascote/fisica/` | Simulador cinemático (substitui `geometriaCenaMascote`) |
| `mascoteConfig.ts` | Única fonte de calibração |
| `application/mascote/dominio/` | Resolvers, patas, root motion, zoom |
| `application/mascote/hooks/` | Gatilhos, zoom, saudação, celebração, pendências |
| `mascoteStore.ts` | Zustand + timers |

### 2.3 Problemas resolvidos

| Problema | Solução |
|----------|---------|
| `Suspense` dentro de `<group>` | Ancora vazia + `PortalModeloMascote` |
| `primitive` + clone manual | `<Gltf />` do drei |
| Planeta some enquanto GLB carrega | Suspense só no modelo; planeta sempre montado |
| Falha GLB → tela vazia | `ErroModeloMascote` + `PlaceholderMascote` no DOM |
| Config duplicada | `CONFIGURACAO_MASCOTE` unificado |
| Dois backends (Three/Spline) | Spline removido |
| Hooks espalhados | `application/mascote/hooks/` |

---

## 3. Estrutura de pastas

```
frontend/src/
├── application/mascote/
│   ├── dominio/
│   │   ├── tiposMascote.ts
│   │   ├── resolverAnimacaoMascote.ts
│   │   ├── resolverEstadoCenaMascote.ts
│   │   ├── apoioPatasMascote.ts
│   │   ├── mutarRootMotionLocomocao.ts
│   │   ├── controleZoomCameraMascote.ts
│   │   ├── agendadorEmocaoMascote.ts
│   │   └── regrasProgressoMascote.ts
│   ├── fisica/
│   │   ├── simuladorFisicaMascote.ts
│   │   ├── esteiraPlanetaMascote.ts
│   │   ├── cameraFisicaMascote.ts
│   │   └── ...
│   ├── hooks/
│   │   ├── useGatilhosMascote.ts
│   │   ├── useControleZoomMascote.ts
│   │   ├── useSaudacaoPorRota.ts
│   │   ├── useCelebracaoPorProgresso.ts
│   │   └── usePreocupacaoPorPendencias.ts
│   ├── store/
│   └── selectors/
│
├── presentation/features/mascote/
│   ├── MASCOTE_ARCHITECTURE.md
│   ├── overlay/
│   └── renderizador/
│       ├── MascoteRenderizador.tsx
│       ├── ErroModeloMascote.tsx
│       └── three/
│           ├── CanvasMascoteThree.tsx
│           ├── AmbienteMascoteThree.tsx
│           ├── CenaEsteiraMascote.tsx
│           ├── PortalModeloMascote.tsx
│           ├── ProvedorLoopCenaMascote.tsx
│           ├── refsCenaMascoteContext.tsx
│           ├── PlanetaMascote.tsx
│           ├── ModeloGatoMascote.tsx
│           ├── useLoopCenaMascote.ts
│           ├── useAnimacaoGatoMascote.ts
│           └── aplicadorFisicaThreeMascote.ts
│
└── infrastructure/config/mascoteConfig.ts
```

---

## 4. Fluxo por frame

```mermaid
sequenceDiagram
  participant Overlay as MascoteOverlay
  participant Loop as useLoopCenaMascote
  participant Resolver as resolverEstadoFrameCenaMascote
  participant Sim as simuladorFisicaMascote
  participant Aplic as aplicadorFisicaThree
  participant Anim as useAnimacaoGatoMascote

  Overlay->>Loop: EstadoVisualMascote + zoom
  Loop->>Resolver: emocao + fatorZoom
  Loop->>Sim: frame + delta + bbox mundial
  Sim->>Aplic: EstadoFisicaFrameMascote
  Loop->>Anim: frameRef.animacao
```

### 4.1 Pipeline Three.js

| Regra | Motivo |
|-------|--------|
| `Suspense` só envolve portal/modelo | Planeta visível enquanto GLB carrega |
| `Suspense` nunca filho de `<group>` | R3F exige nós Three válidos dentro de groups |
| Preload **uma vez** em `CanvasMascoteThree` | Evita duplicação |
| `<Gltf />`, não `primitive` | Clone seguro + HMR |
| `frameloop={visivel ? "always" : "demand"}` | Economia quando overlay fechado |

### 4.2 Contratos

```typescript
type EstadoVisualMascote = {
  emocao: EmocaoMascote;
  contextoSaudacao: ContextoSaudacaoMascote | null;
  visivel: boolean;
};
```

`MascoteRenderizador` recebe `EstadoVisualMascote` + `tituloZoom` — sem branch Spline.

---

## 5. Config unificada

Tudo calibrável em `CONFIGURACAO_MASCOTE`:

- `modelo`: caminho GLB, euler, escala, posição de ancoragem
- `planeta`: raio, inclinação, grama, arbustos (posições + geometria)
- `cena`: azimute, câmera, zoom
- `ambiente`: céu, neblina, luzes, FOV
- `emocao`: tempos, crossfade, limiar quiz
- `ui`: confetti, z-index (`--z-mascote: 40` em `mascote.styles.css`)

---

## 6. Status dos PRs

| PR | Status |
|----|--------|
| PR-1 Render (Suspense + Gltf + portal) | ✅ |
| PR-2 Domínio + `fisica/` | ✅ |
| PR-3 `useAnimacaoGatoMascote` | ✅ |
| PR-4 Config DRY | ✅ |
| PR-5 Pastas overlay/renderizador | ✅ |
| PR-6 Gatilhos fatiados + store | ✅ |
| PR-7 Spline | **Removido** (escolha: só Three.js) |

---

## 7. Verificação

```bash
cd frontend
npm test -- --run mascote
npm run build
rg "Spline|toon-cat|ESCALA_MODELO|POSICAO_ANCORAGEM|geometriaCena" frontend/src
# deve retornar vazio (exceto menções históricas neste doc)
```

---

## 8. Checklist manual

| Item | Esperado |
|------|----------|
| Planeta visível antes do GLB | Sim |
| Gato visível + anima Sit/Walk/Jump | Sim |
| Esteira alinhada à caminhada | Sim |
| Zoom + duplo clique reset | Sim |
| Falha GLB → placeholder, planeta OK | Sim |
| Overlay oculto → `frameloop="demand"` | Sim |
| HMR não quebra mesh | Sim |
| Zero referências Spline/toon-cat | Sim |

---

## 9. Animações GLB

| Clip | Emoção / contexto | Loop | Esteira |
|------|-------------------|------|---------|
| `Sit` | idle | sim | lenta |
| `Walk` | walking / saudação lesson | sim | sim |
| `Run` | saudação project | sim | sim |
| `Bark` | saudação quiz / default | once | não |
| `Jump` | celebrating | sim | sim |
| `Sneak` | concerned | sim | sim |

Arquivo: `/models/mascote/exported-model.glb`

---

## 10. Fora de escopo

- Reescrever `PlanetaMascote` como GLB externo
- Motor rigid-body (Cannon/Rapier)
- Storybook (opcional futuro)
- Mudar tempos de emoção ou clips sem teste de regressão
