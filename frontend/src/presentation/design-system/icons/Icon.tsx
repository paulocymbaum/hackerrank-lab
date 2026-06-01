import type { LucideIcon } from "lucide-react";

export type IconProps = {
  icon: LucideIcon;
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
};

export function Icon(props: IconProps) {
  const Comp = props.icon;
  const size = props.size ?? 18;
  return (
    <Comp
      aria-hidden={props["aria-hidden"] ?? true}
      size={size}
      strokeWidth={1.8}
      className={["text-text1", props.className].filter(Boolean).join(" ")}
    />
  );
}

