//Tipagem (TypeScript): Crie interfaces para tipar os dados recebidos da API. O uso de any deve ser evitado.

// Representa um Pokémon na listagem principal (endpoint de listagem)
export interface PokemonListItem {
  name: string;
  url: string;
}

// Resposta do endpoint de listagem da PokeAPI
export interface PokemonListResponse {
  results: PokemonListItem[];
}

//Representa o tipo de um Pokémon (ex: fire, water, grass)
export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number; // Divida por 10 para metros
  weight: number; // Divida por 10 para kg
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };

  // Um Pokémon pode ter um ou mais tipos
  types: PokemonType[];
}