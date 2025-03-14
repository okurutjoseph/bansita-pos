declare module '@woocommerce/woocommerce-rest-api' {
  interface WooCommerceResponse<T> {
    data: T;
    status: number;
    headers: Record<string, string>;
  }

  export default class WooCommerceRestApi {
    constructor(options: {
      url: string;
      consumerKey: string;
      consumerSecret: string;
      version: string;
      wpAPIPrefix?: string;
      queryStringAuth?: boolean;
      encoding?: string;
      axiosConfig?: object;
    });
    
    get<T = unknown>(endpoint: string, params?: object): Promise<WooCommerceResponse<T>>;
    post<T = unknown>(endpoint: string, data: object, params?: object): Promise<WooCommerceResponse<T>>;
    put<T = unknown>(endpoint: string, data: object, params?: object): Promise<WooCommerceResponse<T>>;
    delete<T = unknown>(endpoint: string, params?: object): Promise<WooCommerceResponse<T>>;
    options<T = unknown>(endpoint: string, params?: object): Promise<WooCommerceResponse<T>>;
  }
} 