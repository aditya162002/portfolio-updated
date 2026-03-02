import { NavLink } from "react-router-dom";

import { logo } from "../assets/images";

const Navbar = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className='header'>
      <NavLink to='/'>
        <img src={logo} alt='logo' className='w-18 h-18 object-contain' />
      </NavLink>
      <nav className='flex text-lg gap-7 font-medium'>
        <button 
          onClick={() => scrollToSection('about')} 
          className="text-white hover:text-blue-400 transition-colors cursor-pointer"
        >
          About
        </button>
        <button 
          onClick={() => scrollToSection('experience')} 
          className="text-white hover:text-blue-400 transition-colors cursor-pointer"
        >
          Experience
        </button>
        <button 
          onClick={() => scrollToSection('projects')} 
          className="text-white hover:text-blue-400 transition-colors cursor-pointer"
        >
          Projects
        </button>
        <NavLink to='/contact' className={({ isActive }) => isActive ? "text-blue-400" : "text-white hover:text-blue-400 transition-colors"}>
          Contact
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
