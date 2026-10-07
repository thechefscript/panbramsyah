import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ProfessionalChef from "./pages/ProfessionalChef.tsx";
import CaseStudyPage from "./pages/CaseStudy.tsx";

const normalizedPath =
  window.location.pathname.replace(/\/+$/, "") || "/";

function getCurrentPage() {
  switch (normalizedPath) {
    case "/experience/professional-chef":
      return <ProfessionalChef />;

    case "/work/culinary-development":
      return <CaseStudyPage slug="culinary-development" />;

    case "/work/restaurant-concept":
      return <CaseStudyPage slug="restaurant-concept" />;

    case "/work/kitchen-standards":
      return <CaseStudyPage slug="kitchen-standards" />;

    default:
      return <App />;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {getCurrentPage()}
  </StrictMode>,
);
