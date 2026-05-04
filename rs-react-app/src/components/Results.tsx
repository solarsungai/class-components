import { PureComponent } from 'react';
import ResultItem from './ResultItem';

type PokemonData = {
  name: string;
  id: number;
  image: string;
  types: string[];
  height: number;
  weight: number;
  baseExperience: number;
  abilities: string[];
};

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