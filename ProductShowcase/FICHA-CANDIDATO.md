
# Pokédex — README do Candidato

---

# Seção 1: Instruções para Rodar

## Variáveis de Ambiente

Este projeto não precisa de variáveis de ambiente.  
A **PokeAPI** é pública e não exige autenticação ou API key.

Caso fosse necessário eu adicionaria um arquivo:

```
.env
```

Exemplo:

```env
VITE_API_URL=https://pokeapi.co/api/v2
```

E utilizaria no projeto com:

```ts
import.meta.env.VITE_API_URL
```

---

## Instalação de Dependências

```bash
npm install
```

---

## Como Rodar o Projeto

```bash
npm run dev
```

Depois acesse no navegador:

```
http://localhost:5173
```

ou o endereço de **localhost disponível** exibido no terminal.

---

## Build para Produção

```bash
npm run build
npm run preview
```

---

# Seção 2: Decisões de Design

## Por que essa estrutura de pastas?

```
src/
 ├── api/        → toda comunicação HTTP em um só lugar
 ├── types/      → contratos TypeScript centralizados
 ├── pages/      → páginas da aplicação
 ├── components/ → componentes reutilizáveis
 ├── context/    → estado global
 └── utils/      → funções auxiliares
```

A estrutura segue o princípio de **separação de responsabilidades**.

Cada pasta possui um papel específico dentro da aplicação, o que ajuda a manter o projeto organizado e facilita futuras manutenções.

### Motivos da escolha

- Separação clara de responsabilidades
- Facilidade de manutenção
- Escalabilidade futura
- Organização alinhada com boas práticas de mercado
- Isolamento da camada de API
- Tipagem centralizada
- Reutilização de código

Essa organização reduz o acoplamento e facilita o crescimento do projeto.

---

## Qual foi a maior dificuldade e como superou?

### Problema técnico

O endpoint:

```
GET /pokemon?limit=151
```

retorna apenas:

```json
{ "name": "...", "url": "..." }
```

Ou seja, ele não retorna a imagem do Pokémon.

Fazer **151 requisições adicionais** para buscar as imagens poderia impactar a performance da aplicação.

---

### Solução

Durante a pesquisa encontrei uma solução utilizada pela própria comunidade da PokeAPI para gerar a URL da imagem utilizando o **ID do Pokémon** presente na URL retornada pela API.

Referência:

https://github.com/PokeAPI/sprites

Essa abordagem permite acessar diretamente as imagens oficiais hospedadas no repositório de sprites da PokeAPI.

---

### Resultado

Com isso foi possível:

- Evitar requisições extras apenas para imagens
- Carregar os cards mais rapidamente
- Buscar os tipos dos Pokémon em paralelo utilizando `Promise.all`
- Armazenar os resultados no **localStorage** para evitar novas requisições

---

### Dificuldade pessoal

Além do desafio técnico,  também precisei lidar com o nervosismo de participar de um processo seletivo.

O **timebox de 4 horas** exige tomar decisões rápidas e manter o foco no essencial.

Para lidar com isso, procurei quebrar os problemas em partes menores:

1. Entender o problema  
2. Pensar em uma solução simples e eficiente  
3. Implementar com cuidado  
4. Documentar as decisões tomadas  

Também procurei manter atenção aos detalhes:

- commits claros
- comentários no código
- documentação no README

---

## O que não tive tempo de implementar

Com mais tempo, eu faria algumas melhorias:

### 1. Animação de carregamento nos cards

Adicionar um efeito de carregamento mais agradável enquanto os dados são buscados.

```tsx
<div className="animate-pulse bg-gray-200 rounded-2xl h-48 w-full" />
```

---

### 2. Notificações melhores

Substituir o `alert()` por notificações visuais utilizando bibliotecas de toast.

```tsx
toast.error("Você já atingiu o limite de 6 Pokémon!");
```

---

### 3. Cache com tempo de expiração

Atualmente o cache no `localStorage` não expira.

Eu adicionaria um tempo de validade de **24 horas**.

```ts
const cache = { data: results, timestamp: Date.now() };

const isExpired =
  Date.now() - cache.timestamp > 1000 * 60 * 60 * 24;
```

---

### 4. Melhorias visuais

Também dedicaria mais tempo para melhorar o layout e deixar a interface mais bonita e responsiva.

---

# Seção 3: Aplicação Online


```
https://product-showcase-drab.vercel.app/
```

---

# Seção Final: Recomendações sobre o Desafio

## O que funcionou bem

O **timebox de 4 horas** é adequado para implementar os requisitos principais.

A **PokeAPI** é uma ótima escolha para esse tipo de desafio, pois é bem documentada, estável e não exige autenticação.

A **descrição** do desafio estava ótima; permitia ao candidato entender claramente o que estava sendo avaliado e o que realmente deveria ser feito. O texto estava simples e sem o uso de termos técnicos difíceis de compreender.

---

## Sugestão de melhoria no enunciado

Seria interessante deixar mais explícito no enunciado a criação de uma **rota específica para visualizar os Pokémon favoritados**.

Por exemplo:

```
/favorites
```

Assim o usuário poderia acessar uma página dedicada para visualizar apenas os Pokémon que adicionou ao seu time.

Isso ajudaria a deixar mais claro como os favoritos devem ser exibidos na interface e incentivaria uma organização melhor da navegação da aplicação.

---

## Dica para próximas edições

Adicionar um requisito explícito de **tratamento de erro**.

Exemplo:

> Exibir uma mensagem amigável caso a API esteja indisponível.

Isso ajudaria a avaliar como o candidato lida com cenários reais de desenvolvimento.


### Considerações Finais



Tudo o que foi feito aqui foi pensado para uma ótima entrega, dentro do tempo proposto, com foco em entregar uma solução funcional, organizada e coerente com boas práticas.

Se algo poderia ter sido feito melhor, eu reconheço.
Se algo foi bem resolvido, também assumo como mérito meu.
No início, o nervosismo foi uma dificuldade e, após superá-lo, creio que fiz um ótimo teste.

Não busquei apenas finalizar o desafio. Busquei entender o problema, tomar decisões conscientes e justificar cada escolha feita.

Assumo totalmente as escolhas técnicas, os erros, os acertos e as melhorias que ficaram para uma próxima versão.

Este projeto não é apenas um teste técnico.
Ele representa minha responsabilidade, minha capacidade de adaptação e minha forma de trabalhar.