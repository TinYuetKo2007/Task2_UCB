import Header from "./components/Header";
import { Outlet } from "react-router";
import { useState } from "react";
export default function RootLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  //  light or dark mode
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    if (isDarkMode) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}