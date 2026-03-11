import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

export default function Dropdown ({ options, title = "Select an Option" }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  // Toggle menu visibility
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle option selection
  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    navigate(option.path);
  };

  // Close menu when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button 
        className="dropdown-trigger" 
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption || title}
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <ul className="dropdown-menu" role="listbox">
          {options.map((option, index) => (
  <li
    key={index}
    className="dropdown-item"
    onClick={() => handleOptionClick(option)}
    role="option"
  >
    {option.label}
  </li>
))}
        </ul>
      )}
    </div>
  );
};
