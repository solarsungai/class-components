import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAllSelections } from '../store/pokemonSlice';
import type { RootState } from '../store';
import type { PokemonData } from '../types';
import { SERVER_URL } from '../constants';
import { fetchPokemonByTerm } from '../services/api';

function Flyout() {
  const selectedPokemons = useSelector(
    (state: RootState) => state.pokemon.selectedNames
  );
  const dispatch = useDispatch();
  const [downloadError, setDownloadError] = useState<string | null>(null);
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
    setDownloadError(null);
  };

  const handleDownload = async () => {
    try {
    setDownloadError(null);
    const results: PokemonData[] = await Promise.all(selectedPokemons.map(pokemon => fetchPokemonByTerm(SERVER_URL, pokemon)));
    let csvContent = 'Name,Types,Height (m),Weight (kg),Base XP,Details URL\n';
    results.forEach((pokemon) => {
      const pokemonTypes = pokemon.types ? pokemon.types.join(', ') : 'none';
      const heightM = pokemon.height ? pokemon.height / 10 : 0;
      const weightKg = pokemon.weight ? pokemon.weight / 10 : 0;
      const detailsUrl = `${window.location.origin}/?page=1&search=${pokemon.name}`;
      csvContent += `"${pokemon.name}","${pokemonTypes}",${heightM},${weightKg},${pokemon.baseExperience},"${detailsUrl}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `selected__pokemons_${results.length}.csv`);
    link.click();
    URL.revokeObjectURL(url);
    } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    setDownloadError(`(Download failed: ${errorMessage})`);
    }
  };

  return (
    <div className={`flyout-box${!hasItems ? ' flyout-box--hiding' : ''}`}>
      <div className="flyout-header">
        <h3>Selected Pokémon ({selectedPokemons.length})
          {downloadError && (
            <span className="flyout-error">
              {downloadError}
            </span>
          )}
        </h3>
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
