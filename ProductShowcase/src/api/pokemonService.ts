//Consumo de API: Crie um serviço de API que usa axios para interagir com os endpoints.

import axios from "axios";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

//  O endpoint de lista retorna apenas { name, url }

export const getPokemonList = async (limit: number = 151) => {
  const response = await api.get(`/pokemon?limit=${limit}`);
  return response.data;
};

export const getPokemonByName = async (name: string) => {
  const response = await api.get(`/pokemon/${name}`);
  return response.data;
};
