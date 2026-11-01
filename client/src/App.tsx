import { useEffect, useState } from "react";
import {
  Routes,
  Route,
} from "react-router";

import type { Product, ProductUpdate } from "./products/productTypes";

import { LoginPage } from "./login/LoginPage";
import { Layout} from "./layout/Layout";

import { ProductPage } from "./products/ProductPage";
import { CartPage } from "./cart/CartPage";
import { addToCart, removeCartItemById } from "./cart/cartUtils";
import { AllProducts } from "./products/AllProducts";

function App() {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const availableProducts = products.map(product => ({
    ...product,
    quantity: Math.max(0, product.quantity - cartProducts.filter(item => item.id === product.id).length),
  }));

  const handleAddToCart = (product: Product) => {
    const stockedProduct = products.find(item => item.id === product.id);
    if (!stockedProduct || product.quantity <= 0) return;
    addToCart(stockedProduct, setCartProducts, setShowMessage);
  };


  const handleUpdateProduct = async (productId: number, values: ProductUpdate): Promise<void> => {
    const response = await fetch(`/admin/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error('Could not update product. Please try again.');
    }

    const updatedProduct: Product = await response.json();
    setProducts((currentProducts) => currentProducts.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    async function getProducts() {
      try {
        const response = await fetch('/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products.');
        }
        const productData: Product[] = await response.json();
        setProducts(productData);
      } catch (error) {
        console.error('Error loading products:', error);
      } 
    }

    getProducts();

  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={(username, isAdmin) => {
      setIsAdmin(isAdmin);
      setIsAuthenticated(true);
      setUsername(username);
      }
    }/>;
  }


  return (
    <Routes>
      <Route element={<Layout isAdmin={isAdmin} showMessage={showMessage} cartCount={cartProducts.length} onLogoutSuccess={() => setIsAuthenticated(false)} />}>
        <Route
          index
          element={
              <AllProducts
                products={availableProducts}
                onAddToCartClick={handleAddToCart}
              />
          }
      />

        <Route
          path="product/:productId"
          element={
              <ProductPage
                inventoryProducts={products}
                onUpdateProduct={handleUpdateProduct}
                products={availableProducts}
                username={username}
                onAddToCartClick={handleAddToCart}
                isAdmin={isAdmin}
              />
          }
        />

        <Route
          path="cart"
          element={
            <>
              <CartPage items={cartProducts} onRemoveItem={id =>
                setCartProducts(current => removeCartItemById(current, id))
              } />
            </>
          }
        />

      </Route>
    </Routes>
  );
}

export default App;
