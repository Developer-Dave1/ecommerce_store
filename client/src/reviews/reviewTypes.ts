interface Review {
  id: number;
  product_id: number | null;
  user_id: number | null;
  comment: string | null;
  created_at: string | null;
  username: string | null;
}

interface ProductReviewsProps {
  username: string;
  productId: number;
}

interface ReviewFormProps {
  username: string;
  productId: number;
  onReviewSubmitted: () => void;
}

export type { Review, ProductReviewsProps, ReviewFormProps };
