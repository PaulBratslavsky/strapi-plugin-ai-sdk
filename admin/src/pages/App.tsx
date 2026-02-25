import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';

import { HomePage } from './HomePage';
import { MemoryStorePage } from './MemoryStorePage';

const App = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="memory-store" element={<MemoryStorePage />} />
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export { App };
