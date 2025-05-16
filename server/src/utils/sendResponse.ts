interface ResponseData<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export const sendResponse = <T>(
  status: number,
  message: string,
  data: T,
): ResponseData<T> => {
  return {
    success: true,
    status,
    message,
    data,
  };
};
