import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { useNavigate, useLocation } from "react-router-dom";

interface Store {
  id: number;
  name: string;
  allowedDomain: string | null;
}

interface StoreContextType {
  stores: Store[];
  activeStore: Store | null;
  setActiveStore: (store: Store) => void;
  fetchStores: () => Promise<void>;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [activeStore, setActiveStoreState] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/stores");
      if (res.ok) {
        const data = await res.json();
        setStores(data.stores);
        
        const savedStoreId = localStorage.getItem("activeStoreId");
        if (data.stores.length > 0) {
          const found = savedStoreId ? data.stores.find((s: Store) => s.id.toString() === savedStoreId) : null;
          if (found) {
            setActiveStoreState(found);
          } else {
            // No store active yet, if we are in dashboard, maybe redirect to /stores selection
            if (location.pathname.startsWith("/dashboard") && location.pathname !== "/dashboard/stores") {
               navigate("/dashboard/stores");
            }
          }
        } else if (location.pathname.startsWith("/dashboard") && location.pathname !== "/dashboard/stores") {
          navigate("/dashboard/stores");
        }
      }
    } catch (e) {
      console.error("Failed to fetch stores", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const setActiveStore = (store: Store) => {
    setActiveStoreState(store);
    localStorage.setItem("activeStoreId", store.id.toString());
  };

  return (
    <StoreContext.Provider value={{ stores, activeStore, setActiveStore, fetchStores, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
