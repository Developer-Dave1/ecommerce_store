import type { Product } from "../products/productTypes";

type CartPageProps = {
  items: Product[];
  onRemoveItem: (id: number) => void;
};

type ShowCartProps = {
  cartCount: number;
};



export { CartPageProps, ShowCartProps}
