import { ShowAllProducts } from "../buttons/Buttons";
import type { CartPageProps } from "./cartTypes";
import type { Product } from "../products/productTypes";

const CartItem = (product: Product, onRemoveItem: (id: number) => void) => {
  return (
    <li className="list-group-item">
      <img src={product.image_url} alt={product.product_name} style={{width: "100px", height: "100px", objectFit: "contain", borderRadius: "8px",}} />
      <h3>{product.product_name}</h3>
      <p>{product.description}</p>
      <button
        className="btn btn-danger"
        onClick={() => onRemoveItem(product.id)}
      >
        Delete
      </button>
    </li>
  );
};

const CartPage = ({ items: cartProducts, onRemoveItem}: CartPageProps) => {
  return (
    <>
      <main className="container py-5">
        <div className="d-inline-flex flex-column align-items-start gap-3 mb-2">
          <ShowAllProducts />
          <h2 className="fs-1 fw-bold mb-0">Shopping Cart</h2>
        </div>

        <h5 className="fw-semibold fs-4">
          {cartProducts.length === 0
            ? "Your cart is empty."
            : `${cartProducts.length} item(s) in cart`}
        </h5>
        <p></p>
        <ul className="list-group">
          {cartProducts.map((item) => (
          CartItem(item, onRemoveItem)
          ))}
        </ul>
      </main>
    </>
  );
};



export { CartPage };
