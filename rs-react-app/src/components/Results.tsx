import ResultItem from './ResultItem';
import type { PokemonData } from '../types';

type ResultsProps = {
  results: PokemonData[];
  onSelect: (name: string) => void;
};

function Results({ results, onSelect }: ResultsProps) {
  return results.length === 0 ? (
    <div className="results-empty">
      <h3>No results yet</h3>
      <p>Enter a Pokémon name and click Search to see details.</p>
    </div>
  ) : (
    <div className="results">
      {results.map((pokemon, index) => (
        <ResultItem
          key={`${pokemon.name}-${index}`}
          pokemon={pokemon}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default Results;
