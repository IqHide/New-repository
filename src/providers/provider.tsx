'use client';

import { HeroUIProvider } from '@heroui/react';
import { Provider } from 'react-redux';
import { store } from '@/store/redux/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </Provider>
  );
}
