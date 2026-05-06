import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ReviewService } from "@/services/reviewService";
import FadeInSection from "./FadeInSection";
import type { Review } from "@/types";

interface ReviewSectionProps {
  starId: number;
}

const StarRating: React.FC<{
  rating: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}> = ({ rating, interactive = false, onRate }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          className={`text-xl ${interactive ? "cursor-pointer" : "cursor-default"} ${
            star <= rating ? "text-yellow-400" : "text-gray-400"
          }`}
          aria-label={`${star} etoile${star > 1 ? "s" : ""}`}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ starId }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await ReviewService.getReviewsForStar(starId);
      setReviews(response.data || []);
    } catch {
      // Silently fail - reviews are not critical
    } finally {
      setLoading(false);
    }
  }, [starId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (isAuthenticated && reviews.length > 0) {
      const userId = Number(localStorage.getItem("userId"));
      setHasReviewed(reviews.some((r) => r.userId === userId));
    }
  }, [reviews, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      setError("Veuillez selectionner une note.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await ReviewService.addReview({
        starId,
        rating: newRating,
        comment: newComment,
      });
      setNewRating(0);
      setNewComment("");
      setHasReviewed(true);
      await fetchReviews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'envoi de l'avis."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-display mb-6 text-text">
        Avis ({reviews.length})
      </h2>

      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <StarRating rating={Math.round(averageRating)} />
          <span className="text-lg font-serif text-text">
            {averageRating.toFixed(1)} / 5
          </span>
        </div>
      )}

      {isAuthenticated && !hasReviewed && (
        <FadeInSection>
          <div className="bg-secondary text-text p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-lg font-display mb-4">Laisser un avis</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="block text-sm font-serif mb-2">Votre note</span>
                <StarRating rating={newRating} interactive onRate={setNewRating} />
              </div>
              <div>
                <label htmlFor="review-comment" className="block text-sm font-serif mb-2">
                  Commentaire (optionnel)
                </label>
                <textarea
                  id="review-comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partagez votre experience..."
                  className="w-full p-3 rounded-md bg-primary text-text placeholder-text/50"
                  rows={3}
                  maxLength={500}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={submitting} className="btn">
                {submitting ? "Envoi..." : "Publier l'avis"}
              </button>
            </form>
          </div>
        </FadeInSection>
      )}

      {loading ? (
        <p className="text-text/70">Chargement des avis...</p>
      ) : reviews.length === 0 ? (
        <p className="text-text/70 font-serif">
          Aucun avis pour le moment. Soyez le premier a donner votre avis !
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <FadeInSection key={review.id}>
              <div className="bg-secondary text-text p-4 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <StarRating rating={review.rating} />
                    {review.user && (
                      <span className="text-sm text-text/70">
                        {review.user.firstName} {review.user.lastName?.charAt(0)}.
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-text/50">
                    {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {review.comment && (
                  <p className="font-serif text-sm">{review.comment}</p>
                )}
              </div>
            </FadeInSection>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
