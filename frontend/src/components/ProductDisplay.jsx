export default function ProductDisplay({ product }) {
    return (
        <div className="form-container">
            <img src={product.image} alt={product.title} />
            <h1>{ product.title }</h1>
            <p>{ product.description }</p>
            <form action="http://localhost:4000/create-checkout-session" method="POST" className="form">
                <input name="priceId" type="hidden" value={product.priceId} />
                <button type="submit">Buy</button>
            </form>
        
        </div>
        
    )
}