import { useState, useEffect } from "react";

export default function MessagesTable() {
  const [contactMessages, setContactMessages] = useState(null);
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
      setContactMessages(data.contactMessages);
      setLoading(false);
    } catch {
      setErr("Error fetching email");
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
        </tr>
      </thead>

      <tbody>
        {contactMessages?.map((contactMessage, index) => (
          <tr key={contactMessage._id || contactMessage.id || index}>
            <td>{contactMessage.email}</td>
            <td>{contactMessage.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}