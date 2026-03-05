import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

//responsável por definir as rotas principais da aplicação
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
