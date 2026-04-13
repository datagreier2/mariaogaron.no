import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Middag from "./Middag.jsx";
import Vielse from "./Vielse.jsx";

const path = window.location.pathname.replace(/\/$/, "");
const Root = path === "/middag" ? Middag : path === "/vielse" ? Vielse : App;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
