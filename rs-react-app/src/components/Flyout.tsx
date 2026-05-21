import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAllSelections } from '../store/pokemonSlice';
import type { RootState } from '../store';

function Flyout() {
  const selectedPokemons = useSelector(
    (state: RootState) => state.pokemon.selectedNames
  );
  const dispatch = useDispatch();
  const hasItems = selectedPokemons.length > 0;
  const [shouldRender, setShouldRender] = useState(hasItems);

  if (hasItems && !shouldRender) setShouldRender(true);

  useEffect(() => {
    if (!hasItems) {
      const timer = setTimeout(() => setShouldRender(false), 280);
      return () => clearTimeout(timer);
    }
  }, [hasItems]);

  if (!hasItems) return null;

  const handleUnselectAll = () => {
    dispatch(clearAllSelections());
  };

  const handleDownload = () => {
    console.log(`Downloading CSV for: ${selectedPokemons.join(', ')}`);
  };

  return (
    <div className={`flyout-box${!hasItems ? ' flyout-box--hiding' : ''}`}>
      <div className="flyout-header">
        <h3>Selected Pokémon ({selectedPokemons.length})</h3>
        <div className="flyout-buttons">
          <button
            type="button"
            className="btn-unselect"
            onClick={handleUnselectAll}
          >
            Unselect all
          </button>
          <button
            type="button"
            className="btn-download"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
      <div className="flyout-list">
        {selectedPokemons.map((pokemon) => (
          <div className="flyout-item" key={pokemon}>
            <span className="pokemon-name">{pokemon}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Flyout;
