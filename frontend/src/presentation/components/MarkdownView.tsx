import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function stripCursorComments(input: string) {
  return (
    input
      // Remove Cursor teacher/marker HTML comments (line-based)
      .split("\n")
      .filter((line) => {
        const t = line.trim();
        if (!t.startsWith("<!--") || !t.endsWith("-->")) return true;
        return !(t.includes("cursor:") || t.includes("marker:"));
      })
      .join("\n")
      // Clean up extra blank space introduced by stripping
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

export function MarkdownView(props: { markdown: string }) {
  const markdown = stripCursorComments(props.markdown);
  if (!markdown) return <p className="m-0 text-[13px] text-text1">No content.</p>;

  return (
    <div className="text-[13px] leading-relaxed text-text0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="m-0 mb-3 text-[20px] font-semibold tracking-[-0.01em] text-text0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="m-0 mb-2 mt-6 text-[16px] font-semibold text-text0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="m-0 mb-2 mt-5 text-[14px] font-semibold text-text0">{children}</h3>
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
            <blockquote className="m-0 mb-3 rounded-[12px] border border-border0 bg-glassFill p-3 text-text1">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-0 border-t border-border0" />,
          code: ({ children }) => (
            <code className="rounded-[10px] border border-border0 bg-glassFillStrong px-1.5 py-0.5 font-mono text-[12px] text-text0">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="m-0 mb-3 overflow-auto rounded-panel border border-border0 bg-glassFillStrong p-3 text-[12px] leading-relaxed text-text0 shadow-glass1">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="mb-3 overflow-auto rounded-panel border border-border0">
              <table className="w-full border-collapse text-[12px]">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-glassFillStrong text-[12px] text-text0">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-border0 px-3 py-2 text-left font-semibold">
              {children}
            </th>
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

