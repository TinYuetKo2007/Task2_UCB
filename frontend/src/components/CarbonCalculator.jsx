import{ useState } from "react";
import { Link } from "react-router-dom";


export default function CarbonFootprintCalculator(){
  const [formData, setFormData] = useState({
    carType: "electric",
    milesPerWeek: "",
    publicTransport: {
      train: false,
      bus: false,
      tram: false,
    },
    busRides: "",
    trainRides: "",
    tramRides: "",
    electricBill: "",
    waterBill: "",
    gasBill: "",
    householdSize: "",
  });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        publicTransport: { ...formData.publicTransport, [name]: checked },
      });
    } else if (type === "number") {
      // check the value is not less than 0
      const newValue = value < 0 ? 0 : value;
      setFormData({ ...formData, [name]: newValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all inputs are filled
    if (
      !formData.carType ||
      !formData.milesPerWeek ||
      !formData.electricBill ||
      !formData.gasBill ||
      (formData.publicTransport.bus && !formData.busRides) ||
      (formData.publicTransport.train && !formData.trainRides) ||
      (formData.publicTransport.tram && !formData.tramRides)
    ) {
      setAlert({ type: "error", message: "All fields are required!" });
      return;
    }

    setAlert({ type: "success", message: "Calculating..." });

    try {
      // Sending data to the backend
      const response = await fetch("http://localhost:4000/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carType: formData.carType,
          milesPerWeek: formData.milesPerWeek,
          busRides: formData.publicTransport.bus ? formData.busRides : 0,
          trainRides: formData.publicTransport.train ? formData.trainRides : 0,
          tramRides: formData.publicTransport.tram ? formData.tramRides : 0,
          electricBill: formData.electricBill,
          gasBill: formData.gasBill,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setAlert({
          type: "success",
          message: `Your total carbon footprint is ${result.totalFootprint} kg CO₂`,
        });
        console.log(result);
      } else {
        setAlert({
          type: "error",
          message: result.error || "Error calculating carbon footprint.",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred while calculating.",
      });
    }
  };

  if (alert && alert.type==="success") {
    return (
    <>
    {<div>{alert.message}</div>}
    <button onClick={() => setAlert(null)}>Try Again</button>
    </>)
    }

  return (
    <div>

      <div>
        <h1>Carbon Footprint Calculator</h1>
       

        <form onSubmit={handleSubmit}>
          <div>
            <h2>Transportation</h2>
            <label>What type of car do you drive?</label>
            <div className="radio-group">
              {["Electric", "Diesel", "Petrol", "Hybrid"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="carType"
                    checked={formData.carType}
                    onChange={handleChange}
                  />
                  {type}
                </label>
              ))}
            </div>
            <label>How many miles do you drive per week?</label>
            <input
              type="number"
              name="milesPerWeek"
              value={formData.milesPerWeek}
              onChange={handleChange}
            />
            <label>Which types of public transport do you use?</label>
            <div>
              {["Train", "Bus", "Tram", "None"].map((transport) => (
                <label key={transport}>
                  <input
                    type="checkbox"
                    name={transport.toLowerCase()}
                    checked={formData.publicTransport[transport.toLowerCase()]}
                    onChange={handleChange}
                  />
                  {transport}
                </label>
              ))}
            </div>
            {formData.publicTransport.bus && (
              <div>
                <label>How many times a week do you ride the bus?</label>
                <input
                  type="number"
                  name="busRides"
                  value={formData.busRides}
                  onChange={handleChange}
                />
              </div>
            )}
            {formData.publicTransport.train && (
              <div>
                <label>How many times a week do you ride the train?</label>
                <input
                  type="number"
                  name="trainRides"
                  value={formData.trainRides}
                  onChange={handleChange}
                />
              </div>
            )}
            {formData.publicTransport.tram && (
              <div>
                <label>How many times a week do you ride the tram?</label>
                <input
                  type="number"
                  name="tramRides"
                  value={formData.tramRides}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div>
            <h2>Energy</h2>
            <label>How much was your electric bill this month (in Kwh)?</label>
            <input
              type="number"
              name="electricBill"
              value={formData.electricBill}
              onChange={handleChange}
            />

            <label>How much gas / heating was used this month (in Kwh)?</label>
            <input
              type="number"
              name="gasBill"
              value={formData.gasBill}
              onChange={handleChange}
            />

            <button type="submit" className="calc">
              Calculate
            </button>
            {alert && <div>{alert.message}</div>}
          </div>
        </form>
      </div>

    </div>
  );
};