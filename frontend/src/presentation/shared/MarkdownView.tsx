import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function stripCursorComments(input: string) {
  return input
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      if (!t.startsWith("<!--") || !t.endsWith("-->")) return true;
      return !(t.includes("cursor:") || t.includes("marker:"));
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function MarkdownView(props: { markdown: string }) {
  const markdown = stripCursorComments(props.markdown);
  if (!markdown) return <p className="m-0 text-meta text-text1">No content.</p>;

  return (
    <div className="text-body leading-relaxed text-text0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="m-0 mb-3 text-section font-semibold tracking-[-0.01em] text-text0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="m-0 mb-2 mt-6 text-body-lg font-semibold text-text0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="m-0 mb-2 mt-5 text-body font-semibold text-text0">{children}</h3>
          ),
          p: ({ children }) => <p className="m-0 mb-3 text-text0">{children}</p>,
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-accent1 underline decoration-border0 underline-offset-4 hover:brightness-110"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="m-0 mb-3 list-disc pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="m-0 mb-3 list-decimal pl-5">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="m-0 mb-3 rounded-panel border border-border0 bg-surfacePanel p-3 text-text1">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-0 border-t border-border0" />,
          code: ({ children }) => (
            <code className="rounded-panel border border-border0 bg-surfaceControl px-1.5 py-0.5 font-mono text-meta text-text0">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="m-0 mb-3 overflow-auto rounded-panel border border-border0 bg-surfaceControl p-3 text-meta leading-relaxed text-text0 shadow-glass1">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="mb-3 overflow-auto rounded-panel border border-border0">
              <table className="w-full border-collapse text-meta">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surfaceControl text-meta text-text0">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-border0 px-3 py-2 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border0 px-3 py-2 align-top">{children}</td>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
