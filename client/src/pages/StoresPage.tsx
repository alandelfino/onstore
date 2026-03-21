import { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { Loader2, Store as StoreIcon, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function StoresPage() {
  const { stores, activeStore, setActiveStore, fetchStores, loading } = useStore();
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreDomain, setNewStoreDomain] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, []);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;

    setIsPending(true);
    try {
      const res = await apiFetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newStoreName, allowedDomain: newStoreDomain || null }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewStoreName("");
        setNewStoreDomain("");
        await fetchStores();
        setActiveStore(data.store);
        navigate("/dashboard");
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleSelectStore = (store: any) => {
    setActiveStore(store);
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-muted-foreground w-full h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="mt-4 text-sm">Carregando lojas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Suas Lojas</h1>
        <p className="text-muted-foreground mt-2">
          Selecione a loja que deseja gerenciar ou crie uma nova para isolar seus produtos e vídeos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map(store => (
          <Card 
            key={store.id} 
            className={`cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden ${activeStore?.id === store.id ? 'border-primary shadow-sm bg-primary/5' : ''}`}
            onClick={() => handleSelectStore(store)}
          >
             {activeStore?.id === store.id && (
               <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-1 rounded-bl-lg">
                 <Check className="w-4 h-4" />
               </div>
             )}
             <CardHeader>
               <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
                 <StoreIcon className="w-5 h-5 text-secondary-foreground" />
               </div>
               <CardTitle>{store.name}</CardTitle>
               <CardDescription className="line-clamp-1">{store.allowedDomain || "Sem domínio configurado"}</CardDescription>
             </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-12 border-t pt-10">
        <Card className="max-w-md bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Criar Nova Loja</CardTitle>
            <CardDescription>Crie um ambiente isolado para um novo site ou projeto.</CardDescription>
          </CardHeader>
          <CardContent>
             <form onSubmit={handleCreateStore} className="flex flex-col gap-4">
               <Input 
                 placeholder="Nome da Loja" 
                 value={newStoreName} 
                 onChange={e => setNewStoreName(e.target.value)} 
                 disabled={isPending}
               />
               <Input 
                 placeholder="Domínio (ex: site.com.br) - Opcional" 
                 value={newStoreDomain} 
                 onChange={e => setNewStoreDomain(e.target.value)} 
                 disabled={isPending}
               />
               <Button type="submit" disabled={isPending || !newStoreName.trim()}>
                 {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                 {isPending ? "Criando..." : "Criar loja"}
               </Button>
             </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
