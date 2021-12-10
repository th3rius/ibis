import React from "react";
import {HashRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="login" element={<Login />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
