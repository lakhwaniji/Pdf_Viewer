import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login_component from "./components/Login_component";
import Signup_component from "./components/Signup_component";
import Home from "./components/Home";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login_component />} />
          <Route path="/sign-up" element={<Signup_component />} />
          <Route path="/home" element={<Home/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;