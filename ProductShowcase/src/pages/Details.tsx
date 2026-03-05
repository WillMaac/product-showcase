import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPokemonByName } from "../api/pokemonService";
import type { PokemonDetails } from "../types/pokemon";
import Loader from "../components/Loader";
import { typeColors } from "../utils/typeColors";
import { useTeam } from "../context/TeamContext";

export default function Details() {
  const { name }  = useParams();
  const navigate  = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const { team, addPokemon, removePokemon } = useTeam();

  // Verifica se o Pokémon atual já está no time
  const isFavorite = pokemon ? team.includes(pokemon.name) : false;

  useEffect(() => {
    if (!name) return;

    const fetchPokemon = async () => {
      try {
        // Busca detalhes completos usando o parâmetro da rota
        const data = await getPokemonByName(name);
        setPokemon(data);
      } catch {
        setError("Não foi possível carregar os detalhes. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  if (loading) return <Loader />;

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-red-500 font-semibold text-center px-4">{error}</p>
      <button
        onClick={() => navigate("/")}
        className="bg-yellow-400 hover:bg-yellow-500 text-black
                   px-4 py-2 rounded-lg font-bold shadow-md"
      >
        ← Voltar
      </button>
    </div>
  );

  if (!pokemon) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-gray-500 text-center">Pokémon não encontrado.</p>
      <button
        onClick={() => navigate("/")}
        className="bg-yellow-400 hover:bg-yellow-500 text-black
                   px-4 py-2 rounded-lg font-bold shadow-md"
      >
        ← Voltar
      </button>
    </div>
  );

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

      <h2 className="text-2xl font-bold text-gray-700 mb-8">
        Detalhes do Pokémon
      </h2>

      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold capitalize mb-4">{pokemon.name}</h1>

        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="w-48 md:w-64 mx-auto mb-4"
        />

        <button
          onClick={() => {
            if (isFavorite) {
              removePokemon(pokemon.name);
            } else {
              // Regra de negócio: limite de 6 Pokémon no time
              if (team.length >= 6) {
                alert("Você já atingiu o limite de 6 Pokémon no Time!");
                return;
              }
              addPokemon(pokemon.name);
            }
          }}
          className={`mt-4 px-6 py-2 rounded-lg text-white font-medium transition
            ${isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-black hover:bg-gray-800"}`}
        >
          {isFavorite ? "Remover do Time" : "Adicionar ao Time"}
        </button>

        <div className="space-y-2 mb-4 mt-6 text-left">
          {/* A API retorna height em decímetros e weight em hectogramas */}
          <p className="text-lg">
            <span className="font-semibold">Altura:</span> {pokemon.height / 10} m
          </p>
          <p className="text-lg">
            <span className="font-semibold">Peso:</span> {pokemon.weight / 10} kg
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className={`${typeColors[t.type.name] || "bg-gray-300"}
                          text-white px-3 py-1 rounded-full text-sm capitalize`}
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}