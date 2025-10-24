import { create } from 'zustand';
import { SelectProduct } from '@/lib/db/schema';

interface ProductStore {
  products: SelectProduct[];
  loading: boolean;
  error: string | null;
  setProducts: (products: SelectProduct[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const products = await response.json();
      set({ products, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
    }
  },
}));
