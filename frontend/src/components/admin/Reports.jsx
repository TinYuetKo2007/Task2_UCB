import { useEffect, useState } from "react";
import CreateReports from "../CreateReports";
import farm_food from "../../image/farm_food.jpg"
import default_image from "../../image/default_image.png"

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState(null);

  // fetch data from server backend
  const fetchNotes = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:4000/reports", {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    const data = await res.json();
    setReports(data.reports);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Check if reports are loaded in
  if (loading) {
    return (
      <>
        <h1>Notes are loading...</h1>
      </>
    );
  }
  if (reports == null) {
    return (
      <>
        <h1>Error: unable to fetch reports</h1>
      </>
    );
  }
  return (
    <div>
        <div className='parent-container'>
          <img src={farm_food}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = default_image;
          }} 
          style={{
          width: "100vw",
        height: "170px",
        objectFit: "cover",
        filter: "brightness(50%)"
          }}/>
            <div className='bottom-left'>
          <div className='main-title'>
          <b><h2>Admin Reports</h2></b>
          </div>
        </div>
      </div>
    <div className="flex-container">

      <div>
        <CreateReports onSuccess={fetchNotes}/>
      </div>
      
      <div className="notes-display">
      {reports.map((report) => (
        <div key={report.id}>
          <h2>{report.title}</h2> <h3>{report.text}</h3>
        </div>
      ))}
      </div>
    </div>
    </div>
  );
}
