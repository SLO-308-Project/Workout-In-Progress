// src/main.tsx
import ReactDOMClient from "react-dom/client";
import "./main.css";
import MachinePage from "./pages/MachinePage";

// Create the container
const container = document.getElementById("root");
if (!container)
{
    throw new Error("Unable to find root container");
}

// Create a root
const root = ReactDOMClient.createRoot(container);

//  Initial render: Render an element to the Root
root.render(<MachinePage />);
