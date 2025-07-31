import { config } from "./config.js";

const FREISPACE_API_KEY =
  config.apiKey || process.env.FREISPACE_API_KEY || process.env.API_KEY;

const isTesting = process.env.DEBUG === "true" ? true : false;
export const BASE_URL = isTesting
  ? "http://api.mcp.ai.app.freispace.io"
  : "https://api.mcp.ai.app.freispace.com";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface HttpClient {
  get<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<{ status: number; data: T }>;
  post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<{ status: number; data: T }>;
  put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<{ status: number; data: T }>;
  delete<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<{ status: number; data: T }>;
  patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<{ status: number; data: T }>;
}

const createMethod = (method: HttpMethod) => {
  return async <T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {},
  ) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(FREISPACE_API_KEY ? { "x-api-key": FREISPACE_API_KEY } : {}),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      method,
      headers,
      ...(data ? { body: JSON.stringify(data) } : {}),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${await response.text()}`,
      );
    }

    return { status: response.status, data: (await response.json()) as T };
  };
};

export const freispaceClient: HttpClient = {
  get: createMethod("GET"),
  post: createMethod("POST"),
  put: createMethod("PUT"),
  delete: createMethod("DELETE"),
  patch: createMethod("PATCH"),
};
