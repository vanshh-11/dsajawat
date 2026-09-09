import { useState, useCallback, useEffect } from "react";

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  event_type: string | null;
  message: string | null;
  source: string;
  page_url: string | null;
  user_agent: string | null;
  referrer: string | null;
  status: string;
  priority: number;
  responded_at: string | null;
  responded_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  swatchRequests?: SwatchRequest[];
}

export interface SwatchRequest {
  id: string;
  inquiry_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  address: Record<string, any>;
  products_requested: string[] | null;
  tracking_number: string | null;
  status: string;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
}

export interface AdminStats {
  inquiries: {
    total: number;
    thisWeek: number;
    thisMonth: number;
    conversionRate: string;
    avgResponseTime: string;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
  };
  swatches: {
    total: number;
    pending: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export function useAdminAuth() {
  const [session, setSession] = useState<{ access_token: string; user: { id: string; email: string } } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("admin_session");
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        localStorage.removeItem("admin_session");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (password: string) => {
    const response = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (data.success) {
      setSession(data.session);
      localStorage.setItem("admin_session", JSON.stringify(data.session));
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("admin_session");
  };

  const getAuthHeaders = () => {
    if (!session) return {};
    return {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    };
  };

  return { session, isLoading, login, logout, getAuthHeaders, isAuthenticated: !!session };
}

export function useAdminInquiries(authHeaders: () => Record<string, string>) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async (params?: {
    status?: string;
    source?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set("status", params.status);
      if (params?.source) searchParams.set("source", params.source);
      if (params?.search) searchParams.set("search", params.search);
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.offset) searchParams.set("offset", String(params.offset));

      const response = await fetch(`/api/inquiries/admin/list?${searchParams.toString()}`, {
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch inquiries");

      setInquiries(data.inquiries);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inquiries");
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders]);

  const updateInquiry = async (id: string, data: Partial<Inquiry>) => {
    const response = await fetch(`/api/inquiries/admin/update?id=${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to update inquiry");
    
    // Update local state
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, ...result.inquiry } : i));
    return result.inquiry;
  };

  return { inquiries, total, isLoading, error, fetchInquiries, updateInquiry };
}

export function useAdminStats(authHeaders: () => Record<string, string>) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/inquiries/admin/stats", {
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch stats");
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders]);

  return { stats, isLoading, error, fetchStats };
}

export function useAdminProducts(authHeaders: () => Record<string, string>) {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (params?: {
    active?: boolean;
    featured?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      if (params?.active !== undefined) searchParams.set("active", String(params.active));
      if (params?.featured !== undefined) searchParams.set("featured", String(params.featured));
      if (params?.search) searchParams.set("search", params.search);
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.offset) searchParams.set("offset", String(params.offset));

      const response = await fetch(`/api/products/admin/list?${searchParams.toString()}`, {
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch products");
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders]);

  const createProduct = async (data: any) => {
    const response = await fetch("/api/products/admin/create", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to create product");
    setProducts(prev => [result.product, ...prev]);
    setTotal(prev => prev + 1);
    return result.product;
  };

  const updateProduct = async (id: string, data: any) => {
    const response = await fetch(`/api/products/admin/update?id=${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to update product");
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...result.product } : p));
    return result.product;
  };

  const deleteProduct = async (id: string) => {
    const response = await fetch(`/api/products/admin/delete?id=${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to delete product");
    setProducts(prev => prev.filter(p => p.id !== id));
    setTotal(prev => prev - 1);
  };

  return { products, total, isLoading, error, fetchProducts, createProduct, updateProduct, deleteProduct };
}

export function useAdminSwatches(authHeaders: () => Record<string, string>) {
  const [swatches, setSwatches] = useState<SwatchRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSwatches = useCallback(async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set("status", params.status);
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.offset) searchParams.set("offset", String(params.offset));

      const response = await fetch(`/api/swatch/list?${searchParams.toString()}`, {
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch swatches");
      setSwatches(data.swatchRequests);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load swatches");
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders]);

  return { swatches, total, isLoading, error, fetchSwatches };
}