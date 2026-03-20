import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Loader2, Plus, Edit, Trash2, Video, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
export default function VideosPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const fetchVideos = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/videos", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setVideos(data.videos || []);
            }
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchVideos();
    }, []);
    const handleDelete = async (id) => {
        if (!window.confirm("Certeza que deseja excluir este vídeo interactivo?"))
            return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`/api/videos/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            setVideos(prev => prev.filter(v => v.id !== id));
        }
        catch {
            alert("Erro ao excluir vídeo.");
        }
    };
    const filtered = videos.filter(v => v.title.toLowerCase().includes(search.toLowerCase()));
    return (_jsxs("div", { className: "flex flex-col gap-6 h-full max-w-7xl mx-auto w-full pb-10", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "V\u00EDdeos Interativos" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Gerencie seus v\u00EDdeos \"Shoppable\" amarrados com produtos reais." })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "relative w-full sm:w-64", children: [_jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx("input", { type: "search", placeholder: "Buscar v\u00EDdeos...", className: "flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", value: search, onChange: (e) => setSearch(e.target.value) })] }), _jsxs(Button, { onClick: () => navigate("/dashboard/videos/new"), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Novo V\u00EDdeo"] })] })] }), loading ? (_jsxs("div", { className: "flex flex-col items-center justify-center p-24 text-muted-foreground", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin" }), _jsx("p", { className: "mt-4 text-sm font-medium", children: "Carregando seus v\u00EDdeos..." })] })) : videos.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center p-24 text-center border border-dashed rounded-xl border-border bg-muted/10", children: [_jsx(Video, { className: "w-12 h-12 text-muted-foreground opacity-30 mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Nenhum v\u00EDdeo" }), _jsx("p", { className: "text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-6", children: "Voc\u00EA ainda n\u00E3o enviou nenhum v\u00EDdeo com produtos relacionados. Crie seu primeiro Shoppable Video apertando abaixo." }), _jsxs(Button, { onClick: () => navigate("/dashboard/videos/new"), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Criar Primeiro V\u00EDdeo"] })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filtered.map(video => (_jsxs(Card, { className: "overflow-hidden group flex flex-col hover:shadow-md transition-all border-border bg-card", children: [_jsxs("div", { className: "relative aspect-video bg-black overflow-hidden pointer-events-none", children: [_jsx("video", { src: video.mediaUrl, className: "w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity", preload: "metadata", poster: video.thumbnailUrl || undefined, muted: true, loop: true, onMouseEnter: e => e.target.play().catch(() => { }), onMouseLeave: e => {
                                        const target = e.target;
                                        target.pause();
                                        target.currentTime = 0;
                                    } }), _jsx("div", { className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-3 pt-8 pb-3 text-white transition-transform duration-300", children: _jsx("p", { className: "font-semibold text-sm line-clamp-1", children: video.title }) })] }), _jsxs("div", { className: "p-4 flex-1 flex flex-col pb-4", children: [_jsx("p", { className: "text-xs text-muted-foreground mb-3 flex-1 line-clamp-2", children: video.description || "Sem descrição." }), _jsxs("div", { className: "flex items-center justify-between mt-auto pt-3 border-t border-border", children: [_jsx("span", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider", children: new Date(video.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' }) }), _jsxs("div", { className: "flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity", children: [_jsx(Button, { variant: "secondary", size: "icon", className: "h-8 w-8 hover:bg-primary hover:text-primary-foreground", onClick: () => navigate(`/dashboard/videos/edit/${video.id}`), title: "Editar Timeline", children: _jsx(Edit, { className: "w-3.5 h-3.5" }) }), _jsx(Button, { variant: "secondary", size: "icon", className: "h-8 w-8 hover:bg-destructive hover:text-destructive-foreground", onClick: () => handleDelete(video.id), title: "Excluir", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] })] })] })] }, video.id))) }))] }));
}
