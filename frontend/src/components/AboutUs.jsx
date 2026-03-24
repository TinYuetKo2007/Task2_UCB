import veggie_field from "../image/veggie_field.jpg"
function AboutUs() {
  return (
    <div>
      <div className='parent-container'>
        <img src={veggie_field} style={{
        width: "100vw",
        height: "400px",
        objectFit: "cover",
        }}/>
            <div className='bottom-left'>
        <div className='main-title'>
        </div>
        </div>
      </div>
    <h1>About Greenfield Local Hub</h1>
    <p>We are a co-operative of local farmers and food producers in the United Kingdom. 
      We hope to offer the best locally-produced food and drinks.</p>
    <p>All our food is sourced from local farms and produce, 
      offering superior taste, nutrition and quality.</p>
    <h2>Our Statement to Customers</h2>
    <p>We aim to reverse the trend of anti-social trend of the UK food industry and prevent:</p>
    <ul>
      <li>Small farm-based producers going out of business</li><br/>
      <li>Gradually decreasing access to fresh food</li><br/>
    </ul>
    </div>
  )
};


export default AboutUs;
