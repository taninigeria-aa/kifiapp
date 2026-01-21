// Helper type for axios error handling
export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosErrorResponse;
    return axiosError.response?.data?.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}
