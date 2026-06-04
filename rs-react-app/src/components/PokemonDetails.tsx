type PokemonDetailsProps = {
  types?: string[];
  abilities?: string[];
  height?: number;
  weight?: number;
  baseExperience?: number;
};

function PokemonDetails({ types = [], abilities = [], height, weight, baseExperience }: PokemonDetailsProps) {
  const hasStats = height !== undefined && weight !== undefined && baseExperience !== undefined;

  return (
    <div className="pokemon-info">
      {types.length > 0 && (
        <div className="info-group">
          <h3>Types</h3>
          <div className="tags">
            {types.map((type) => (
              <span key={type} className={`tag tag-${type}`}>
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {abilities.length > 0 && (
        <div className="info-group">
          <h3>Abilities</h3>
          <div className="tags">
            {abilities.map((ability) => (
              <span key={ability} className="tag tag-ability">
                {ability}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasStats && (
        <div className="info-group">
          <h3>Stats</h3>
          <div className="detail-stats">
            {height != null && (
              <div className="stat-item">
                <span className="stat-label">Height</span>
                <span className="stat-value">{height / 10} m</span>
              </div>
            )}
            {weight != null && (
              <div className="stat-item">
                <span className="stat-label">Weight</span>
                <span className="stat-value">{weight / 10} kg</span>
              </div>
            )}
            {baseExperience != null && (
              <div className="stat-item">
                <span className="stat-label">Base XP</span>
                <span className="stat-value">{baseExperience}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PokemonDetails;
