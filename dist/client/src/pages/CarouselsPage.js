import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Loader2, LayoutGrid, Package, Eye, EyeOff, Code2, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
function EmbedModal({ carousel, onClose }) {
    const [copied, setCopied] = useState(null);
    const origin = window.location.origin;
    const scriptTag = `<script src="${origin}/embed/carousel.js" async></script>`;
    const divTag = `<div data-vidshop-carousel="${carousel.id}"></div>`;
    const copy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4", onClick: onClose, children: _jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl p-6 flex flex-col gap-5", onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold", children: "C\u00F3digo de Embed" }), _jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: ["Carrossel: ", _jsx("strong", { children: carousel.name })] })] }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: onClose, children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0", children: "1" }), _jsx("p", { className: "text-sm font-semibold", children: "Adicione UMA VEZ no template global da loja" })] }), _jsxs("div", { className: "relative", children: [_jsx("pre", { className: "text-xs bg-muted/50 border border-border rounded-lg p-3 overflow-x-auto font-mono text-foreground", children: scriptTag }), _jsx(Button, { size: "icon", variant: "ghost", className: "absolute top-2 right-2 h-7 w-7", onClick: () => copy(scriptTag, "script"), children: copied === "script" ? _jsx(Check, { className: "w-3.5 h-3.5 text-green-500" }) : _jsx(Copy, { className: "w-3.5 h-3.5" }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0", children: "2" }), _jsx("p", { className: "text-sm font-semibold", children: "Coloque onde quiser exibir o carrossel" })] }), _jsxs("div", { className: "relative", children: [_jsx("pre", { className: "text-xs bg-muted/50 border border-border rounded-lg p-3 overflow-x-auto font-mono text-foreground", children: divTag }), _jsx(Button, { size: "icon", variant: "ghost", className: "absolute top-2 right-2 h-7 w-7", onClick: () => copy(divTag, "div"), children: copied === "div" ? _jsx(Check, { className: "w-3.5 h-3.5 text-green-500" }) : _jsx(Copy, { className: "w-3.5 h-3.5" }) })] })] }), _jsxs("p", { className: "text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/50", children: ["\uD83D\uDCA1 M\u00FAltiplos carrosseis na mesma loja? O ", _jsx("code", { className: "font-mono", children: "<script>" }), " \u00E9 adicionado apenas uma vez. Copie e cole quantos ", _jsx("code", { className: "font-mono", children: "<div>" }), " precisar, com IDs diferentes."] })] }) }));
}
export default function CarouselsPage() {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [embedTarget, setEmbedTarget] = useState(null);
    const navigate = useNavigate();
    const fetchCarousels = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/carousels", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok)
                setCarousels((await res.json()).carousels || []);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchCarousels(); }, []);
    const handleDelete = async (id) => {
        if (!window.confirm("Deseja excluir este carrossel?"))
            return;
        const token = localStorage.getItem("token");
        await fetch(`/api/carousels/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        setCarousels(prev => prev.filter(c => c.id !== id));
    };
    return (_jsxs("div", { className: "flex flex-col gap-6 max-w-6xl mx-auto w-full pb-10", children: [embedTarget && _jsx(EmbedModal, { carousel: embedTarget, onClose: () => setEmbedTarget(null) }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Carrosseis" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Gerencie cole\u00E7\u00F5es de v\u00EDdeos para exibi\u00E7\u00E3o em carrossel." })] }), _jsxs(Button, { onClick: () => navigate("/dashboard/carousels/new"), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Novo Carrossel"] })] }), loading ? (_jsx("div", { className: "flex items-center justify-center py-24", children: _jsx(Loader2, { className: "w-7 h-7 animate-spin text-muted-foreground" }) })) : carousels.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-xl bg-muted/10 text-center", children: [_jsx(LayoutGrid, { className: "w-12 h-12 text-muted-foreground opacity-25 mb-4" }), _jsx("h3", { className: "text-lg font-semibold", children: "Nenhum carrossel" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1 mb-6 max-w-xs", children: "Crie seu primeiro carrossel para organizar v\u00EDdeos e exibi-los em qualquer loja." }), _jsxs(Button, { onClick: () => navigate("/dashboard/carousels/new"), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), " Criar Carrossel"] })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: carousels.map(c => (_jsxs(Card, { className: "group border-border hover:shadow-md transition-all overflow-hidden", children: [_jsx("div", { className: "h-2 bg-gradient-to-r from-primary/70 to-primary/40" }), _jsxs(CardContent, { className: "p-5 flex flex-col gap-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-bold text-base truncate", children: c.name }), c.title && _jsx("p", { className: "text-sm text-muted-foreground truncate mt-0.5", children: c.title })] }), _jsxs(Badge, { variant: c.showProducts ? "default" : "secondary", className: "shrink-0 text-[10px] font-semibold py-0.5 px-2 flex items-center gap-1", children: [c.showProducts ? _jsx(Eye, { className: "w-3 h-3" }) : _jsx(EyeOff, { className: "w-3 h-3" }), c.showProducts ? "Com Produtos" : "Sem Produtos"] })] }), c.subtitle && (_jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 bg-muted/30 rounded-md px-3 py-2 border border-border/50", children: c.subtitle })), _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border/50 mt-auto", children: [_jsxs("span", { className: "text-[11px] text-muted-foreground flex items-center gap-1", children: [_jsx(Package, { className: "w-3 h-3" }), new Date(c.updatedAt).toLocaleDateString("pt-BR")] }), _jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500", onClick: () => setEmbedTarget(c), title: "C\u00F3digo de Embed", children: _jsx(Code2, { className: "w-3.5 h-3.5" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 hover:bg-primary/10 hover:text-primary", onClick: () => navigate(`/dashboard/carousels/edit/${c.id}`), title: "Editar", children: _jsx(Edit, { className: "w-3.5 h-3.5" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 hover:bg-destructive/10 hover:text-destructive", onClick: () => handleDelete(c.id), title: "Excluir", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] })] })] })] }, c.id))) }))] }));
}
