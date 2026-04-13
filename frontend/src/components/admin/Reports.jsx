import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CreateReports from "../CreateReports";
import farm_food from "../../image/farm_food.jpg";
import default_image from "../../image/default_image.png";

export default function Reports() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [reports, setReports] = useState([]);
  const [err, setErr] = useState(null);
  
  const checkAccess = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = await res.json();

      if (user.role === "ADMIN" || user.role === "PRODUCER") {
        setAuthorized(true);
        fetchReports(token);
      } else {
        setAuthorized(false);
      }

      setLoading(false);
    } catch (err) {
      setErr("Failed to verify user");
      setLoading(false);
    }
  };

  // STEP 2: fetch reports
  const fetchReports = async (token) => {
    try {
      const res = await fetch("http://localhost:4000/reports", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      setErr("Failed to load reports");
    }
  };

  useEffect(() => {
    checkAccess();
  }, []);

  // LOADING STATE
  if (loading) {
    return <h1>Loading...</h1>;
  }

  // ERROR STATE
  if (err) {
    return <h1>{err}</h1>;
  }

  // ACCESS DENIED
  if (!authorized) {
    return <h1>Access denied (Admin or Producer only)</h1>;
  }

  return (
    <div>
      <div className="parent-container">
        <img
          src={farm_food}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = default_image;
          }}
          style={{
            width: "100vw",
            height: "170px",
            objectFit: "cover",
            filter: "brightness(50%)"
          }}
        />

        <div className="bottom-left">
          <div className="main-title">
            <h2>Admin Reports</h2>
          </div>
        </div>
      </div>

      <div className="flex-container">

        <div>
          <CreateReports onSuccess={() => fetchReports(localStorage.getItem("token"))} />
        </div>

        <div className="notes-display">
          {reports.length === 0 ? (
            <h3>No reports found</h3>
          ) : (
            reports.map((report) => (
              <div key={report.id}>
                <h2>{report.title}</h2>
                <h3>{report.text}</h3>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}