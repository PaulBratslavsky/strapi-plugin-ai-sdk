import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { ToolCall } from '../hooks/useChat';

// --- Helpers ---

function buildContentManagerUrl(contentType: string, documentId?: string): string {
  const base = `/content-manager/collection-types/${contentType}`;
  return documentId ? `${base}/${documentId}` : base;
}

interface ContentLink {
  label: string;
  to: string;
}

function extractContentLinks(toolCall: ToolCall): ContentLink[] {
  if (toolCall.output === undefined) return [];

  const input = toolCall.input as Record<string, unknown> | undefined;
  const output = toolCall.output as Record<string, unknown> | undefined;
  if (!input || !output) return [];

  const contentType = input.contentType as string | undefined;
  if (!contentType) return [];

  if (toolCall.toolName === 'searchContent') {
    const results = output.results as Array<Record<string, unknown>> | undefined;
    const links: ContentLink[] = [
      { label: contentType, to: buildContentManagerUrl(contentType) },
    ];
    if (results && results.length > 0) {
      for (const entry of results.slice(0, 5)) {
        const docId = entry.documentId as string | undefined;
        if (!docId) continue;
        const title =
          (entry.title as string) ||
          (entry.name as string) ||
          (entry.slug as string) ||
          docId;
        links.push({
          label: String(title),
          to: buildContentManagerUrl(contentType, docId),
        });
      }
    }
    return links;
  }

  if (toolCall.toolName === 'writeContent') {
    const doc = output.document as Record<string, unknown> | undefined;
    const docId = doc?.documentId as string | undefined;
    if (docId) {
      const title =
        (doc?.title as string) || (doc?.name as string) || docId;
      return [
        {
          label: `${input.action === 'create' ? 'Created' : 'Updated'}: ${title}`,
          to: buildContentManagerUrl(contentType, docId),
        },
      ];
    }
    return [{ label: contentType, to: buildContentManagerUrl(contentType) }];
  }

  return [];
}

// --- Styled Components ---

const ToolCallBox = styled.div`
  margin-top: 8px;
  border: 1px solid #dcdce4;
  border-radius: 8px;
  overflow: hidden;
  font-size: 13px;
`;

const ToolCallHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 12px;
  background: #eaeaef;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #32324d;
  text-align: left;

  &:hover {
    background: #dcdce4;
  }
`;

const Spinner = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #a5a5ba;
  border-top-color: #4945ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-left: auto;
  flex-shrink: 0;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ToolCallContent = styled.pre`
  margin: 0;
  padding: 8px 12px;
  background: #fafafa;
  font-size: 11px;
  line-height: 1.4;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ContentLinksRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px 12px;
  background: #f6f6f9;
  border-top: 1px solid #eaeaef;
`;

const ContentLinkChip = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #dcdce4;
  color: #4945ff;
  font-size: 11px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: #c0c0cf;
  }
`;

// --- Component ---

export const HIDDEN_TOOLS = new Set<string>();

export function ToolCallDisplay({ toolCall }: Readonly<{ toolCall: ToolCall }>) {
  const [expanded, setExpanded] = useState(false);
  const contentLinks = extractContentLinks(toolCall);

  return (
    <ToolCallBox>
      <ToolCallHeader onClick={() => setExpanded(!expanded)}>
        <span>{expanded ? '\u25BC' : '\u25B6'}</span>
        <span>Tool: {toolCall.toolName}</span>
        {toolCall.output === undefined
          ? <Spinner />
          : <span style={{ marginLeft: 'auto', fontWeight: 400, opacity: 0.6 }}>completed</span>
        }
      </ToolCallHeader>
      {contentLinks.length > 0 && (
        <ContentLinksRow>
          {contentLinks.map((link) => (
            <ContentLinkChip key={link.to} to={link.to}>
              {link.label}
            </ContentLinkChip>
          ))}
        </ContentLinksRow>
      )}
      {expanded && (
        <ToolCallContent>
          {toolCall.output === undefined
            ? 'Waiting for result...'
            : JSON.stringify(toolCall.output, null, 2)}
        </ToolCallContent>
      )}
    </ToolCallBox>
  );
}
