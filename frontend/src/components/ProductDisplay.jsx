export default function ProductDisplay({ product }) {
    return (
        <div className="form-container">
            <h1>{ product.name }</h1>
            <p>{ product.desc }</p>
            <form action="http://localhost:4000/create-checkout-session" method="POST" className="form">
                <input name="priceId" type="hidden" value={product.priceId} />
                <button type="submit">Buy</button>
            </form>
        
        </div>
        
    )
}