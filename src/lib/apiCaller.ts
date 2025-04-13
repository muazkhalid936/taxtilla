import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Define a JSONValue type that allows primitives, arrays, and objects.
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

// Then update RequestData to use JSONValue:
type RequestData = JSONValue | FormData;

// type RequestData =
//   | Record<string, string | number | boolean | File | Blob | null | undefined>
//   | FormData;

const apiCaller = async (
  url: string,
  method: AxiosRequestConfig["method"] = "GET",
  data?: RequestData,
  options: AxiosRequestConfig = {},
  useAuth: boolean = true,
  dataType: "json" | "formdata" = "json",
  onErrorRefresh: boolean = false
): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    ...options,
    method,
    headers: {
      ...(options.headers || {}),
    },
  };
  config.headers = {
    ...(options.headers || {}),
  };
  if (useAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (data) {
    if (dataType === "json") {
      config.data = data;
      config.headers["Content-Type"] = "application/json";
    } else if (dataType === "formdata") {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });
      config.data = formData;
      delete config.headers["Content-Type"];
    }
  }

  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;
    const response = await axios(fullUrl, config);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (onErrorRefresh) {
        window.location.reload();
      }
      throw error;
    } else {
      throw { message: "Network error or unknown error occurred" };
    }
  }
};

export default apiCaller;
