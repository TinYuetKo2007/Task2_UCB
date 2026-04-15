import { useNavigate } from "react-router-dom";
import warning from "../image/error.png"
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
        <div className="not-found-box">
        <h1>Oops! An error occurred.</h1>
        <img src={warning}/>
        <p>404 Not Found</p>
        
        <button onClick={() => navigate("/")}>
          Go Home
        </button>
        </div>
    </div>
  );
}