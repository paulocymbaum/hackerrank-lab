export function mindMapStemPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const midX = from.x + (to.x - from.x) * 0.55;
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
}

export function MindMapStemLayer(props: {
  stems: Array<{ id: string; from: { x: number; y: number }; to: { x: number; y: number } }>;
  width: number;
  height: number;
}) {
  const visibleStems = props.stems.filter((stem) => stem.from.x < stem.to.x - 2);

  return (
    <svg
      className="pointer-events-none absolute inset-0 overflow-visible"
      width={props.width}
      height={props.height}
      viewBox={`0 0 ${props.width} ${props.height}`}
      aria-hidden
    >
      {visibleStems.map((stem) => (
        <path
          key={stem.id}
          d={mindMapStemPath(stem.from, stem.to)}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="text-accent0/35 transition-opacity duration-200 motion-reduce:transition-none"
        />
      ))}
    </svg>
  );
}
