import { Routes, Route } from 'react-router';
import MainPage from './pages/MainPage';
import About from './pages/About';
import NotFound from './pages/NotFound';
import DetailPanel from './components/DetailPanel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}>
        <Route path="details/:name" element={<DetailPanel />} />
      </Route>
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
