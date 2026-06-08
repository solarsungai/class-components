import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import submissionsReducer from './store/submissionsSlice';
import countriesReducer from './store/countriesSlice';
import type { RootState } from './store';

type PreloadedState = {
  submissions?: RootState['submissions'];
  countries?: RootState['countries'];
};

export function createTestStore(preloadedState?: PreloadedState) {
  return configureStore({
    reducer: {
      submissions: submissionsReducer,
      countries: countriesReducer,
    },
    preloadedState: preloadedState as Parameters<typeof configureStore>[0]['preloadedState'],
  });
}

export function renderWithStore(
  ui: React.ReactElement,
  preloadedState?: PreloadedState,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { ...render(ui, { wrapper: Wrapper, ...options }), store };
}
