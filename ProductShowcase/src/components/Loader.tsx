// Componente simples de loading usado enquanto dados da API estão sendo buscados.

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg font-semibold">Carregando...</p>
    </div>
  );
}
