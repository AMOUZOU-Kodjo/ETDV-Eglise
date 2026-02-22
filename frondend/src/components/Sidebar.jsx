import { Menu } from 'lucide-react';
import React from 'react'
import { useState } from 'react';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    
    <nav className='relative'>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        <Menu />
      </button>

      {isExpanded && (
        <ul className="flex flex-col gap-3 mt-2 text-sm text-gray-600">
          <a href="/" className="btn btn-ghost">
          Home
        </a>
        <a href="/about" className="btn btn-ghost">
          About
        </a>
        <a href="/events" className="btn btn-ghost">
          Events
        </a>
        <a href="/programs" className="btn btn-ghost">
          Programs
        </a>
        <a href="/gallery" className="btn btn-ghost">
          Gallery
        </a>
        <a href="/contact" className="btn btn-ghost">
          Contact
        </a>
        </ul>
      )}
    </nav>
     );
  
}

export default Sidebar
