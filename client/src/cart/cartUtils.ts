import type { Dispatch, SetStateAction } from "react";
import type { Product } from "../products/productTypes";

function addToCart(
  product: Product,
  setCartProducts: Dispatch<SetStateAction<Product[]>>,
  setShowMessage: Dispatch<SetStateAction<boolean>>
) {
  setCartProducts((currentCart) => {
    const quantityInCart = currentCart.filter(item => item.id === product.id).length;
    if (quantityInCart >= product.quantity) return currentCart;
    return [...currentCart, product];
  });
  setShowMessage(true);

  setTimeout(() => {
    setShowMessage(false);
  }, 2000);
}

function removeCartItemById<T extends { id: number }>(
  products: T[],
  productId: number
): T[] {
  return products.filter(product => product.id !== productId);
}

export { addToCart, removeCartItemById };
