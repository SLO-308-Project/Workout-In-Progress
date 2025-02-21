// src/main.tsx
import ReactDOMClient from "react-dom/client";
import "./main.css";
import { BrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage";

// Create the container
const container = document.getElementById("root");
if (!container)
{
    throw new Error("Unable to find root container");
}

// Create a root
const root = ReactDOMClient.createRoot(container);

//  Initial render: Render an element to the Root
root.render(
    <BrowserRouter> 
        <MainPage /> 
    </BrowserRouter>
);
