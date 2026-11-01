import type { BasicButtonProps } from "./buttonTypes";
import { Link } from "react-router";
import "./buttons.css";



const BackButton = ({ onClick }: BasicButtonProps) => {
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={onClick}
    >
      Back
    </button>
  );
};

const ShowAllProducts = () => {
  return (
    <Link to="/" className="btn btn-primary">
      Back To Products
    </Link>
  )
}

const AddToCartButton = ({onClick, disabled}: BasicButtonProps) => {
  return (
    <button
      type="button"
      className="btn btn-success"
      disabled={disabled}
      onClick={onClick}>
      Add To Cart
    </button>
  );
};

export { BackButton, ShowAllProducts, AddToCartButton}
