import React from "react";
import { Link } from "react-router-dom";

const NavBarMobile = ({ open, setOpen }) => {
  return (
    <div
      className={`sm:hidden fixed inset-x-0 top-18.25 bg-base-200 transition-all duration-500 ease-in-out ${
        open
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <ul className="flex flex-col text-center  py-6 space-y-6">
        <li>
          <Link
            to="/"
            className="text-xl btn  w-3xs   hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="text-xl    btn w-3xs  hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/events"
            className="text-xl   btn w-3xs  hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            Events
          </Link>
        </li>
        <li>
          <Link
            to="/programs"
            className="text-xl   btn w-3xs hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            Programs
          </Link>
        </li>
        <li>
          <Link
            to="/gallery"
            className="text-xl  btn w-3xs hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            Gallery
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className="text-xl btn w-3xs   hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavBarMobile;
