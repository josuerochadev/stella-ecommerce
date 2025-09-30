// client/src/services/starService.ts
// Responsabilité unique : Gestion du catalogue d'étoiles

import { httpClient } from "./httpClient";
import type { Star, StarFromServer, ApiResponse } from "@/types";
import { transformStarPrice } from "@/utils/dataTransformers";

/**
 * Interface pour les paramètres de filtrage
 */
interface StarFilterParams {
  constellation?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  minMagnitude?: number;
  maxMagnitude?: number;
  minDistance?: number;
  maxDistance?: number;
  minLuminosity?: number;
  maxLuminosity?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
}

/**
 * Service de gestion du catalogue d'étoiles
 * Responsabilité unique : CRUD et recherche d'étoiles
 */
export class StarService {
  /**
   * Récupérer toutes les étoiles
   */
  static async fetchStars(): Promise<ApiResponse<Star[]>> {
    const response = await httpClient.get<ApiResponse<StarFromServer[]>>("/stars");
    // Transformation des prix string → number
    const transformedData = {
      ...response.data,
      data: response.data.data.map((star: StarFromServer) =>
        transformStarPrice(star as unknown as Star)
      )
    };
    return transformedData;
  }

  /**
   * Récupérer une étoile par son ID
   */
  static async getStarById(starId: number): Promise<Star> {
    const response = await httpClient.get<{ data: StarFromServer }>(`/stars/${starId}`);
    return transformStarPrice(response.data.data as unknown as Star);
  }

  /**
   * Filtrer les étoiles selon des critères
   */
  static async filterStars(params: StarFilterParams): Promise<ApiResponse<Star[]>> {
    const processedParams = { ...params };
    if (Array.isArray(processedParams.constellation)) {
      processedParams.constellation = processedParams.constellation.join(',');
    }

    const response = await httpClient.get<ApiResponse<StarFromServer[]>>("/stars/filter", { params: processedParams });
    const transformedData = {
      ...response.data,
      data: response.data.data.map((star: StarFromServer) =>
        transformStarPrice(star as unknown as Star)
      )
    };
    return transformedData;
  }

  /**
   * Rechercher des étoiles par nom
   */
  static async searchStars(query: string): Promise<Star[]> {
    const response = await httpClient.get<{ success: boolean; data: StarFromServer[]; count: number }>("/stars/search", { params: { q: query } });
    return response.data.data.map((star: StarFromServer) =>
      transformStarPrice(star as unknown as Star)
    );
  }

  /**
   * Récupérer les étoiles les plus récentes
   */
  static async getLatestStars(limit: number = 10): Promise<Star[]> {
    const response = await httpClient.get<{ success: boolean; data: StarFromServer[] }>("/stars/latest", { params: { limit } });
    return response.data.data.map((star: StarFromServer) =>
      transformStarPrice(star as unknown as Star)
    );
  }

  /**
   * Récupérer les constellations disponibles
   */
  static async getConstellations(): Promise<string[]> {
    const response = await httpClient.get<{ success: boolean; data: string[] }>("/stars/constellations");
    return response.data.data;
  }
}

// Exports nommés pour compatibilité
export const fetchStars = StarService.fetchStars;
export const fetchStarById = StarService.getStarById; // Alias pour compatibilité
export const getStarById = StarService.getStarById;
export const filterStars = StarService.filterStars;
export const searchStars = StarService.searchStars;