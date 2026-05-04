import { PureComponent } from 'react';
import ResultItem from './ResultItem';
import type { PokemonData } from '../types';

type ResultsProps = {
  results: PokemonData[];
};

class Results extends PureComponent<ResultsProps> {
    render() {
        return (
            <div className="results">
                {this.props.results.map((pokemon) => (
                    <ResultItem key={pokemon.id} pokemon={pokemon} />
                ))}
            </div>
        );
    }
}

export default Results;