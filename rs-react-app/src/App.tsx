import { Routes as ReactRoutes, Route } from 'react-router';
import MainPage from './pages/MainPage';
import About from './pages/About';
import NotFound from './pages/NotFound';
import DetailPanel from './components/DetailPanel';
import { Routes } from './constants';

function App() {
  return (
    <ReactRoutes>
      <Route path={Routes.HOME} element={<MainPage />}>
        <Route path={Routes.DETAILS} element={<DetailPanel />} />
      </Route>
      <Route path={Routes.ABOUT} element={<About />} />
      <Route path={Routes.NOT_FOUND} element={<NotFound />} />
    </ReactRoutes>
  );
}

export default App;
