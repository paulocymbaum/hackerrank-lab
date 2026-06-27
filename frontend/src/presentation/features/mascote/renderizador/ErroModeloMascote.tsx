import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  aoErro?: () => void;
  chaveReinicio?: number;
};

type Estado = {
  temErro: boolean;
};

/** Captura falha de carregamento do GLB; planeta permanece visível. */
export class ErroModeloMascote extends Component<Props, Estado> {
  state: Estado = { temErro: false };

  static getDerivedStateFromError(): Estado {
    return { temErro: true };
  }

  componentDidCatch(_erro: Error, _info: ErrorInfo): void {
    this.props.aoErro?.();
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.chaveReinicio !== this.props.chaveReinicio && this.state.temErro) {
      this.setState({ temErro: false });
    }
  }

  render(): ReactNode {
    if (this.state.temErro) return null;
    return this.props.children;
  }
}
