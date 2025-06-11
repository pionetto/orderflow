export interface NormalizedProduct {
    product_id: number;
    value: string;
}
  
export interface NormalizedOrder {
    order_id: number;
    total: string;
    date: string;
    products: NormalizedProduct[];
}
  
export interface NormalizedUser {
    user_id: number;
    name: string;
    orders: NormalizedOrder[];
}