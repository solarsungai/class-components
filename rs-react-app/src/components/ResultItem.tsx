import { PureComponent } from 'react';

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

type ResultItemProps = {
  pokemon: PokemonData;
};

class ResultItem extends PureComponent<ResultItemProps> {
  render() {
    const { pokemon } = this.props;

    return (
      <div className="pokemon-card">
        <div className="pokemon-header">
          <span className="pokemon-id">#{pokemon.id}</span>
          <h2 className="pokemon-name">{pokemon.name}</h2>
        </div>

        <img 
          src={pokemon.image} 
          alt={pokemon.name} 
          className="pokemon-image" 
        />

        <div className="pokemon-info">
          <div className="info-group">
            <h3>Types</h3>
            <div className="tags">
              {pokemon.types.map(type => (
                <span key={type} className={`tag tag-${type}`}>{type}</span>
              ))}
            </div>
          </div>

          <div className="info-group">
            <h3>Abilities</h3>
            <div className="tags">
              {pokemon.abilities.map(ability => (
                <span key={ability} className="tag tag-ability">{ability}</span>
              ))}
            </div>
          </div>

          <div className="pokemon-stats">
            <div className="stat">
              <span className="label">Height:</span>
              <span className="value">{pokemon.height / 10} m</span>
            </div>
            <div className="stat">
              <span className="label">Weight:</span>
              <span className="value">{pokemon.weight / 10} kg</span>
            </div>
            <div className="stat">
              <span className="label">Base XP:</span>
              <span className="value">{pokemon.baseExperience}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResultItem;
