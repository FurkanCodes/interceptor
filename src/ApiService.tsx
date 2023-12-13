import axios, { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";

export interface ApiResponse {
  userId?: number;
  id?: number;
  title?: string;
  body?: string;
  resultType?: "Unexpected" | "NotFound" | "Invalid" | "Ok";
  messages?: string[];
}

const api = axios.create({});

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Custom 'resultType' and 'messages' exist in the response
    if (response.data.resultType && response.data.messages) {
      const message = response.data.messages[0];
      switch (response.data.resultType) {
        case "Ok":
          toast.success(message);
          break;
        case "Invalid":
          toast.warn(message);
          break;
        case "Unexpected":
          toast.error(message);
          break;
        case "NotFound":
          toast.info(message);
          break;
        default:
          toast(message);
      }
    }
    return response;
  },
  (error: any) => {
    // HTTP status code handling
    const status = error.response?.status;
    let message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    switch (status) {
      case 400:
        toast.error(`Bad Request: ${message}`);
        break;
      case 401:
        toast.error(`Unauthorized: ${message}`);
        break;
      case 403:
        toast.error(`Forbidden: ${message}`);
        break;
      case 404:
        toast.error(`Not Found: ${message}`);
        break;
      case 500:
        toast.error(`Internal Server Error: ${message}`);
        break;
      default:
        toast.error(`Error: ${message}`);
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
