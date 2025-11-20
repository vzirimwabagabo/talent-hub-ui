import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")!).render(<App />);

// Wrap your app with future flags
<BrowserRouter
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}
>
  <App />
</BrowserRouter>