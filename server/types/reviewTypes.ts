import { Product } from "./productTypes";

interface Review {
  id: number;
  product_id: number | null;
  user_id: number | null;
  comment: string | null;
  created_at: string | null;
  username: string | null;
}

interface ProductReviewsProps {
  product: Product;
  reviews: Review[];
}

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted: () => void;
}

export {Review, ProductReviewsProps, ReviewFormProps}

