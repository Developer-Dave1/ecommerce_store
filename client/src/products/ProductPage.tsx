import { useParams } from "react-router";
import "./products.css";

import type { ProductPageProps, EditProductProps, ProductUpdate } from "./productTypes";
import { AddToCartButton } from "../buttons/Buttons";
import { ShowAllProducts } from "../buttons/Buttons";
import { ProductReviews } from "../reviews/Reviews";
import { useState, type FormEvent } from "react";

const ProductPage = ({
  username,
  products,
  inventoryProducts,
  onAddToCartClick,
  onUpdateProduct,
  isAdmin, 
}: ProductPageProps) => {
  const { productId } = useParams();

  const product = products.find(
    (currentProduct) =>
      currentProduct.id === Number(productId)
  );

  const [isEditing, setIsEditing] = useState(false);

  const inventoryProduct = inventoryProducts.find(item => item.id === Number(productId));

  if (!product) {
    return (
      <main className="container py-4">
        <h2>Product not found</h2>

        <ShowAllProducts/>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <div className="mt-4">
        <div className="product-page-header mb-4">
          <h2 className="fw-bold mb-0 product-page-title text-center">
            {product.product_name}
          </h2>
          <div className="product-page-back">
            <ShowAllProducts />
          </div>
        </div>

        <div className="product-page-image-row mb-4">
          <div className="bg-white border rounded-4 shadow-sm p-2 product-page-image-container">
            <img
              src={product.image_url}
              className="img-fluid product-page-image d-block mx-auto rounded-3"
              alt={product.product_name}
            />
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
          <AddToCartButton
            disabled={product.quantity <= 0}
            onClick={() => onAddToCartClick(product)}
          />
          {
            isAdmin ? <button type="button" id="edit-button" className="btn btn-warning fw-semibold px-4 shadow-sm" onClick={() => setIsEditing(true)}>Edit product</button> : null
          }
        </div>

        {isAdmin && isEditing && inventoryProduct && (
          <div className="product-page-details mx-auto mb-4">
            <EditProduct key={inventoryProduct.id} product={inventoryProduct} onCancel={() => setIsEditing(false)} updateProduct={async (values) => {
              await onUpdateProduct(product.id, values);
              setIsEditing(false);
            }}
            />
          </div>
        )}

        <section className="product-page-details mx-auto mb-5 text-start" aria-labelledby="product-details-heading">
          <h3 id="product-details-heading" className="h4 mb-3">Product details</h3>
          <div className="border rounded-3 bg-body-tertiary p-3 p-sm-4">
          <dl className="product-specs mb-4">
            <div>
              <dt className="text-body-secondary fw-normal mb-1">Price</dt>
              <dd className="fs-4 fw-semibold mb-0">${Number(product.price).toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-body-secondary fw-normal mb-1">Availability</dt>
              <dd className={`mb-0 fs-4 fw-semibold ${product.quantity > 0 ? 'text-success' : 'text-danger'}`}>
                {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
              </dd>
            </div>
          </dl>
          <h4 className="product-page-description-heading mb-2">About this product</h4>
          <p className="product-page-description mb-0">{product.description}</p>
          </div>
        </section>

        <ProductReviews username={username} productId={product.id}></ProductReviews>

      </div>
    </main>
  );
};


const EditProduct = ({product, onCancel, updateProduct}: EditProductProps) => {
  const [productName, setProductName] = useState(product.product_name);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(String(product.quantity));
  const [description, setDescription] = useState(product.description);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (productName.trim() === '' || productName.trim().length > 50) {
      setError('Product name must be between 1 and 50 characters.');
      return;
    }

    if (price.trim() === '') {
      setError('Please provide a price.');
      return;
    }

    if (quantity.trim() === '') {
      setError('Please provide a quantity.');
      return;
    }

    const valuesObject: ProductUpdate = {
      product_name: productName.trim(),
      price: Number(price),
      quantity: Number(quantity),
      description: description
    }

    if (!Number.isSafeInteger(valuesObject.quantity) || valuesObject.quantity < 0 || valuesObject.quantity > 100) {
      setError('Quantity must be a whole number between 0 and 100.');
      return;
    }

    if (!Number.isFinite(valuesObject.price) || valuesObject.price < 0.01 || valuesObject.price > 100) {
      setError('Price must be between $0.01 and $100.00.');
      return;
    }

    try {
      await updateProduct(valuesObject);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to update product. Please try again.');
    }

  }

  return (
    <section id="edit-product" className="border rounded-4 shadow-sm bg-body-tertiary p-3 p-sm-4 text-start" aria-labelledby="edit-product-title">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <h3 id="edit-product-title" className="h4 mb-0">Edit product</h3>
      </div>
        {error && <span id="error-message-span" className="alert alert-danger" role="alert">{error}</span>}
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-sm-8">
          <label htmlFor="edit-product-name" className="form-label fw-semibold">Name</label>
          <input id="edit-product-name" className="form-control" type="text" value={productName} onChange={(event) => setProductName(event.target.value)}/>
        </div>
        <div className="col-12">
          <label htmlFor="edit-product-price" className="form-label fw-semibold">Price</label>
          <input id="edit-product-price" type="number" className="form-control" step="0.01" value={price}  onChange={(event) => setPrice(event.target.value)}/>
        </div>
        <div className="col-sm-4">
          <label htmlFor="edit-product-quantity" className="form-label fw-semibold">Quantity</label>
          <input id="edit-product-quantity" className="form-control" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)}/>
        </div>
        <div className="col-12">
          <label htmlFor="edit-product-description" className="form-label fw-semibold">Description</label>
          <textarea id="edit-product-description" className="form-control" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
        <div className="d-flex justify-content-end gap-3 border-top mt-4 pt-3">
          <button type="submit" className="btn btn-success px-4">Submit</button>
          <button type="button" className="btn btn-danger px-4" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  )
}

export { ProductPage };
