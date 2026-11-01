import type { AllProductsProps } from "./productTypes";
import { ProductCard } from "./ProductCard";

const AllProducts = ({
  products,
  onAddToCartClick,
}: AllProductsProps) => {
  return (
    <div className="container px-4 py-4 d-flex flex-wrap justify-content-center gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.product_name}
          //description={product.description}
          image={product.image_url}
          disabled={product.quantity <= 0}
          onAddToCartClick={() =>
            onAddToCartClick(product)
          }
        />
      ))}
    </div>
  );

};

export { AllProducts };
