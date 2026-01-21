export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

export const successResponse = <T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> => ({
  success: true,
  data,
  meta,
});
