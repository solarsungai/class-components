import type { PokemonData } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { addPokemon, deletePokemon } from '@/store/pokemonSlice';
import type { RootState } from '@/store';
import PokemonInfoBlock from './PokemonInfoBlock';

type ResultItemProps = {
  pokemon: PokemonData;
  onSelect: (name: string) => void;
};

function ResultItem({ pokemon, onSelect }: ResultItemProps) {
  const dispatch = useDispatch();
  const selectedNames = useSelector((state: RootState) => state.pokemon.selectedNames);
  const isSelected = selectedNames.includes(pokemon.name);

  const types = pokemon.types ?? [];
  const abilities = pokemon.abilities ?? [];
  const hasExtraDetails =
    Boolean(pokemon.image) ||
    types.length > 0 ||
    abilities.length > 0 ||
    (pokemon.height !== undefined &&
      pokemon.weight !== undefined &&
      pokemon.baseExperience !== undefined);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect(pokemon.name);
  };

  return (
    <div className="pokemon-card" onClick={handleCardClick}>
      <div className="pokemon-header">
        <label className="pokemon-checkbox-label" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            className="pokemon-checkbox"
            checked={isSelected}
            onChange={() => {
              if (isSelected) {
                dispatch(deletePokemon(pokemon.name));
              } else {
                dispatch(addPokemon(pokemon.name));
              }
            }}
          />
          <span className="pokemon-checkbox-custom" />
        </label>
        <h2 className="pokemon-name">{pokemon.name}</h2>
      </div>
      {pokemon.image && <Image src={pokemon.image} alt={pokemon.name} className="pokemon-image" width={112} height={112}/>}

      {hasExtraDetails && (
        <PokemonInfoBlock
          types={types}
          abilities={abilities}
          height={pokemon.height}
          weight={pokemon.weight}
          baseExperience={pokemon.baseExperience}
        />
      )}
    </div>
  );
}

export default ResultItem;
