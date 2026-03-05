import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPokemonList, getPokemonByName } from "../api/pokemonService";
import type { PokemonListItem } from "../types/pokemon";
import Loader from "../components/Loader";
import { useTeam } from "../context/TeamContext";
import { typeColors } from "../utils/typeColors";

export default function Home() {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [pokemonTypes, setPokemonTypes] = useState<Record<string, string[]>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const { team, addPokemon, removePokemon } = useTeam();
  const navigate = useNavigate();

  const isFavorite = (name: string) => team.includes(name);

  // Memoizada para evitar recriação a cada render e manter estável no useEffect
  const loadTypes = useCallback(async (list: PokemonListItem[]) => {
    const cachedTypes = localStorage.getItem("pokemon-types");
    if (cachedTypes) {
      setPokemonTypes(JSON.parse(cachedTypes));
      return;
    }

    // Busca os detalhes ao mesmo tempo para reduzir tempo total de carregamento
    const results = await Promise.all(
      list.map(async (p) => {
        const detail = await getPokemonByName(p.name);
        return {
          name: p.name,
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
    localStorage.setItem("pokemon-types", JSON.stringify(typesMap));
  }, []);

  const refreshList = async () => {
    setLoading(true);
    setError(null);

    try {
      // Limpa cache para forçar atualização real da API
      localStorage.removeItem("pokemon-list");
      localStorage.removeItem("pokemon-types");

      const data = await getPokemonList(151);
      setPokemons(data.results);
      localStorage.setItem("pokemon-list", JSON.stringify(data.results));

      await loadTypes(data.results);
    } catch {
      setError("Não foi possível atualizar a lista. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const cached = localStorage.getItem("pokemon-list");
        let list: PokemonListItem[];

        if (cached) {
          list = JSON.parse(cached);
          setPokemons(list);
        } else {
          const data = await getPokemonList(151);
          list = data.results;
          setPokemons(list);
          localStorage.setItem("pokemon-list", JSON.stringify(list));
        }

        await loadTypes(list);
      } catch {
        setError(
          "Não foi possível carregar os Pokémon. Verifique sua conexão.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [loadTypes]);

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 font-semibold text-center px-4">{error}</p>
        <button
          onClick={refreshList}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    );

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-4">
        Pokédex
      </h1>

      <div className="flex items-center justify-center sm:justify-between gap-3 mb-6">
        <button
          onClick={refreshList}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg
                     hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Atualizar Lista
        </button>

        <button
          onClick={() => navigate("/favoritos")}
          className="bg-yellow-400 hover:bg-yellow-500 text-black
                     px-4 py-2 rounded-lg font-semibold shadow-md
                     text-sm sm:text-base"
        >
          Favoritos
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg p-2 w-full max-w-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {pokemons
          .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
          .map((pokemon) => {
            // A lista não retorna a imagem.
            // Extraímos o ID da URL e montamos manualmente a URL da imagem.
            const id = pokemon.url.split("/").filter(Boolean).pop();

            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
            const types = pokemonTypes[pokemon.name] || [];

            return (
              <Link
                to={`/pokemon/${pokemon.name}`}
                key={pokemon.name}
                className="bg-white rounded-2xl shadow-lg p-3 text-center
                           hover:scale-105 transition flex flex-col items-center w-full"
              >
                <div className="w-full h-24 flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={pokemon.name}
                    className="h-20 w-20 object-contain"
                  />
                </div>

                <h2 className="capitalize mt-2 font-semibold text-sm md:text-base">
                  {pokemon.name}
                </h2>

                <div className="flex flex-wrap justify-center gap-1 mt-1">
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

                {/* Vai impedir a navegação ao clicar no botão dentro do Link */}
                <button
                  onClick={(e) => {
                    e.preventDefault();

                    if (isFavorite(pokemon.name)) {
                      removePokemon(pokemon.name);
                    } else {
                      if (team.length >= 6) {
                        alert("Você já atingiu o limite de 6 Pokémon!");
                        return;
                      }
                      addPokemon(pokemon.name);
                    }
                  }}
                  className={`mt-2 w-full text-white text-sm px-2 py-1 rounded-lg
                    shadow transition
                    ${isFavorite(pokemon.name) ? "bg-red-500" : "bg-black"}`}
                >
                  {isFavorite(pokemon.name) ? "Remover" : "Adicionar"}
                </button>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
