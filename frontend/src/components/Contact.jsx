function Contact(){

    //  light or dark mode


    return (
        <div className="container">
        <div className="alt-form-container" style={{alignItems: "center"}}>
            <div className="form">
              <h2>Greenfield Local Hub</h2>
                <h3>You can contact us here. Feel free to drop a message!</h3>
                    <input type="email" placeholder="Your Email"/>
                    <textarea rows="4" cols="50" placeholder="Your Message"/><br/>
                    <button>Submit</button>
            </div>
        </div>
        </div>
    )
}

export default Contact;