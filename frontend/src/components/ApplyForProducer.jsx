import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ApplyForProducer() {
  const navigate = useNavigate();

  const [producerName, setProducerName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [fsaRating, setFsaRating] = useState("");
  const [file, setFile] = useState(null);

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, _] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(false);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("producerName", producerName);
      formData.append("address", address);
      formData.append("description", description);
      formData.append("fsa_rating", fsaRating);

      if (file) {
        formData.append("hygiene_cert", file);
      }

      const res = await axios.post(
        "http://localhost:4000/producer-application",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setStatus("Application submitted successfully!");

        setProducerName("");
        setAddress("");
        setDescription("");
        setFsaRating("");
        setFile(null);
      } else {
        setStatus("Failed to submit application.");
      }

    } catch (err) {
      console.log(err);
      setStatus("Failed to submit application.");
    }
  };

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (err) {
    return <h1>{err}</h1>;
  }

  return (
    <div className="producer-page">
      <div className="container">
        <div className="form-container" style={{ alignItems: "center" }}>
          <form className="form" onSubmit={handleSubmit}>
            <h2>Greenfield Local Hub</h2>
            <h3>Producer Application Form</h3>

            <fieldset>
              <input
                type="text"
                placeholder="Producer Name"
                value={producerName}
                required
                onChange={(e) => setProducerName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </fieldset>

            <textarea
              rows="4"
              placeholder="Tell us about your business."
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />

            <fieldset>
              <legend>Safety & Compliance</legend>

              <label>Current Food Hygiene Rating (0–5):</label>
              <input
                type="number"
                min="0"
                max="5"
                value={fsaRating}
                onChange={(e) => setFsaRating(e.target.value)}
              />

              <label>Upload Food Hygiene Certificate:</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </fieldset>

            <br />

            <button type="submit">Submit</button>

            {status && <p style={{ color: "white" }}>{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}