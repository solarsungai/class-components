import { PureComponent } from 'react';
import ResultItem from './ResultItem';
import type { PokemonData } from '../types';

type ResultsProps = {
  results: PokemonData[];
};

class Results extends PureComponent<ResultsProps> {
    render() {
        if (this.props.results.length === 0) {
            return (
                <div className="results-empty">
                    <h3>No results yet</h3>
                    <p>Enter a Pokémon name and click Search to see details.</p>
                </div>
            );
        }

        return (
            <div className="results">
                {this.props.results.map((pokemon, index) => (
                    <ResultItem key={`${pokemon.name}-${index}`} pokemon={pokemon} />
                ))}
            </div>
        );
    }
}

export default Results;