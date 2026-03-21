import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthUser } from "./DashboardPage";
import { useStore } from "../context/StoreContext";
import { Check, CreditCard, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";

const PLANS = {
  free:  { name: "Free",  price: "Grátis",       limits: { carousels: "1",          videos: "10",         views: "1.000"     } },
  pro:   { name: "Pro",   price: "R$ 39,90/mês",  limits: { carousels: "2",          videos: "50",         views: "10.000"    } },
  ultra: { name: "Ultra", price: "R$ 99,90/mês",  limits: { carousels: "Ilimitado",  videos: "Ilimitado",  views: "50.000"    } },
  gold:  { name: "Gold",  price: "R$ 299,90/mês", limits: { carousels: "Ilimitado",  videos: "Ilimitado",  views: "Ilimitado" } },
};

const MAX_VIEWS: Record<string, number | null> = {
  free: 1000, pro: 10000, ultra: 50000, gold: null,
};

export default function BillingPage() {
  const user = useAuthUser();
  const { activeStore } = useStore();
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const currentPlanKey = (activeStore?.plan ?? "free") as keyof typeof PLANS;
  const currentPlan = PLANS[currentPlanKey];
  const maxViews = MAX_VIEWS[currentPlanKey];
  const currentViews = activeStore?.currentCycleViews ?? 0;
  const viewPercentage = maxViews ? Math.min(100, (currentViews / maxViews) * 100) : 0;

  const handleCheckout = async (planId: string) => {
    if (!activeStore) return alert("Selecione uma loja primeiro.");
    setLoadingCheckout(planId);
    try {
      const res = await apiFetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, storeId: activeStore.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Erro ao iniciar checkout");
    } catch {
      alert("Erro na conexão");
    } finally {
      setLoadingCheckout(null);
    }
  };

  const handlePortal = async () => {
    setLoadingPortal(true);
    try {
      const res = await apiFetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Erro ao abrir portal");
    } catch {
      alert("Erro na conexão");
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Assinatura e Uso</h2>
        <p className="text-muted-foreground mt-2">Gerencie o plano e visualize o consumo da loja este mês.</p>
      </div>

      {activeStore && (
        <Card>
          <CardHeader className="bg-muted/50">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  Plano da Loja <span className="font-normal text-muted-foreground">"{activeStore.name}"</span>:
                  <span className="text-primary font-bold">{currentPlan.name}</span>
                  {user?.subscriptionStatus === "active" && (
                    <span className="bg-green-500/10 text-green-600 text-xs px-2 py-0.5 rounded-full border border-green-500/20 font-medium">Ativo</span>
                  )}
                </CardTitle>
                <CardDescription className="mt-1">As visualizações reiniciam a cada ciclo de faturamento mensal.</CardDescription>
              </div>
              {user?.subscriptionStatus === "active" && (
                <Button variant="outline" size="sm" onClick={handlePortal} disabled={loadingPortal}>
                  {loadingPortal ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                  Gerenciar Assinatura
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex justify-between text-sm font-medium">
                <span>Visualizações este ciclo</span>
                <span className="font-bold">{currentViews.toLocaleString("pt-BR")} / {maxViews ? maxViews.toLocaleString("pt-BR") : "∞"}</span>
              </div>
              <Progress value={viewPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground">
                Contabilizado cada vez que o widget do carrossel é carregado em qualquer site público.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-xl font-bold tracking-tight mb-6">Planos Disponíveis</h3>
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6">
          {(Object.entries(PLANS) as [string, typeof PLANS["free"]][]).map(([id, plan]) => {
            const matchesCurrent = activeStore?.plan === id;

            return (
              <Card key={id} className={`flex flex-col transition-all ${matchesCurrent ? "border-primary shadow-xl ring-1 ring-primary" : ""}`}>
                <CardHeader>
                  {matchesCurrent && (
                    <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Plano Atual
                    </div>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base font-semibold text-foreground mt-1">{plan.price}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2.5 text-sm">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /><b>{plan.limits.carousels}</b>&nbsp;Carrossel(eis)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /><b>{plan.limits.videos}</b>&nbsp;Vídeos</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /><b>{plan.limits.views}</b>&nbsp;Views/mês</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  {id === "free" ? (
                    <Button variant="outline" className="w-full" disabled>Plano Gratuito</Button>
                  ) : matchesCurrent ? (
                    <Button variant="secondary" className="w-full" disabled>Plano Atual</Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleCheckout(id)}
                      disabled={loadingCheckout !== null}
                    >
                      {loadingCheckout === id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ExternalLink className="w-4 h-4 mr-2" />
                      )}
                      Assinar {plan.name}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
