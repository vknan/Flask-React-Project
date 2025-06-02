import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; 
import App from "./App"; // Import the App component
import { Provider } from "react-redux";
import Store from "./ThemeContextProvider/Store";

const rootElement = document.getElementById("root"); // Ensure this matches the ID in your HTML
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={Store}>
      <App />
    </Provider>
  );
} else {
  console.error('Root element not found');
}
