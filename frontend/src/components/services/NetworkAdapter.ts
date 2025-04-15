interface ApiConfig {
  MIRAGE: string;
  EXPRESS: string;
}

interface ApiResponse<T = any> {
  data: T;
  errors?: string[];
}

interface RequestOptions {
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

class NetworkAdapter {
  private static readonly API_CONFIG: ApiConfig = {
    MIRAGE: window.location.origin,
    EXPRESS: 'http://localhost:4000'
  };

  private static readonly API_URL: string = NetworkAdapter.API_CONFIG.MIRAGE;

  /**
   * Makes an HTTP request
   * @private
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const endpointURL = new URL(endpoint, NetworkAdapter.API_URL);
      const url = new URL(endpointURL, window.location.origin);

      // Add query parameters for GET requests
      if (params && method === 'GET') {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const options: RequestInit = {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url.toString(), options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`NetworkAdapter error (${method} ${endpoint}):`, error);
      return {
        data: {} as T,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Performs a GET request
   * @param endpoint API endpoint
   * @param params Query parameters
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, params);
  }

  /**
   * Performs a POST request
   * @param endpoint API endpoint
   * @param data Request body
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  /**
   * Performs a PUT request
   * @param endpoint API endpoint
   * @param data Request body
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data);
  }

  /**
   * Performs a DELETE request
   * @param endpoint API endpoint
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }

  /**
   * Performs a PATCH request
   * @param endpoint API endpoint
   * @param data Request body
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data);
  }
}

export const networkAdapter = new NetworkAdapter();