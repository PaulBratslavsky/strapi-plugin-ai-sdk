import { Main } from '@strapi/design-system';
import { Layouts } from '@strapi/strapi/admin';
import { Chat } from '../components/Chat';
import { AvatarAnimationProvider } from '../context/AvatarAnimationContext';

const HomePage = () => {
  return (
    <Main>
      <Layouts.Header
        title="AI Chat"
        subtitle="Chat with AI powered by Vercel AI SDK"
      />
      <Layouts.Content>
        <AvatarAnimationProvider>
          <Chat />
        </AvatarAnimationProvider>
      </Layouts.Content>
    </Main>
  );
};

export { HomePage };
