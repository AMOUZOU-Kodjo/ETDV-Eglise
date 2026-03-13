import React from "react";
import { Link } from "react-router-dom";

const NavBarDesktop = () => {
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/events", label: "Events" },
    { to: "/programs", label: "Programs" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" }
  ];

  return (
    <ul className="flex items-center space-x-4 md:space-x-6">
      {navLinks.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            className="text-lg md:text-xl hover:text-accent transition-colors duration-300 whitespace-nowrap"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavBarDesktop;