import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import App from './App';
import { ThemeProvider } from './context/ThemeProvider';
import { store } from './store';

describe('App routing', () => {
  it('should render MainPage on "/" route', () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('should render About page on "/about" route', () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/about']}>
            <App />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
    expect(
      screen.getByRole('heading', { name: /about pokédex explorer/i })
    ).toBeInTheDocument();
  });

  it('should render NotFound page on unknown route', () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/this-does-not-exist']}>
            <App />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
  });
});
