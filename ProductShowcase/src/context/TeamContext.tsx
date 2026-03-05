/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

interface TeamContextType {
  team: string[];
  addPokemon: (name: string) => void;
  removePokemon: (name: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Provider responsável por gerenciar o estado global do time e persistir os dados no localStorage
export function TeamProvider({ children }: { children: React.ReactNode }) {
  // Inicializa o estado lendo do localStorage (persistência entre reloads)
  const [team, setTeam] = useState<string[]>(() => {
    const stored = localStorage.getItem("pokemon-team");
    return stored ? JSON.parse(stored) : [];
  });

  // Sempre que o time muda, sincroniza com o localStorage
  useEffect(() => {
    localStorage.setItem("pokemon-team", JSON.stringify(team));
  }, [team]);

  const addPokemon = (name: string) => {
    setTeam((prev) => {
      // Evita duplicação no time
      if (prev.includes(name)) return prev;

      // Regra de negócio: limite máximo de 6 Pokémon
      if (prev.length >= 6) {
        alert("Você já atingiu o limite de 6 Pokémon no Time!");
        return prev;
      }

      return [...prev, name];
    });
  };

  const removePokemon = (name: string) => {
    setTeam((prev) => prev.filter((p) => p !== name));
  };

  return (
    <TeamContext.Provider value={{ team, addPokemon, removePokemon }}>
      {children}
    </TeamContext.Provider>
  );
}

// Hook customizado para garantir uso seguro do contexto
export function useTeam() {
  const context = useContext(TeamContext);

  // Força erro caso seja usado fora do Provider
  if (!context) {
    throw new Error("useTeam deve ser usado dentro do TeamProvider");
  }

  return context;
}
