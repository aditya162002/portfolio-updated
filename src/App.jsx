import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";

import { Footer } from "./components";
import { About, Contact, Home } from "./pages";
import { github, linkedin } from "../src/assets/icons";
import gmailIcon from "../src/assets/images/gmail.png";

const App = () => {
  return (
    <main style={{ background: 'black' }}>
      <Router>
        <AppContent />
      </Router>
    </main>
  );
};

const AppContent = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Social Links Header - responsive */}
      <header className="fixed top-0 right-0 z-50 p-4 sm:p-6">
        {/* Desktop nav */}
        <nav className="hidden sm:flex text-lg gap-7 font-medium">
          <a
            href="https://github.com/adityabhadauria"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
          >
            <img src={github} alt="GitHub" className="w-6 h-6" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/aditya-bhadauria-016a771b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
          >
            <img src={linkedin} alt="LinkedIn" className="w-6 h-6" />
            LinkedIn
          </a>
          <button
            onClick={() => navigate('/contact')}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
          >
            <img src={gmailIcon} alt="Gmail" className="w-6 h-6" />
            Gmail
          </button>
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
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

          {/* Mobile dropdown */}
          {menuOpen && (
            <nav className="sm:hidden absolute top-full right-0 mt-2 mr-0 flex flex-col gap-3 p-4 rounded-xl bg-black/90 backdrop-blur-md border border-white/10 min-w-[160px]">
              <button
                onClick={() => { navigate('/about'); setMenuOpen(false); }}
                className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer text-sm text-left"
              >
                About
              </button>
              <a
                href="https://github.com/adityabhadauria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors text-sm"
              onClick={() => setMenuOpen(false)}
            >
              <img src={github} alt="GitHub" className="w-5 h-5" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/aditya-bhadauria-016a771b9/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors text-sm"
              onClick={() => setMenuOpen(false)}
            >
              <img src={linkedin} alt="LinkedIn" className="w-5 h-5" />
              LinkedIn
            </a>
            <button
              onClick={() => {
                navigate('/contact');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer text-sm text-left"
            >
              <img src={gmailIcon} alt="Gmail" className="w-5 h-5" />
              Gmail
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
