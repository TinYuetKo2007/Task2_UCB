import Header from "./components/Header.jsx"

function Dashboard(){
    return (
        <div>
        <div className="form-container">
            <div className="form">
                <h3>You can contact us here. Feel free to drop a message.</h3>
                <h2>Harmoniq</h2>
                    <input type="email" placeholder="Your Email"/>
                    <textarea rows="4" cols="50"/><br/>
                    <button>Submit</button>
            </div>
        </div>
        </div>
    )
}

export default Dashboard;