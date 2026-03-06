import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import type { ToolSource } from '../hooks/useToolSources';

const Wrapper = styled.div`
  position: relative;
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #dcdce4;
  border-radius: 4px;
  background: #ffffff;
  color: #666687;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #f0f0f5;
    color: #4945ff;
    border-color: #4945ff;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Popover = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 10;
  width: 240px;
  max-height: 360px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #dcdce4;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(33, 33, 52, 0.12);
  padding: 8px 0;
`;

const SourceRow = styled.label`
  display: flex;
  flex-direction: column;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #32324d;

  &:hover {
    background: #f6f6f9;
  }
`;

const SourceMain = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const Badge = styled.div`
  font-size: 11px;
  color: #a5a5ba;
  margin-left: 24px;
  margin-top: 1px;
`;

const Toggle = styled.input`
  accent-color: #4945ff;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin: 0;
`;

const Header = styled.div`
  padding: 6px 12px 4px;
  font-size: 11px;
  font-weight: 600;
  color: #a5a5ba;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

interface Props {
  sources: ToolSource[];
  enabledSources: Set<string>;
  onToggle: (id: string) => void;
}

export function ToolSourcePicker({ sources, enabledSources, onToggle }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const builtIn = sources.find((s) => s.id === 'built-in');
  const plugins = sources.filter((s) => s.id !== 'built-in');

  if (sources.length === 0) return null;

  return (
    <Wrapper ref={ref}>
      <IconBtn onClick={() => setOpen((p) => !p)} aria-label="Tool sources">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2.5L13 6l-7 7H2.5v-3.5l7-7z" />
          <path d="M8 4l4 4" />
        </svg>
      </IconBtn>
      {open && (
        <Popover>
          {builtIn && (
            <>
              <Header>Built-in</Header>
              <SourceRow>
                <SourceMain>
                  <Toggle type="checkbox" checked disabled />
                  {builtIn.label}
                </SourceMain>
                <Badge>{builtIn.toolCount} tools</Badge>
              </SourceRow>
            </>
          )}
          {plugins.length > 0 && (
            <>
              <Header>Plugins</Header>
              {plugins.map((s) => (
                <SourceRow key={s.id}>
                  <SourceMain>
                    <Toggle
                      type="checkbox"
                      checked={enabledSources.has(s.id)}
                      onChange={() => onToggle(s.id)}
                    />
                    {s.label}
                  </SourceMain>
                  <Badge>{s.toolCount} tools</Badge>
                </SourceRow>
              ))}
            </>
          )}
        </Popover>
      )}
    </Wrapper>
  );
}
