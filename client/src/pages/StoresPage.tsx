import { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { Loader2, Store as StoreIcon, Plus, Check, X, Zap, Crown, Gem, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useNavigate } from "react-router-dom";

// ─── Plan definitions ────────────────────────────────────────────────────────

type PlanId = "free" | "pro" | "ultra" | "gold";

const PLANS: Record<PlanId, {
  name: string;
  price: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  badge?: string;
  features: string[];
}> = {
  free: {
    name: "Free",
    price: "Grátis",
    description: "Ideal para começar e testar a plataforma.",
    color: "border-border",
    icon: <Zap className="w-5 h-5" />,
    features: [
      "1 Carrossel",
      "10 Vídeos",
      "Até 1.000 visualizações / mês",
      "Domínio personalizado",
    ],
  },
  pro: {
    name: "Pro",
    price: "R$ 39,90/mês",
    description: "Para lojas que estão crescendo rápido.",
    color: "border-blue-500",
    badge: "Popular",
    icon: <Rocket className="w-5 h-5 text-blue-500" />,
    features: [
      "2 Carrosseis",
      "50 Vídeos",
      "Até 10.000 visualizações / mês",
      "Domínio personalizado",
      "Suporte prioritário",
    ],
  },
  ultra: {
    name: "Ultra",
    price: "R$ 99,90/mês",
    description: "Recursos ilimitados para alto volume.",
    color: "border-purple-500",
    badge: "Recomendado",
    icon: <Gem className="w-5 h-5 text-purple-500" />,
    features: [
      "Carrosseis Ilimitados",
      "Vídeos Ilimitados",
      "Até 50.000 visualizações / mês",
      "Domínio personalizado",
      "Suporte prioritário",
      "Analytics avançado",
    ],
  },
  gold: {
    name: "Gold",
    price: "R$ 299,90/mês",
    description: "Sem limites. Ideal para grandes operações.",
    color: "border-yellow-500",
    icon: <Crown className="w-5 h-5 text-yellow-500" />,
    features: [
      "Tudo Ilimitado",
      "Visualizações Ilimitadas",
      "Domínio personalizado",
      "Suporte VIP 24/7",
      "Analytics avançado",
      "Integrações exclusivas",
    ],
  },
};

// ─── Plan Selector Modal ──────────────────────────────────────────────────────

function PlanModal({
  selected,
  onSelect,
  onClose,
}: {
  selected: PlanId;
  onSelect: (plan: PlanId) => void;
  onClose: () => void;
}) {
  const [hoveredPlan, setHoveredPlan] = useState<PlanId | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl p-6 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Escolha o Plano</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Defina as capacidades desta loja. Você pode mudar o plano depois nas configurações.
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.entries(PLANS) as [PlanId, typeof PLANS[PlanId]][]).map(([id, plan]) => {
            const isSelected = selected === id;
            const isHovered = hoveredPlan === id;

            return (
              <button
                key={id}
                className={`relative text-left rounded-xl border-2 p-5 flex flex-col gap-3 transition-all duration-200 focus:outline-none
                  ${plan.color}
                  ${isSelected ? "bg-primary/5 shadow-lg scale-[1.02]" : "bg-muted/20 hover:bg-muted/40"}
                `}
                onClick={() => { onSelect(id); onClose(); }}
                onMouseEnter={() => setHoveredPlan(id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Badge */}
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {plan.badge}
                  </span>
                )}

                {/* Icon + Check */}
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    {plan.icon}
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Name + Price */}
                <div>
                  <p className="font-bold text-base">{plan.name}</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">{plan.price}</p>
                  <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-1.5 mt-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-px" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Planos pagos serão integrados com Stripe em breve. Por ora selecione manualmente o plano desejado.
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StoresPage() {
  const { stores, activeStore, setActiveStore, fetchStores, loading } = useStore();
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreDomain, setNewStoreDomain] = useState("");
  const [newStorePlan, setNewStorePlan] = useState<PlanId>("free");
  const [isPending, setIsPending] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, []);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim() || !newStoreDomain.trim()) return;

    setIsPending(true);
    try {
      const res = await apiFetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newStoreName, allowedDomain: newStoreDomain, plan: newStorePlan }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewStoreName("");
        setNewStoreDomain("");
        setNewStorePlan("free");
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

  const selectedPlan = PLANS[newStorePlan];

  return (
    <div className="max-w-4xl mx-auto w-full py-10 px-4">
      {showPlanModal && (
        <PlanModal
          selected={newStorePlan}
          onSelect={setNewStorePlan}
          onClose={() => setShowPlanModal(false)}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Suas Lojas</h1>
        <p className="text-muted-foreground mt-2">
          Selecione a loja que deseja gerenciar ou crie uma nova para isolar seus produtos e vídeos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Card
            key={store.id}
            className={`cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden ${
              activeStore?.id === store.id ? "border-primary shadow-sm bg-primary/5" : ""
            }`}
            onClick={() => handleSelectStore(store)}
          >
            {activeStore?.id === store.id && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-1 rounded-bl-lg">
                <Check className="w-4 h-4" />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <StoreIcon className="w-5 h-5 text-secondary-foreground" />
                </div>
                {store.plan && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border
                    ${store.plan === "gold" ? "border-yellow-400/50 text-yellow-500 bg-yellow-500/10" :
                      store.plan === "ultra" ? "border-purple-400/50 text-purple-500 bg-purple-500/10" :
                      store.plan === "pro" ? "border-blue-400/50 text-blue-500 bg-blue-500/10" :
                      "border-border text-muted-foreground bg-muted/50"}`}>
                    {store.plan}
                  </span>
                )}
              </div>
              <CardTitle>{store.name}</CardTitle>
              <CardDescription className="line-clamp-1">
                {store.allowedDomain || "Sem domínio configurado"}
              </CardDescription>
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
                onChange={(e) => setNewStoreName(e.target.value)}
                disabled={isPending}
              />
              <Input
                placeholder="Domínio (ex: site.com.br) - Obrigatório"
                value={newStoreDomain}
                onChange={(e) => setNewStoreDomain(e.target.value)}
                disabled={isPending}
              />

              {/* Plan Selector Trigger */}
              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowPlanModal(true)}
                className={`flex items-center justify-between w-full rounded-lg border-2 px-4 py-3 transition-all hover:bg-muted/40 text-left focus:outline-none
                  ${selectedPlan.color}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                    {selectedPlan.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{selectedPlan.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedPlan.price}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">Trocar →</span>
              </button>

              <Button type="submit" disabled={isPending || !newStoreName.trim() || !newStoreDomain.trim()}>
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
