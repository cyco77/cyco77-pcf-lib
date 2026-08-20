import * as React from "react";
import mermaid from "mermaid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { semanticColors } from "../../../shared/theme";

export interface MarkdownViewerViewProps {
  markdown: string;
  showBackgroundColor: boolean;
}

const containerStyle: React.CSSProperties = {
  background: semanticColors.surface,
  border: `1px solid ${semanticColors.surfaceBorder}`,
  borderRadius: "8px",
  boxSizing: "border-box",
  color: semanticColors.textSubtle,
  height: "100%",
  minHeight: "120px",
  overflowWrap: "anywhere",
  padding: "16px",
};

const emptyStateStyle: React.CSSProperties = {
  color: semanticColors.textSubtle,
  fontStyle: "italic",
};

const listStyle: React.CSSProperties = {
  margin: "0 0 1em",
  paddingInlineStart: "20px",
};

const taskListContainerStyle: React.CSSProperties = {
  ...listStyle,
  paddingInlineStart: 0,
};

const listItemStyle: React.CSSProperties = {
  margin: "0.2em 0",
};

const taskListStyle: React.CSSProperties = {
  listStyle: "none",
  margin: "0.2em 0",
  paddingLeft: 0,
};

const taskListItemContentStyle: React.CSSProperties = {
  alignItems: "flex-start",
  display: "inline-flex",
  gap: "8px",
};

const tableWrapperStyle: React.CSSProperties = {
  margin: "0 0 1em",
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  borderCollapse: "separate",
  borderSpacing: 0,
  fontSize: "13px",
  minWidth: "100%",
  width: "100%",
};

const tableHeaderCellStyle: React.CSSProperties = {
  background: "#eff6ff",
  borderBottom: `1px solid ${semanticColors.surfaceBorder}`,
  color: "#334155",
  fontWeight: 600,
  padding: "10px 12px",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tableCellStyle: React.CSSProperties = {
  borderBottom: `1px solid ${semanticColors.surfaceBorder}`,
  color: semanticColors.textSubtle,
  padding: "10px 12px",
  textAlign: "left",
  verticalAlign: "top",
};

const horizontalRuleStyle: React.CSSProperties = {
  border: 0,
  borderTop: `1px solid ${semanticColors.surfaceBorder}`,
  margin: "16px 0",
};

const mermaidContainerStyle: React.CSSProperties = {
  margin: "0 0 1em",
  overflowX: "auto",
};

const mermaidErrorStyle: React.CSSProperties = {
  background: semanticColors.warningBackground,
  border: `1px solid ${semanticColors.warningBorder}`,
  borderRadius: "6px",
  color: semanticColors.warningText,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: "12px",
  padding: "12px",
  whiteSpace: "pre-wrap",
};

let mermaidInitialized = false;

interface MermaidBlockProps {
  chart: string;
}

const MermaidBlock: React.FC<MermaidBlockProps> = ({ chart }: MermaidBlockProps) => {
  const [svg, setSvg] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const renderId = React.useId().replace(/:/g, "-");

  React.useEffect(() => {
    let cancelled = false;

    const renderChart = async (): Promise<void> => {
      try {
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: "default",
            fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
            flowchart: {
              curve: "basis",
              htmlLabels: true,
            },
            sequence: {
              useMaxWidth: true,
              showSequenceNumbers: false,
            },
            themeVariables: {
              background: "#f8fbff",
              fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
              fontSize: "14px",
              textColor: "#334155",
              primaryColor: "#eff6ff",
              primaryTextColor: "#1d4ed8",
              primaryBorderColor: "#cbd5e1",
              secondaryColor: "#eff6ff",
              secondaryTextColor: "#1d4ed8",
              secondaryBorderColor: "#cbd5e1",
              tertiaryColor: "#eff6ff",
              tertiaryTextColor: "#1d4ed8",
              tertiaryBorderColor: "#cbd5e1",
              lineColor: "#64748b",
              nodeBorder: "#cbd5e1",
              clusterBkg: "#f8fbff",
              clusterBorder: "#dbe3ee",
              edgeLabelBackground: "#f8fbff",
              actorBorder: "#cbd5e1",
              actorBkg: "#eff6ff",
              actorTextColor: "#1e3a8a",
              labelBoxBkgColor: "#ffffff",
              labelBoxBorderColor: "#dbe3ee",
              noteBkgColor: "#fff7e6",
              noteBorderColor: "#f0c36d",
              noteTextColor: "#7a4b00",
              activationBorderColor: "#93c5fd",
              activationBkgColor: "#dbeafe",
              sectionBkgColor: "#f8fafc",
              sectionBkgColor2: "#ffffff",
              sectionBorderColor: "#dbe3ee",
              taskBorderColor: "#93c5fd",
              taskBkgColor: "#dbeafe",
              taskTextColor: "#1e3a8a",
              taskTextLightColor: "#1e3a8a",
              todayLineColor: "#2563eb",
              cScale0: "#dbeafe",
              cScale1: "#dcfce7",
              cScale2: "#ede9fe",
              cScale3: "#fef3c7",
              cScale4: "#ffe4e6",
              cScale5: "#e0f2fe",
              cScale6: "#ecfccb",
              cScale7: "#f3e8ff",
            },
          });
          mermaidInitialized = true;
        }

        const { svg: renderedSvg } = await mermaid.render(`mermaid-${renderId}`, chart);

        if (!cancelled) {
          setSvg(renderedSvg);
          setError("");
        }
      } catch (renderError) {
        if (!cancelled) {
          setSvg("");
          setError(
            renderError instanceof Error
              ? renderError.message
              : "Mermaid diagram could not be rendered.",
          );
        }
      }
    };

    void renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, renderId]);

  if (error) {
    return <div style={mermaidErrorStyle}>{error}</div>;
  }

  return <div style={mermaidContainerStyle} dangerouslySetInnerHTML={{ __html: svg }} />;
};

const MarkdownViewerView: React.FC<MarkdownViewerViewProps> = ({
  markdown,
  showBackgroundColor,
}: MarkdownViewerViewProps) => {
  const resolvedContainerStyle: React.CSSProperties = {
    ...containerStyle,
    background: showBackgroundColor ? semanticColors.surface : "transparent",
    border: showBackgroundColor ? `1px solid ${semanticColors.surfaceBorder}` : "none",
  };

  if (!markdown.trim()) {
    return (
      <div className="markdown-viewer" style={resolvedContainerStyle}>
        <div style={emptyStateStyle}>Kein Markdown-Inhalt vorhanden.</div>
      </div>
    );
  }

  return (
    <div className="markdown-viewer" style={resolvedContainerStyle}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ul: ({ node, ...props }) => {
            const isTaskList = props.className?.includes("contains-task-list") || props.className?.includes("task-list");

            return <ul {...props} style={isTaskList ? taskListContainerStyle : listStyle} />;
          },
          ol: ({ node, ...props }) => <ol {...props} style={listStyle} />,
          li: ({ node, children, ...props }) => {
            const taskListProps = props as React.LiHTMLAttributes<HTMLLIElement> & {
              checked?: boolean | null;
            };
            const isTaskListItem =
              taskListProps.className?.includes("task-list-item") ||
              taskListProps.checked !== null && taskListProps.checked !== undefined;

            return (
              <li
                {...props}
                style={isTaskListItem ? taskListStyle : listItemStyle}
              >
                {isTaskListItem ? (
                  <span style={taskListItemContentStyle}>{children}</span>
                ) : (
                  children
                )}
              </li>
            );
          },
          table: ({ node, ...props }) => (
            <div style={tableWrapperStyle}>
              <table {...props} style={tableStyle} />
            </div>
          ),
          th: ({ node, ...props }) => <th {...props} style={tableHeaderCellStyle} />,
          td: ({ node, ...props }) => <td {...props} style={tableCellStyle} />,
          hr: ({ node, ...props }) => <hr {...props} style={horizontalRuleStyle} />,
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            if (match?.[1] === "mermaid") {
              return <MermaidBlock chart={code} />;
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewerView;
