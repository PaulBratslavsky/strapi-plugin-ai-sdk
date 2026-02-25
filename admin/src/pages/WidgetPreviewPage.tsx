import { Layouts } from '@strapi/strapi/admin';
import { Main, Box, Typography, Button, Flex } from '@strapi/design-system';
import { ArrowLeft } from '@strapi/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PLUGIN_ID } from '../pluginId';

function getStrapiOrigin() {
  return window.location.origin;
}

function getEmbedSnippet(origin: string) {
  return `<script src="${origin}/api/ai-sdk/widget.js"></script>`;
}

function getIframeHtml(origin: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; font-family: sans-serif; background: #f5f5f5; min-height: 100vh; }
  </style>
</head>
<body>
  <script src="${origin}/api/ai-sdk/widget.js"><\/script>
</body>
</html>`;
}

export function WidgetPreviewPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const origin = getStrapiOrigin();
  const embedSnippet = getEmbedSnippet(origin);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Main>
      <Layouts.Header
        title="Widget Preview"
        subtitle="Preview the embeddable chat widget as visitors will see it"
        navigationAction={
          <Button variant="ghost" startIcon={<ArrowLeft />} onClick={() => navigate(`/plugins/${PLUGIN_ID}`)}>
            Back to Chat
          </Button>
        }
      />
      <Layouts.Content>
        <Box padding={6} background="neutral0" shadow="filterShadow" hasRadius>
          <Typography variant="beta" tag="h2">
            Live Preview
          </Typography>
          <Box
            marginTop={4}
            style={{
              border: '1px solid #dcdce4',
              borderRadius: '4px',
              overflow: 'hidden',
              height: '500px',
            }}
          >
            <iframe
              title="Widget Preview"
              srcDoc={getIframeHtml(origin)}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </Box>
        </Box>

        <Box marginTop={6} padding={6} background="neutral0" shadow="filterShadow" hasRadius>
          <Typography variant="beta" tag="h2">
            Embed Code
          </Typography>
          <Typography variant="omega" textColor="neutral600" tag="p" style={{ marginTop: '8px' }}>
            Add this snippet to any HTML page to embed the chat widget:
          </Typography>
          <Box
            marginTop={4}
            padding={4}
            background="neutral100"
            hasRadius
            style={{ fontFamily: 'monospace', fontSize: '14px', wordBreak: 'break-all' }}
          >
            {embedSnippet}
          </Box>
          <Flex marginTop={4}>
            <Button variant="secondary" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Snippet'}
            </Button>
          </Flex>
        </Box>

        <Box marginTop={6} padding={6} background="neutral0" shadow="filterShadow" hasRadius>
          <Typography variant="beta" tag="h2">
            Development
          </Typography>
          <Typography variant="omega" textColor="neutral600" tag="p" style={{ marginTop: '8px' }}>
            To live-reload the widget during development, run:
          </Typography>
          <Box
            marginTop={4}
            padding={4}
            background="neutral100"
            hasRadius
            style={{ fontFamily: 'monospace', fontSize: '14px' }}
          >
            npm run dev:widget
          </Box>
          <Typography variant="pi" textColor="neutral500" tag="p" style={{ marginTop: '8px' }}>
            This watches the widget source and rebuilds on changes. Refresh the iframe to see updates.
          </Typography>
        </Box>
      </Layouts.Content>
    </Main>
  );
}
