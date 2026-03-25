import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ data, searchKey, placeholder }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

const filteredData = useMemo(() => {
  if (!query) return [];

  return data
    .filter((item) =>
      item[searchKey].toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 6);
}, [query, data, searchKey]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filteredData.length > 0 && (
  <ul className="search-results">
    {filteredData.map((item) => (
      <li key={item.id} onClick={() => navigate(item.path)}>
        {item[searchKey]}
      </li>
    ))}
  </ul>
)}
    </div>
  );
}