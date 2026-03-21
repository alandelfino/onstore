import { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

export default function StoreSettingsPage() {
  const { activeStore, fetchStores } = useStore();
  const [domain, setDomain] = useState("");
  const [storeName, setStoreName] = useState("");
  const [savingDomain, setSavingDomain] = useState(false);

  useEffect(() => {
    if (activeStore) {
      setDomain(activeStore.allowedDomain || "");
      setStoreName(activeStore.name || "");
    }
  }, [activeStore]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStore) return;
    setSavingDomain(true);
    try {
      const res = await apiFetch(`/api/stores/${activeStore.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: storeName, allowedDomain: domain || null })
      });
      if (res.ok) {
        await fetchStores();
        alert("Configurações salvas com sucesso!");
      } else {
        alert("Erro ao salvar configurações.");
      }
    } finally {
      setSavingDomain(false);
    }
  };

  if (!activeStore) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações da Loja</h1>
        <p className="text-muted-foreground mt-2">
          Edite as propriedades e permissões de acesso da loja ativa.
        </p>
      </div>

      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Informações e Acesso</CardTitle>
          <CardDescription>Altere o nome da loja e o domínio permitido para requisições externas.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
            
            <div className="grid gap-2">
              <Label htmlFor="storeName">Nome da Loja</Label>
              <Input 
                id="storeName" 
                placeholder="Nome da Loja" 
                value={storeName} 
                onChange={e => setStoreName(e.target.value)} 
                disabled={savingDomain} 
                className="max-w-md"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="domain">Domínio Permitido (CORS)</Label>
              <Input 
                id="domain" 
                placeholder="ex: meudominio.com.br" 
                value={domain} 
                onChange={e => setDomain(e.target.value)} 
                disabled={savingDomain} 
                className="max-w-md"
              />
              <p className="text-xs text-muted-foreground max-w-xl">
                Apenas as requisições oriundas deste domínio poderão carregar os carrosséis de vídeos via Embed API. Deixe em branco para permitir qualquer origem (não recomendado).
              </p>
            </div>

            <div className="pt-2 border-t flex justify-end">
              <Button type="submit" disabled={savingDomain} className="w-full sm:w-auto">
                {savingDomain ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {savingDomain ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
