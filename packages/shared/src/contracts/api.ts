export type ApiSuccessResponse<TData> = {
  data: TData;
  message: string;
};

export type ApiMessageResponse = {
  message: string;
};

export type ApiErrorResponse = {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
};
