import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Eye, CalendarDays, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useStore } from "../context/StoreContext";
import { cn } from "@/lib/utils";

// ─── date helpers ─────────────────────────────────────────────────────────────

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateBR(iso: string): string {
  const [y, m, day] = iso.split("-");
  return `${day}/${m}`;
}

function formatDateFull(iso: string): string {
  const [y, m, day] = iso.split("-");
  return `${day}/${m}/${y}`;
}

// Fill in missing days between from→to with count 0
function fillDays(data: { date: string; views: number }[], from: string, to: string) {
  const map = new Map(data.map(r => [r.date, r.views]));
  const result: { date: string; views: number }[] = [];
  let cursor = new Date(from + "T00:00:00Z");
  const end = new Date(to + "T00:00:00Z");
  while (cursor <= end) {
    const iso = cursor.toISOString().slice(0, 10);
    result.push({ date: iso, views: map.get(iso) ?? 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return result;
}

// ─── Preset options ───────────────────────────────────────────────────────────

const t = today();
const presets = [
  {
    label: "Últimos 7 dias",
    from: toISO(addDays(t, -6)),
    to: toISO(t),
  },
  {
    label: "Últimos 15 dias",
    from: toISO(addDays(t, -14)),
    to: toISO(t),
  },
  {
    label: "Últimos 30 dias",
    from: toISO(addDays(t, -29)),
    to: toISO(t),
  },
  {
    label: "Este mês",
    from: toISO(new Date(t.getFullYear(), t.getMonth(), 1)),
    to: toISO(t),
  },
  {
    label: "Mês passado",
    from: toISO(new Date(t.getFullYear(), t.getMonth() - 1, 1)),
    to: toISO(new Date(t.getFullYear(), t.getMonth(), 0)),
  },
] as const;

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="text-muted-foreground mb-1">{formatDateFull(label)}</p>
      <p className="font-bold text-foreground text-base">
        {payload[0].value.toLocaleString("pt-BR")}{" "}
        <span className="text-xs font-normal text-muted-foreground">views</span>
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardHome() {
  const { activeStore } = useStore();

  const [from, setFrom] = useState(presets[0].from);
  const [to, setTo] = useState(presets[0].to);
  const [activePreset, setActivePreset] = useState<string>("Últimos 7 dias");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [chartData, setChartData] = useState<{ date: string; views: number }[]>([]);

  const fetchData = useCallback(async (f: string, t: string) => {
    if (!activeStore) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/api/analytics/views?from=${f}&to=${t}`);
      if (res.ok) {
        const data = await res.json();
        setTotal(data.total);
        setChartData(fillDays(data.byDay, f, t));
      }
    } finally {
      setLoading(false);
    }
  }, [activeStore]);

  useEffect(() => {
    fetchData(from, to);
  }, [activeStore]);

  const applyPreset = (p: typeof presets[number]) => {
    setFrom(p.from);
    setTo(p.to);
    setActivePreset(p.label);
    fetchData(p.from, p.to);
  };

  const handleApplyCustom = () => {
    if (from > to) return;
    setActivePreset("");
    fetchData(from, to);
  };

  // Days difference for display
  const daysDiff = Math.round(
    (new Date(to).getTime() - new Date(from).getTime()) / 86400000
  ) + 1;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visualizações dos carrosseis da loja{activeStore ? ` "${activeStore.name}"` : ""}.
        </p>
      </div>

      {/* Date controls */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                    activePreset === p.label
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom date range */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> De
                </label>
                <input
                  type="date"
                  value={from}
                  max={to}
                  onChange={e => { setFrom(e.target.value); setActivePreset(""); }}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> Até
                </label>
                <input
                  type="date"
                  value={to}
                  min={from}
                  max={toISO(today())}
                  onChange={e => { setTo(e.target.value); setActivePreset(""); }}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button
                size="sm"
                onClick={handleApplyCustom}
                disabled={loading || from > to || activePreset !== ""}
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Aplicar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total views KPI */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total de Visualizações</p>
              <p className="text-sm text-muted-foreground">{activePreset || `${formatDateFull(from)} → ${formatDateFull(to)}`} · {daysDiff} dias</p>
              {loading ? (
                <div className="flex items-center gap-2 mt-1">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Carregando...</span>
                </div>
              ) : (
                <p className="text-4xl font-bold tracking-tight text-foreground mt-0.5">
                  {total.toLocaleString("pt-BR")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Visualizações por Dia</CardTitle>
          </div>
          <CardDescription>
            Total diário de carregamentos dos carrosseis no período selecionado.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 pb-4">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center gap-2">
              <Eye className="w-10 h-10 text-muted-foreground opacity-25" />
              <p className="text-sm text-muted-foreground">Nenhuma visualização no período.</p>
              <p className="text-xs text-muted-foreground">As views aparecerão aqui conforme seus carrosseis são acessados.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateBR}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fill="url(#viewsGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
