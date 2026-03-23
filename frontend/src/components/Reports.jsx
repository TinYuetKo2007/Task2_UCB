import { useEffect, useState } from "react";
import CreateReports from "./CreateReports";
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
    <div style={{display: "flex", 
    flexDirection: "column", 
    maxWidth: "100%",
    alignItems: "start"}}>
    <h1>Admin Reports</h1>
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
