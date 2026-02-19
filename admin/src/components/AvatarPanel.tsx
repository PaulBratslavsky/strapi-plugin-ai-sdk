import styled from 'styled-components';
import { Avatar3D } from './Avatar3D/Avatar3D';

const Panel = styled.div`
  width: 280px;
  min-width: 280px;
  border-right: 1px solid #eaeaef;
  background: linear-gradient(180deg, #f0f0ff 0%, #f6f6f9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  gap: 12px;
`;

const AvatarContainer = styled.div`
  width: 250px;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg, #e8e8ff 0%, #f0f0f8 100%);
  box-shadow: 0 2px 8px rgba(73, 69, 255, 0.1);
`;

const Label = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #666687;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export function AvatarPanel() {
  return (
    <Panel>
      <AvatarContainer>
        <Avatar3D />
      </AvatarContainer>
      <Label>AI Assistant</Label>
    </Panel>
  );
}
