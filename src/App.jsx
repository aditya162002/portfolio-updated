import { Route, BrowserRouter as Router, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import { Home, About, Contact } from "./pages";
import { github, linkedin } from "./assets/icons";
import gmailIcon from "./assets/images/gmail.png";
import { personalInfo } from "./constants";

const NAV_PAGES = [
  { label: "About", page: 1 },
  { label: "Experience", page: 2 },
  { label: "Projects", page: 3 },
  { label: "Work", page: 4 },
];

const App = () => {
  return (
    <main style={{ background: "#050505" }}>
      <Router>
        <AppContent />
      </Router>
    </main>
  );
};

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === "/";

  const goToSection = (page) => {
    setMenuOpen(false);
    if (isHome) {
      window.dispatchEvent(new CustomEvent("portfolio:goto", { detail: { page } }));
    } else {
      navigate("/");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("portfolio:goto", { detail: { page } }));
      }, 100);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <button
            onClick={() => {
              setMenuOpen(false);
              if (isHome) {
                window.dispatchEvent(
                  new CustomEvent("portfolio:goto", { detail: { page: 0 } })
                );
              } else {
                navigate("/");
              }
            }}
            className="pointer-events-auto text-white/80 hover:text-white font-poppins font-semibold text-sm sm:text-base tracking-tight transition-colors bg-transparent border-none cursor-pointer"
          >
            {personalInfo.name.split(" ")[0]}
            <span className="text-sky-400">.</span>
          </button>

          <nav className="hidden md:flex pointer-events-auto items-center gap-6 text-sm font-medium">
            {isHome &&
              NAV_PAGES.map((item) => (
                <button
                  key={item.label}
                  onClick={() => goToSection(item.page)}
                  className="text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            <a
              href="https://github.com/adityabhadauria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <img src={github} alt="" className="w-5 h-5 opacity-80 hover:opacity-100" />
            </a>
            <a
              href="https://www.linkedin.com/in/aditya-bhadauria-016a771b9/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <img src={linkedin} alt="" className="w-5 h-5 opacity-80 hover:opacity-100" />
            </a>
            <button
              onClick={() => navigate("/contact")}
              className="flex items-center gap-2 text-white/90 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all bg-transparent cursor-pointer text-sm"
            >
              <img src={gmailIcon} alt="" className="w-4 h-4" />
              Contact
            </button>
          </nav>

          <button
            className="md:hidden pointer-events-auto flex flex-col gap-1.5 p-2.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden pointer-events-auto absolute top-full right-4 mt-1 flex flex-col gap-1 p-3 rounded-xl bg-black/95 backdrop-blur-md border border-white/10 min-w-[180px] shadow-xl">
            {NAV_PAGES.map((item) => (
              <button
                key={item.label}
                onClick={() => goToSection(item.page)}
                className="text-left text-white/80 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-sm"
              >
                {item.label}
              </button>
            ))}
            <hr className="border-white/10 my-1" />
            <a
              href="https://github.com/adityabhadauria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg text-sm"
              onClick={() => setMenuOpen(false)}
            >
              <img src={github} alt="" className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/aditya-bhadauria-016a771b9/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg text-sm"
              onClick={() => setMenuOpen(false)}
            >
              <img src={linkedin} alt="" className="w-4 h-4" />
              LinkedIn
            </a>
            <button
              onClick={() => {
                navigate("/contact");
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg bg-transparent border-none cursor-pointer text-sm text-left"
            >
              <img src={gmailIcon} alt="" className="w-4 h-4" />
              Contact
            </button>
          </nav>
        )}
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
};

export default App;
