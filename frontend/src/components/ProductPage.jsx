import { useParams } from "react-router-dom";
import { products } from "../products.js";
import ProductDisplay from "./ProductDisplay";
export default function ProductPage() {
    const params = useParams()
    const product = products.find((product) => product.productId === params.productId)
    console.log(params.productId)
    if (product === undefined) {return (<><h1>Product Not Found</h1></>)}
    return (
        <div>
            {/* {params.productId} */}
            <ProductDisplay product={product}/>
        </div>
    )
}