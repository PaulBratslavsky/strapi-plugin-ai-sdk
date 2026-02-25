import React from 'react'
import { createRoot } from 'react-dom/client'
import { StrapiChat } from './components/strapi-chat'
import cssText from './styles.css?inline'
import { detectStrapiUrl, getScriptData } from './auto-detect'

function mount() {
  const strapiUrl = detectStrapiUrl()
  const apiToken = getScriptData('apiToken')
  const systemPrompt = getScriptData('systemPrompt')

  // Create host element
  const host = document.createElement('div')
  host.id = 'strapi-chat-widget'
  host.style.cssText = 'position:fixed;z-index:2147483647;bottom:0;right:0;pointer-events:none;'
  document.body.appendChild(host)

  // Attach Shadow DOM
  const shadow = host.attachShadow({ mode: 'open' })

  // Inject styles
  const style = document.createElement('style')
  style.textContent = cssText
  shadow.appendChild(style)

  // React mount point
  const mountPoint = document.createElement('div')
  mountPoint.id = 'strapi-chat-root'
  mountPoint.style.cssText = 'pointer-events:auto;'
  shadow.appendChild(mountPoint)

  // Render
  const root = createRoot(mountPoint)
  root.render(
    React.createElement(StrapiChat, { strapiUrl, apiToken, systemPrompt })
  )
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}
