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
    <h1 style={{fontSize:"50px"}}>About Greenfield Local Hub</h1>
    <p>We are a co-operative of local farmers and food producers in the United Kingdom. 
      We hope to offer the best locally-produced food and drinks.</p>
    <p>All our food is sourced from local farms and produce, 
      offering superior taste, nutrition and quality.</p>
      <h1 style={{fontSize:"50px"}}>Our Statement to Customers</h1>
    <p>We aim to reverse the trend of anti-social trend of the UK food industry and prevent:</p>
    <ul>
      <li>Small farm-based producers going out of business</li><br/>
      <li>Gradually decreasing access to fresh food</li><br/>
    </ul>
    <div className='second-section'>
    <h1 style={{fontSize:"50px"}}>Why choose Local Food?</h1>
    <p>There are many benefits to choosing locally produced food over industrial produce:</p>
    <ul>
      <li>Superior ripeness, taste and nutrition</li><br/>
      <li>Environmental benefits due to less "food miles"</li><br/>
      <li>More biodiversity in foods and preservation of local heritage</li><br/>
      <li>Promotes eating seasonally, which is more sustainable and provides a better diet</li><br/>
    </ul>
    <p>We use minimal chemicals intended to extend shelf life for long-distance travel. 
      Therefore our services will only be available for residents of the United Kingdom.</p>
    </div>
    </div>
  )
};


export default AboutUs;
