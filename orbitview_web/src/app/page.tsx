'use client';

import LandingPage from './home/LandingPage';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';

export default function Home() {
  return (
    <Provider store={store}>
      {/* PersistGate helps with the rehydration of persisted Redux state */}
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <LandingPage />
      </PersistGate>
    </Provider>
  );
}
