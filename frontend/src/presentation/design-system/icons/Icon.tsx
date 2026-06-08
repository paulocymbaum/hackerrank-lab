import type { LucideIcon } from "lucide-react";

export function Icon(props: { icon: LucideIcon; className?: string; size?: number }) {
  const IconComponent = props.icon;
  return <IconComponent className={props.className} size={props.size ?? 18} aria-hidden />;
}
