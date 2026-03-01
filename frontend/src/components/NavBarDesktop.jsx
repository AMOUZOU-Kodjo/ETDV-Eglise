import React from "react";
import { Link } from "react-router-dom";

const NavBarDesktop = () => {
  return (
    <ul className=" h-0 sm:h-full  sm:flex sm:items-center sm:space-x-4 md:space-x-6">
      <li>
        <Link
          to="/"
          className="text-lg bg-secondary p-1.5 rounded-sm visibility-hidden sm:visibility-visible opacity-0 sm:opacity-100 sm:text-xl hover:text-accent transition-colors duration-300"
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/about"
          className="text-lg visibility-hidden sm:visibility-visible opacity-0 sm:opacity-100 sm:text-xl hover:text-accent transition-colors duration-300"
        >
          About
        </Link>
      </li>
      <li>
        <Link
          to="/events"
          className="text-lg visibility-hidden sm:visibility-visible opacity-0 sm:opacity-100 sm:text-xl hover:text-accent transition-colors duration-300"
        >
          Events
        </Link>
      </li>
      <li>
        <Link
          to="/programs"
          className="text-lg visibility-hidden sm:visibility-visible opacity-0 sm:opacity-100 sm:text-xl hover:text-accent transition-colors duration-300"
        >
          Programs
        </Link>
      </li>
      <li>
        <Link
          to="/gallery"
          className="text-lg visibility-hidden sm:visibility-visible opacity-0 sm:opacity-100 sm:text-xl hover:text-accent transition-colors duration-300"
        >
          Gallery
        </Link>
      </li>
      <li>
        <Link
          to="/contact"
          className="text-lg visibility-hidden sm:visibility-visible opacity-0 sm:opacity-100 sm:text-xl hover:text-accent transition-colors duration-300"
        >
          Contact
        </Link>
      </li>
    </ul>
  );
};

export default NavBarDesktop;
