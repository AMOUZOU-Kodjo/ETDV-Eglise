import React, { useState } from "react";
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavBarDesktop from "./NavBarDesktop";
import NavBarMobile from "./NavBarMobile";

const NavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="items-center flex font-bold justify-between bg-base-200 text-[--text-accent] text-3xl p-4 sticky top-0 z-50 shadow-lg">
      <Link to="/" className="flex items-center font-bold text-xl sm:text-2xl md:text-3xl">
        Eglise<span className="text-accent">ETDV</span>
      </Link>

      {/* Menu Desktop */}
      <NavBarDesktop />

      {/* Menu Mobile */}
      <NavBarMobile open={open} setOpen={setOpen} />

      {/* Bouton hamburger */}
      <button onClick={() => setOpen(!open)} className="sm:hidden z-50">
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default NavBar;