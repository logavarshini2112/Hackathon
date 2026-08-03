import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { initTheme } from './utils/theme';

export default function App() {
  useEffect(() => {
    initTheme();
  }, []);

  return <AppRoutes />;
}
