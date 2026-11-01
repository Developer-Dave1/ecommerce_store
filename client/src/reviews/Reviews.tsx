import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import "./reviews.css";
import type { Review, ProductReviewsProps, ReviewFormProps } from "./reviewTypes";



const ProductReviews = ({ username, productId}: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [refreshCount, setRefreshCount] = useState(0);

  const deleteReview = async () => {
    try {
      const response =  await fetch(`/products/item/${productId}/review/delete`, { method: 'POST'});
      if (!response.ok) {
        throw new Error(`There was error deleting the review.`);
      }
      setRefreshCount((count) => count + 1);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }
    
    
    

  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await fetch(`/products/item/${productId}/reviews`);
        if (response.ok) {
          const data: Review[] = await response.json();
          setReviews(data);
        }
      } catch(error) {
        console.warn(`Fetching review data failed`, error);
      }
    }
    loadReviews();
    }, [productId, refreshCount]);


  return (
  <section className="my-5 mx-auto product-reviews" aria-labelledby="reviews-heading">
    <div className="d-flex align-items-center gap-3 mb-4">
      <h3 id="reviews-heading" className="h4 mb-0">Customer reviews</h3>
      <span className="badge rounded-pill text-bg-secondary">{reviews.length}</span>
    </div>

    <div className="d-flex flex-column gap-3 mb-4">
    {reviews.map((review) => (
      <article key={review.id} className="border rounded-3 p-3 p-sm-4 bg-body-tertiary text-start">
        <strong className="d-block mb-2">{review.username}</strong>
        <div className="d-flex align-items-start justify-content-between gap-3">
          <p className="mb-0 text-break review-comment flex-grow-1">{review.comment}</p>
          {review.username === username && (
            <button type="button" className="btn btn-danger btn-sm flex-shrink-0" onClick={deleteReview}>
              Delete
            </button>
          )}
        </div>
      </article>
      ))}
    </div>

    <ReviewForm
      username={username}
      productId={productId}
      onReviewSubmitted={() => setRefreshCount((count) => count + 1)}
    />
  </section>
  );
};


const ReviewForm = ({ username, productId, onReviewSubmitted } : ReviewFormProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const sendComment = await fetch(`/products/item/${productId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          product_id: productId,
          comment: comment
        })
      });
      if (!sendComment.ok) {
        throw new Error(`Could not send review to server.`);
      }

      setComment("");
      onReviewSubmitted();


    } catch (error) {
      console.warn(`There was an error saving the review.`, error);
    }
  }


  return (
  <form onSubmit={handleSubmit} className="border rounded-3 p-3 p-sm-4 text-start">
    <h4 className="h5 mb-3">Leave a review</h4>
    <textarea
      id="review-comment"
      className="form-control mb-3 review-comment-input"
      rows={4}
      placeholder="Share your experience with this product…"
      value={comment}
      onChange={(event) => setComment(event.target.value)}
    />
    <div className="d-flex justify-content-end">
      <button type="submit" className="btn btn-primary px-4">Post review</button>
    </div>
  </form>
);
}


export { ProductReviews };
