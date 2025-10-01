// client/src/services/reviewService.ts
// Responsabilité unique : Gestion des avis clients

import { httpClient } from "./httpClient";
import type { Review, ApiResponse } from "@/types";

/**
 * Interface pour les données d'ajout d'avis
 */
interface AddReviewData {
  starId: number;
  rating: number;
  comment: string;
}

/**
 * Service de gestion des avis clients
 * Responsabilité unique : CRUD des avis et évaluations
 */
export class ReviewService {
  /**
   * Récupérer les avis pour une étoile spécifique
   */
  static async getReviewsForStar(starId: number): Promise<ApiResponse<Review[]>> {
    const response = await httpClient.get<ApiResponse<Review[]>>("/reviews", { params: { starId } });
    return response.data;
  }

  /**
   * Ajouter un nouvel avis
   */
  static async addReview(reviewData: AddReviewData): Promise<ApiResponse<Review>> {
    const response = await httpClient.post<ApiResponse<Review>>("/reviews/add", reviewData);
    return response.data;
  }

  /**
   * Mettre à jour un avis existant
   */
  static async updateReview(reviewId: number, reviewData: Partial<AddReviewData>): Promise<ApiResponse<Review>> {
    const response = await httpClient.put<ApiResponse<Review>>(`/reviews/${reviewId}`, reviewData);
    return response.data;
  }

  /**
   * Supprimer un avis
   */
  static async deleteReview(reviewId: number): Promise<ApiResponse<null>> {
    const response = await httpClient.delete<ApiResponse<null>>(`/reviews/${reviewId}`);
    return response.data;
  }

  /**
   * Récupérer les avis d'un utilisateur
   */
  static async getUserReviews(): Promise<ApiResponse<Review[]>> {
    const response = await httpClient.get<ApiResponse<Review[]>>("/reviews/user");
    return response.data;
  }

  /**
   * Signaler un avis inapproprié
   */
  static async reportReview(reviewId: number, reason: string): Promise<ApiResponse<null>> {
    const response = await httpClient.post<ApiResponse<null>>(`/reviews/${reviewId}/report`, { reason });
    return response.data;
  }
}

// Exports nommés pour compatibilité
export const getReviewsForStar = ReviewService.getReviewsForStar;
export const addReview = ReviewService.addReview;