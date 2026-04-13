import { useState, useEffect } from "react";

export default function MessagesTable() {
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchContactMessages = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/contact-messages", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      console.log("API response:", data);

      // handle both formats
      if (Array.isArray(data)) {
        setContactMessages(data);
      } else if (Array.isArray(data.contactMessages)) {
        setContactMessages(data.contactMessages);
      } else {
        setContactMessages([]);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setErr("Error fetching messages");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactMessages();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (err) return <h1>{err}</h1>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Email</th>
          <th>Message</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {contactMessages.map((msg) => (
          <tr key={msg.id}>
            <td>{msg.email}</td>
            <td>{msg.text}</td>
            <td>{msg.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}