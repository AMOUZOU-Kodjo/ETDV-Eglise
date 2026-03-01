import React from 'react'
import { Link } from "react-router-dom";

const NavBarAdmin = () => {
  return (
    <div className="items-center flex font-bold justify-between bg-base-200 text-white text-3xl p-4 sticky top-0 z-50 shadow-lg">
        <h1 className="text-3xl font-bold ">Dashboard<span className="text-accent">Admin</span></h1>
        <ul className="   flex items-center justify-center space-x-32  ">
          <li>
            <Link
              to="/admin"
              className="text-lg text-amber-50 uppercase hover:bg-amber-50 p-1.5 rounded-sm  sm:text-xl hover:text-blue-700 transition-colors duration-300"
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              to="/galleryadmin"
              className="text-lg text-amber-50 uppercase hover:bg-amber-50 p-1.5 rounded-sm  sm:text-xl hover:text-blue-700 transition-colors duration-300"
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              to="/dashboardadmin"
              className="text-lg text-amber-50 uppercase hover:bg-amber-50 p-1.5 rounded-sm  sm:text-xl hover:text-blue-700 transition-colors duration-300"
            >
              Données
            </Link>
          </li>
        </ul>
      </div>
  )
}

export default NavBarAdmin
