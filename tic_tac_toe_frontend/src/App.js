import React, { useState, useEffect } from "react";
import "./App.css";
import TicTacToeGame from "./TicTacToeGame";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // Apply theme (light only for now as per requirements, but toggle remains)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="App" style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <header className="App-header" style={{ background: "none", minHeight: "unset", boxShadow: "none" }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          style={{ position: "absolute", top: 16, right: 14 }}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1 style={{
          fontSize: "2rem",
          color: "var(--ttt-primary)",
          marginBottom: 10,
          fontWeight: 800,
          textAlign: "center",
          letterSpacing: "0.06em"
        }}>Tic Tac Toe</h1>
        <TicTacToeGame />
      </header>
    </div>
  );
}

export default App;
