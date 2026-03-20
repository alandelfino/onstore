import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart3, ShoppingCart, Users, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const kpis = [
    { label: "Receita Total", value: "R$ 48.291", change: "+12,5%", up: true, icon: BarChart3 },
    { label: "Pedidos", value: "1.284", change: "+8,2%", up: true, icon: ShoppingCart },
    { label: "Clientes Ativos", value: "3.842", change: "+4,1%", up: true, icon: Users },
    { label: "Taxa de Conversão", value: "3,64%", change: "-0,3%", up: false, icon: TrendingUp },
];
const recentOrders = [
    { id: "#4521", customer: "Ana Lima", product: "Tênis Casual", value: "R$ 289,90", status: "Entregue" },
    { id: "#4520", customer: "Bruno Souza", product: "Camiseta Polo", value: "R$ 119,90", status: "Enviado" },
    { id: "#4519", customer: "Carla Rocha", product: "Calça Slim", value: "R$ 199,90", status: "Processando" },
    { id: "#4518", customer: "Daniel Melo", product: "Jaqueta Jeans", value: "R$ 349,90", status: "Entregue" },
    { id: "#4517", customer: "Erica Torres", product: "Vestido Floral", value: "R$ 229,90", status: "Cancelado" },
];
const statusVariant = {
    Entregue: "default",
    Enviado: "outline",
    Processando: "secondary",
    Cancelado: "destructive",
};
function getInitials(name) {
    return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}
export default function DashboardHome() {
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: kpis.map((kpi) => (_jsx(Card, { className: "border border-border", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs font-medium text-muted-foreground", children: kpi.label }), _jsx("p", { className: "text-2xl font-bold tracking-tight text-foreground mt-1", children: kpi.value }), _jsxs("div", { className: "flex items-center gap-1 mt-1", children: [kpi.up ? _jsx(TrendingUp, { className: "w-3 h-3 text-primary" }) : _jsx(TrendingDown, { className: "w-3 h-3 text-destructive" }), _jsx("span", { className: cn("text-xs font-medium", kpi.up ? "text-primary" : "text-destructive"), children: kpi.change }), _jsx("span", { className: "text-xs text-muted-foreground", children: "vs. m\u00EAs anterior" })] })] }), _jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: _jsx(kpi.icon, { className: "w-4 h-4 text-primary" }) })] }) }) }, kpi.label))) }), _jsxs(Card, { className: "border border-border", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-base", children: "Pedidos Recentes" }), _jsx(CardDescription, { children: "\u00DAltimas 5 transa\u00E7\u00F5es da loja" })] }), _jsx(Button, { variant: "outline", size: "sm", children: "Ver todos" })] }) }), _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "border-t border-border bg-muted/50", children: ["Pedido", "Cliente", "Produto", "Valor", "Status"].map((h, i) => (_jsx("th", { className: cn("text-left text-xs font-semibold text-muted-foreground px-6 py-3 uppercase tracking-wider", i >= 2 && "hidden md:table-cell", i >= 3 && "text-right"), children: h }, h))) }) }), _jsx("tbody", { className: "divide-y divide-border", children: recentOrders.map((order) => (_jsxs("tr", { className: "hover:bg-muted/30 transition-colors duration-150", children: [_jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "font-mono text-xs font-medium text-foreground", children: order.id }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Avatar, { fallback: getInitials(order.customer), size: "sm" }), _jsx("span", { className: "text-sm text-foreground font-medium whitespace-nowrap", children: order.customer })] }) }), _jsx("td", { className: "px-6 py-4 hidden md:table-cell", children: _jsx("span", { className: "text-sm text-muted-foreground", children: order.product }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("span", { className: "text-sm font-medium text-foreground whitespace-nowrap", children: order.value }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx(Badge, { variant: statusVariant[order.status], children: order.status }) })] }, order.id))) })] }) }) })] })] }));
}
