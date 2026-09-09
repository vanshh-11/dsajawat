import { useState, useEffect } from "react";

export interface Product {
  id: string;
  slug: string;
  title: string;
  overline: string | null;
  description: string | null;
  images: string[];
  category: string | null;
  gsm: number | null;
  width_cm: number | null;
  composition: string | null;
  colors: Record<string, string> | null;
  min_order_meters: number | null;
  price_per_meter: number | null;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  error?: string;
}

export function useProducts(params?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const searchParams = new URLSearchParams();
        if (params?.category) searchParams.set("category", params.category);
        if (params?.featured !== undefined) searchParams.set("featured", String(params.featured));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        if (params?.offset) searchParams.set("offset", String(params.offset));

        const response = await fetch(`/api/products/list?${searchParams.toString()}`);
        const data: ProductsResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [params?.category, params?.featured, params?.limit, params?.offset]);

  return { products, total, isLoading, error };
}

export async function getProduct(slug: string): Promise<Product | null> {
  const response = await fetch(`/api/products/get?slug=${slug}`);
  const data = await response.json();
  
  if (!response.ok) return null;
  return data.product;
}