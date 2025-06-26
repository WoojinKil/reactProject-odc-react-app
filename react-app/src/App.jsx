import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import LoginPage from "./login/LoginPage.jsx";
import RegisterPage from "./login/RegisterPage.jsx";
import Game from "./inf/game/Game.jsx"
import Rarity from "./inf/rarity/Rarity";
import Product from "./inf/product/Product";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/rarity" element={<Rarity/>} />
        <Route path="/product" element={<Product />} />
        
      </Routes>
    </Router>
  );
}
export default App;  // default export 추가