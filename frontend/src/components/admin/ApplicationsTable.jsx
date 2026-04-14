import { useState, useEffect } from "react";

export default function ApplicationsTable() {
      const [applications, setApplications] = useState(null);
      const [loading, setLoading] = useState(true);
      const [err, setErr] = useState(null);
    
      const fetchApplications = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      "http://localhost:4000/producerApplications",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const data = await res.json();

    console.log("API response:", data);

    setApplications(data.applications || []);

    setLoading(false);
  } catch (error) {
    console.error(error);
    setErr("Failed to fetch applications");
    setLoading(false);
  }
};
      useEffect(() => {
        fetchApplications();
      }, []);
    
      if (loading) return <h1>Loading...</h1>;
      if (err) return <h1>{err}</h1>;

    return (
      <div style={{ width: "100%", overflowX: "auto" }}>
        <table 
      style={{ 
        width: "1400px",
        minWidth: "1200px",
        borderCollapse: "collapse"
      }}
    >
      <thead>
        <tr>
          <th>Email</th>
          <th>Producer Name</th>
          <th>Address</th>
          <th>Description</th>
          <th>FSA Rating</th>
          <th>Certificate</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {applications.map((application, index) => (
          <tr key={index}>
            <td>{application.email}</td>
            <td>{application.producerName}</td>
            <td>{application.address}</td>
            <td>{application.description}</td>
            <td>{application.fsaRating}</td>
            <td>
              {application.hygieneCertUrl ? (
                <img
                  src={application.hygieneCertUrl}
                  alt="Certificate"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.src = "/default_image.png";
                  }}
                />
              ) : (
                "No file"
              )}
            </td>
            <td>{application.status}</td>
          </tr>
        ))}
      </tbody>
    </table></div>
    );
}