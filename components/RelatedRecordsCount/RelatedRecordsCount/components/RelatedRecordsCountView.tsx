import * as React from "react";
import {
  accentColors,
  semanticColors,
} from "../../../shared/theme";

export interface RelatedRecordsCountViewProps {
  count: string;
  countColor: string;
  subtitle: string;
  message: string;
  isLoading: boolean;
  showBackgroundColor: boolean;
}

const containerStyle: React.CSSProperties = {
  alignItems: "center",
  background: semanticColors.surface,
  border: `1px solid ${semanticColors.surfaceBorder}`,
  borderRadius: "8px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  height: "100%",
  justifyContent: "center",
  minHeight: "120px",
  padding: "16px",
  textAlign: "center",
};

const countStyle: React.CSSProperties = {
  color: accentColors.brandBlue,
  fontSize: "clamp(24px, 8vw, 40px)",
  fontWeight: 700,
  lineHeight: 1,
  maxWidth: "100%",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

const subtitleStyle: React.CSSProperties = {
  color: semanticColors.textSubtle,
  fontSize: "13px",
  lineHeight: 1.4,
};

const messageStyle: React.CSSProperties = {
  background: semanticColors.warningBackground,
  border: `1px solid ${semanticColors.warningBorder}`,
  borderRadius: "6px",
  color: semanticColors.warningText,
  fontSize: "13px",
  lineHeight: 1.4,
  maxWidth: "100%",
  padding: "8px 10px",
};

const loadingContainerStyle: React.CSSProperties = {
  alignItems: "center",
  color: semanticColors.textSubtle,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  justifyContent: "center",
  minHeight: "72px",
};

const loadingTextStyle: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: 1.4,
};

const RelatedRecordsCountView: React.FC<RelatedRecordsCountViewProps> = ({
  count,
  countColor,
  subtitle,
  message,
  isLoading,
  showBackgroundColor,
}: RelatedRecordsCountViewProps) => {
  const resolvedContainerStyle: React.CSSProperties = {
    ...containerStyle,
    background: showBackgroundColor ? semanticColors.surface : "transparent",
    border: showBackgroundColor ? `1px solid ${semanticColors.surfaceBorder}` : "none",
  };

  return (
    <div className="related-records-count" style={resolvedContainerStyle}>
      {isLoading ? (
        <div style={loadingContainerStyle}>
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke={semanticColors.surfaceBorder}
              strokeWidth="3"
            />
            <path
              d="M12 3a9 9 0 0 1 9 9"
              fill="none"
              stroke={countColor}
              strokeLinecap="round"
              strokeWidth="3"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                dur="0.8s"
                from="0 12 12"
                repeatCount="indefinite"
                to="360 12 12"
                type="rotate"
              />
            </path>
          </svg>
          <div style={loadingTextStyle}>Daten werden geladen...</div>
        </div>
      ) : (
        <>
          <div
            className="related-records-count__value"
            style={{ ...countStyle, color: countColor }}
          >
            {count}
          </div>
          {!!subtitle && (
            <div className="related-records-count__label" style={subtitleStyle}>
              {subtitle}
            </div>
          )}
        </>
      )}
      {!!message && (
        <div className="related-records-count__message" style={messageStyle}>
          {message}
        </div>
      )}
    </div>
  );
};

export default RelatedRecordsCountView;
