import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

export default function Dropdown ({ options, title = "Select an Option",  onThemeToggle }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
  
    if (option.action === "theme") {
      onThemeToggle?.();
      return;
    }
  
    if (option.path === "#logout") {
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
  
    if (option?.path) {
      navigate(option.path);
    }
  };

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
