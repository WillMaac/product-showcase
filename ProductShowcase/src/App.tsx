import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Favorites from "./pages/Favorites";

//responsável por definir as rotas principais da aplicação
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<Details />} />
        <Route path="/favoritos" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
