import { PureComponent } from 'react';
import type { PokemonData } from '../types';

type ResultItemProps = {
  pokemon: PokemonData;
};

class ResultItem extends PureComponent<ResultItemProps> {
  render() {
    const { pokemon } = this.props;
    const types = pokemon.types ?? [];
    const abilities = pokemon.abilities ?? [];
    const hasStats =
      pokemon.height !== undefined
      && pokemon.weight !== undefined
      && pokemon.baseExperience !== undefined;
    const hasExtraDetails = Boolean(pokemon.image) || types.length > 0 || abilities.length > 0 || hasStats;

    return (
      <div className="pokemon-card">
        <div className="pokemon-header">
          <h2 className="pokemon-name">{pokemon.name}</h2>
        </div>

        {pokemon.image && (
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="pokemon-image"
          />
        )}

        {hasExtraDetails && (
          <div className="pokemon-info">
            {types.length > 0 && (
              <div className="info-group">
                <h3>Types</h3>
                <div className="tags">
                  {types.map((type) => (
                    <span key={type} className={`tag tag-${type}`}>{type}</span>
                  ))}
                </div>
              </div>
            )}

            {abilities.length > 0 && (
              <div className="info-group">
                <h3>Abilities</h3>
                <div className="tags">
                  {abilities.map((ability) => (
                    <span key={ability} className="tag tag-ability">{ability}</span>
                  ))}
                </div>
              </div>
            )}

            {hasStats && (
              <div className="pokemon-stats">
                <div className="stat">
                  <span className="label">Height:</span>
                  <span className="value">{pokemon.height! / 10} m</span>
                </div>
                <div className="stat">
                  <span className="label">Weight:</span>
                  <span className="value">{pokemon.weight! / 10} kg</span>
                </div>
                <div className="stat">
                  <span className="label">Base XP:</span>
                  <span className="value">{pokemon.baseExperience}</span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    );
  }
}

export default ResultItem;
