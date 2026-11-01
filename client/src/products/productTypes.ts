interface Product {
  id: number,
  product_name: string,
  price: string,
  quantity: number,
  image_url: string,
  product_type: string,
  description: string
}

type ProductUpdate = {
  product_name: string;
  price: number;
  quantity: number;
  description: string;
};

interface AllProductsProps {
  onAddToCartClick: (product: Product) => void;
  products: Product[];
}

interface ProductPageProps {
  inventoryProducts: Product[];
  username: string;
  products: Product[];
  onAddToCartClick: (product: Product) => void;
  onUpdateProduct: (productId: number, values: ProductUpdate) => Promise<void>;
  isAdmin: boolean;
}

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  imageFit?: "contain" | "cover";
  disabled?: boolean;
  onAddToCartClick: () => void;
}

type ProductCardPreviewProps = Pick<
  Product,
  "product_name" | "description" | "image_url"
> & {
  onProductClick: () => void;
} & {
  onAddToCartClick: () => void;
};

interface EditProductProps {
  product: Product;
  onCancel: () => void;
  updateProduct: (values: ProductUpdate) => Promise<void>;
}



export {Product, ProductUpdate, ProductCardProps, ProductCardPreviewProps, ProductPageProps, AllProductsProps, EditProductProps}
