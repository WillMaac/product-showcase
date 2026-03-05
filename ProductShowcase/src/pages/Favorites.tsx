import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPokemonList, getPokemonByName } from "../api/pokemonService";
import { useTeam } from "../context/TeamContext";
import type { PokemonListItem } from "../types/pokemon";
import { typeColors } from "../utils/typeColors";

export default function Favorites() {
  const navigate = useNavigate();
  const { team, removePokemon } = useTeam();

  // Estado com a lista completa (usado para filtrar favoritos)
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);

  // Mapeamento: nome do Pokémon  array de tipos
  const [pokemonTypes, setPokemonTypes] = useState<Record<string, string[]>>(
    {},
  );

  const [error, setError] = useState<string | null>(null);

  /** Carrega a lista base de Pokémon apenas uma vez. Utiliza localStorage para evitar requisições repetidas.
   */
  useEffect(() => {
    const loadList = async () => {
      try {
        const cached = localStorage.getItem("pokemon-list");

        if (cached) {
          setPokemons(JSON.parse(cached));
          return;
        }

        const data = await getPokemonList(151);
        setPokemons(data.results);

        // Cache simples para melhorar performance
        localStorage.setItem("pokemon-list", JSON.stringify(data.results));
      } catch {
        setError("Não foi possível carregar a lista de Pokémon.");
      }
    };

    loadList();
  }, []);

 /* Atualiza os tipos quando o time muda.
   Se acessar /favoritos direto, busca só os tipos do time. */
  useEffect(() => {
    const loadTypes = async () => {
      try {
        if (team.length === 0) return;

        const cachedTypes = localStorage.getItem("pokemon-types");

        if (cachedTypes) {
          setPokemonTypes(JSON.parse(cachedTypes));
          return;
        }

        // Busca ao mesmo tempo que os detalhes apenas dos Pokémon do time
        const results = await Promise.all(
          team.map(async (name) => {
            const detail = await getPokemonByName(name);

            return {
              name,
              types: detail.types.map(
                (t: { type: { name: string } }) => t.type.name,
              ),
            };
          }),
        );

        const typesMap: Record<string, string[]> = {};
        results.forEach(({ name, types }) => {
          typesMap[name] = types;
        });

        setPokemonTypes(typesMap);

        // Cache dos tipos para evitar novas requisições futuras
        localStorage.setItem("pokemon-types", JSON.stringify(typesMap));
      } catch {
        setError(
          "Não foi possível carregar os favoritos. Verifique sua conexão.",
        );
      }
    };

    loadTypes();
  }, [team]);

  // Filtra apenas os Pokémon que estão no time
  const favoritePokemons = pokemons.filter((p) => team.includes(p.name));

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <div className="w-full px-6 mt-6 mb-4">
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-400 hover:bg-yellow-500 text-black
                     px-4 py-2 rounded-lg font-bold shadow-md cursor-pointer"
        >
          ← Voltar
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mb-8">Favoritos</h2>

      {error && (
        <p className="text-red-500 font-semibold text-center px-4 mt-4">
          {error}
        </p>
      )}

      {!error && favoritePokemons.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          Nenhum Pokémon no time ainda.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {favoritePokemons.map((pokemon) => {
          // Extraímos o ID da URL retornada pela API
          const id = pokemon.url.split("/").filter(Boolean).pop();

          // Montamos manualmente a URL da imagem do pokemon
          const imageUrl = id
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            : "";

          const types = pokemonTypes[pokemon.name] || [];

          return (
            <div
              key={pokemon.name}
              className="bg-white rounded-3xl shadow-xl p-4 text-center"
            >
              <div className="w-full h-24 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={pokemon.name}
                  className="h-20 w-20 object-contain"
                />
              </div>

              <h3 className="capitalize font-bold mt-2 mb-1">{pokemon.name}</h3>

              <div className="flex flex-wrap justify-center gap-1 mb-2">
                {types.map((type) => (
                  <span
                    key={type}
                    className={`${typeColors[type] || "bg-gray-300"}
                                text-white text-xs px-2 py-0.5 rounded-full capitalize`}
                  >
                    {type}
                  </span>
                ))}
              </div>

              <button
                onClick={() => removePokemon(pokemon.name)}
                className="bg-red-500 hover:bg-red-600 text-white
                           px-3 py-1 rounded-lg text-sm transition"
              >
                Remover do Time
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
