import { Link } from "react-router";
import type { ProductCardProps } from "./productTypes";
import "./products.css";

const ProductCard = ({
  id,
  name,
  description,
  image,
  imageFit = "cover",
  disabled,
  onAddToCartClick,
}: ProductCardProps) => {
  return (
    <div className="card bg-body-secondary product-card">
      <img
        src={image}
        className={`card-img-top product-card-image${imageFit === "contain" ? " product-card-image--contain" : ""}`}
        alt={name} 
      />

      <div className="card-body">
        <h5 className="card-title">{name}</h5>

        <p className="card-text">
          {description}
        </p>

        <div className="d-flex flex-wrap gap-2">
        <Link
          to={`/product/${id}`}
          className="btn btn-primary"
        >
          Product Details
        </Link>

        <button
          type="button"
          className="btn btn-dark"
          onClick={onAddToCartClick}
          disabled={disabled}
        >
          Add to cart
        </button>
        </div>
      </div>
    </div>
  );
};

export { ProductCard };
