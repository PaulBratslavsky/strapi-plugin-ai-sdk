import { useRef, useEffect, useState, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Avatar3D } from './avatar-3d'

interface StrapiChatProps {
  strapiUrl: string
  apiToken?: string
  systemPrompt?: string
}

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

function getTriggeredAnimation(messages: Array<{ role: string; parts: Array<any> }>): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    if (msg.role !== 'assistant') continue
    for (let j = msg.parts.length - 1; j >= 0; j--) {
      const part = msg.parts[j]
      if (part.type === 'tool-triggerAnimation' || (part.type === 'dynamic-tool' && part.toolName === 'triggerAnimation')) {
        return (part.input as any)?.animation ?? null
      }
    }
  }
  return null
}

// Inline SVG icons to avoid lucide-react dependency
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export function StrapiChat({ strapiUrl, apiToken, systemPrompt }: Readonly<StrapiChatProps>) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${strapiUrl}/api/ai-sdk/public-chat`,
        headers: apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined,
        body: systemPrompt ? { system: systemPrompt } : undefined,
      }),
    [strapiUrl, apiToken, systemPrompt]
  )

  const { messages, sendMessage, status } = useChat({ transport })

  const isStreaming = status === 'streaming' || status === 'submitted'

  const triggeredAnimation = getTriggeredAnimation(messages)
  const headerAnimation = triggeredAnimation || (isStreaming ? 'speak' : 'idle')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, status])

  const handleSubmit = (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.()
    const text = input.trim()
    if (!text || isStreaming) return
    setInput('')
    sendMessage({ text })
  }

  const modelUrl = `${strapiUrl}/models/avatar.glb`

  return (
    <>
      {/* Floating trigger */}
      <button
        className="sc-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
      >
        <Avatar3D animation="idle" modelUrl={modelUrl} />
      </button>

      {/* Overlay */}
      {open && (
        <button type="button" className="sc-overlay" onClick={() => setOpen(false)} aria-label="Close chat" />
      )}

      {/* Side panel */}
      <div className={`sc-panel ${open ? 'sc-panel--open' : 'sc-panel--closed'}`}>
        {/* Header */}
        <div className="sc-header">
          <div className="sc-header-avatar">
            <Avatar3D animation={headerAnimation} modelUrl={modelUrl} />
          </div>
          <div className="sc-header-info">
            <h2 className="sc-header-title">AI Assistant</h2>
            <p className="sc-header-subtitle">
              {messages.length} message{messages.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            className="sc-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="sc-messages">
          {messages.length === 0 && (
            <div className="sc-welcome">
              <div className="sc-welcome-avatar">
                <Avatar3D animation="wave" modelUrl={modelUrl} />
              </div>
              <p className="sc-welcome-title">Hey there!</p>
              <p className="sc-welcome-subtitle">Ask me anything about the site.</p>
            </div>
          )}

          {messages.map((message) => {
            const text = getMessageText(message)
            if (!text) return null
            const isUser = message.role === 'user'
            return (
              <div
                key={message.id}
                className={`sc-msg-row ${isUser ? 'sc-msg-row--user' : 'sc-msg-row--assistant'}`}
              >
                <div className={`sc-msg-avatar ${isUser ? 'sc-msg-avatar--user' : 'sc-msg-avatar--assistant'}`}>
                  {isUser ? 'U' : 'AI'}
                </div>
                <div className={`sc-bubble ${isUser ? 'sc-bubble--user' : 'sc-bubble--assistant'}`}>
                  {isUser ? (
                    <p>{text}</p>
                  ) : (
                    <div className="sc-prose">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Loading / thinking indicator */}
          {(status === 'submitted' || status === 'streaming') && (
            <div className="sc-loading-row">
              <div className="sc-msg-avatar sc-msg-avatar--assistant">AI</div>
              <div className="sc-loading-bubble">
                <div className="sc-loading-dots">
                  <span className="sc-dot" />
                  <span className="sc-dot" />
                  <span className="sc-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="sc-input-area">
          <form className="sc-input-form" onSubmit={handleSubmit}>
            <div className="sc-input-wrap">
              <textarea
                className="sc-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder="Type a message..."
                rows={2}
                disabled={isStreaming}
              />
            </div>
            <button
              type="submit"
              className="sc-send-btn"
              disabled={isStreaming || !input.trim()}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
