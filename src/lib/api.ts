import axios, { isAxiosError, type AxiosError } from "axios";
import type { JsonApiErrorResponse } from "../../types/json-api";

const API_BASE_URL = import.meta.env.VITE_API_LOCAL_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

/**
 * Extrait les erreurs de validation d'une réponse JSON:API (Laravel).
 * Prend un AxiosError déjà narrowé — pas de `unknown`, typage complet.
 * Retourne un tableau de { field, message } prêt à passer à form.setError().
 *
 * Usage dans un catch :
 *   if (isAxiosError<JsonApiErrorResponse>(error)) {
 *     extractJsonApiFieldErrors(error).forEach(({ field, message }) => {
 *       form.setError(field as keyof MyFormData, { type: "manual", message });
 *     });
 *   }
 */
export function extractJsonApiFieldErrors(
  error: AxiosError<JsonApiErrorResponse>,
): Array<{ field: string; message: string }> {
  const body = error.response?.data;
  if (!body?.errors?.length) return [];

  return body.errors.reduce<Array<{ field: string; message: string }>>(
    (acc, err) => {
      const field = err.source?.pointer?.split("/").at(-1);
      if (field && err.detail) {
        acc.push({ field, message: err.detail });
      }
      return acc;
    },
    [],
  );
}

export { isAxiosError };
