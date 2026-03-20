import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Plus, Search, X, Eye, EyeOff, GripVertical, Video, Code2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function CarouselEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id || id === "new";
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    // Form fields
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [titleColor, setTitleColor] = useState("#000000");
    const [subtitle, setSubtitle] = useState("");
    const [subtitleColor, setSubtitleColor] = useState("#666666");
    const [layout, setLayout] = useState("3d-card");
    const [showProducts, setShowProducts] = useState(true);
    // Slider specific settings
    const [previewTime, setPreviewTime] = useState(3);
    const [videoList, setVideoList] = useState([]);
    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    // Drag re-order
    const [dragIdx, setDragIdx] = useState(null);
    const [dragOver, setDragOver] = useState(null);
    useEffect(() => {
        if (isNew)
            return;
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/carousels/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) {
                    navigate("/dashboard/carousels");
                    return;
                }
                const data = await res.json();
                setName(data.carousel.name || "");
                setTitle(data.carousel.title || "");
                setTitleColor(data.carousel.titleColor || "#000000");
                setSubtitle(data.carousel.subtitle || "");
                setSubtitleColor(data.carousel.subtitleColor || "#666666");
                setLayout(data.carousel.layout || "3d-card");
                setShowProducts(data.carousel.showProducts ?? true);
                setPreviewTime(data.carousel.previewTime ?? 3);
                setVideoList((data.videos || []).map((v) => ({
                    videoId: v.videoId,
                    video: v.video
                })));
            }
            finally {
                setLoading(false);
            }
        };
        load();
    }, [id, isNew, navigate]);
    const handleSearch = async () => {
        setSearching(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/videos", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const all = (await res.json()).videos || [];
                const q = searchQuery.trim().toLowerCase();
                setSearchResults(q ? all.filter(v => v.title.toLowerCase().includes(q)) : all);
            }
        }
        finally {
            setSearching(false);
        }
    };
    const addVideo = (v) => {
        if (videoList.some(e => e.videoId === v.id))
            return;
        setVideoList(prev => [...prev, { videoId: v.id, video: v }]);
        setSearchResults([]);
        setSearchQuery("");
    };
    const removeVideo = (idx) => setVideoList(prev => prev.filter((_, i) => i !== idx));
    const handleDragStart = (idx) => setDragIdx(idx);
    const handleDragEnter = (idx) => setDragOver(idx);
    const handleDragEnd = () => {
        if (dragIdx !== null && dragOver !== null && dragIdx !== dragOver) {
            const next = [...videoList];
            const [moved] = next.splice(dragIdx, 1);
            next.splice(dragOver, 0, moved);
            setVideoList(next);
        }
        setDragIdx(null);
        setDragOver(null);
    };
    const handleSave = async () => {
        if (!name.trim()) {
            alert("O nome do carrossel é obrigatório.");
            return;
        }
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                name, title, subtitle, titleColor, subtitleColor, layout, showProducts,
                previewTime,
                videoIds: videoList.map(e => e.videoId)
            };
            if (isNew) {
                const createRes = await fetch("/api/carousels", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ name, title, subtitle, titleColor, subtitleColor, layout, showProducts, previewTime })
                });
                if (!createRes.ok)
                    throw new Error("Erro ao criar carrossel");
                const created = await createRes.json();
                await fetch(`/api/carousels/${created.carousel.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                navigate(`/dashboard/carousels/edit/${created.carousel.id}`, { replace: true });
            }
            else {
                const res = await fetch(`/api/carousels/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                if (!res.ok)
                    throw new Error("Erro ao salvar");
            }
        }
        catch (e) {
            alert(e.message);
        }
        finally {
            setSaving(false);
        }
    };
    if (loading)
        return (_jsx("div", { className: "flex h-full items-center justify-center p-24", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-muted-foreground" }) }));
    return (_jsxs("div", { className: "flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10", children: [_jsxs("div", { className: "flex items-center justify-between bg-card border border-border rounded-xl px-5 py-3 shadow-sm sticky top-0 z-40", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("/dashboard/carousels"), children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-base font-bold line-clamp-1", children: name || (isNew ? "Novo Carrossel" : "Editar Carrossel") }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [videoList.length, " v\u00EDdeo", videoList.length !== 1 ? "s" : "", " \u00B7 ", showProducts ? "Com Produtos" : "Sem Produtos"] })] })] }), _jsxs(Button, { onClick: handleSave, disabled: saving, className: "bg-primary hover:bg-primary/90", children: [saving ? _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : _jsx(Save, { className: "w-4 h-4 mr-2" }), "Salvar"] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [_jsx("div", { className: "lg:col-span-5 flex flex-col gap-5", children: _jsxs(Card, { className: "border-border", children: [_jsx(CardHeader, { className: "pb-4 border-b border-border/50", children: _jsx(CardTitle, { className: "text-xs font-bold uppercase text-muted-foreground tracking-widest", children: "Informa\u00E7\u00F5es" }) }), _jsxs(CardContent, { className: "p-5 space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "text-xs font-semibold uppercase text-muted-foreground block mb-1.5", children: ["Nome Interno ", _jsx("span", { className: "text-destructive", children: "*" })] }), _jsx("input", { type: "text", placeholder: "Ex: Lan\u00E7amentos Junho", className: "flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", value: name, onChange: e => setName(e.target.value) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "text-xs font-semibold uppercase text-muted-foreground block mb-1.5", children: "T\u00EDtulo P\u00FAblico" }), _jsx("input", { type: "text", placeholder: "Ex: V\u00EDdeos em Destaque", className: "flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", value: title, onChange: e => setTitle(e.target.value) })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-xs font-semibold uppercase text-muted-foreground block mb-1.5", children: ["Cor (", _jsx("span", { className: "font-mono", children: titleColor }), ")"] }), _jsx("input", { type: "color", className: "h-10 w-24 rounded-md border border-input bg-background p-1 cursor-pointer", value: titleColor, onChange: e => setTitleColor(e.target.value) })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "text-xs font-semibold uppercase text-muted-foreground block mb-1.5", children: "Subt\u00EDtulo" }), _jsx("textarea", { placeholder: "Subt\u00EDtulo curto do carrossel...", className: "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none", value: subtitle, onChange: e => setSubtitle(e.target.value) })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-xs font-semibold uppercase text-muted-foreground block mb-1.5", children: ["Cor (", _jsx("span", { className: "font-mono", children: subtitleColor }), ")"] }), _jsx("input", { type: "color", className: "h-10 w-24 rounded-md border border-input bg-background p-1 cursor-pointer", value: subtitleColor, onChange: e => setSubtitleColor(e.target.value) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold uppercase text-muted-foreground block mb-1.5", children: "Modelo do Carrossel" }), _jsxs("select", { className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50", value: layout, onChange: e => setLayout(e.target.value), children: [_jsx("option", { value: "3d-card", children: "Cart\u00E3o 3D" }), _jsx("option", { value: "slider", children: "Slider Simples" }), _jsx("option", { value: "stories", disabled: true, children: "Stories (Em Breve)" })] })] }), _jsxs("button", { type: "button", onClick: () => setShowProducts(!showProducts), className: `w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${showProducts ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/20'}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [showProducts
                                                            ? _jsx(Eye, { className: "w-5 h-5 text-primary" })
                                                            : _jsx(EyeOff, { className: "w-5 h-5 text-muted-foreground" }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-sm font-semibold", children: showProducts ? "Mostrar Produtos" : "Ocultar Produtos" }), _jsx("p", { className: "text-xs text-muted-foreground", children: showProducts ? "Exibe os cards sobre o vídeo" : "Oculta links de compra" })] })] }), _jsx("div", { className: `w-11 h-6 rounded-full transition-colors shrink-0 relative ${showProducts ? 'bg-primary' : 'bg-muted'}`, children: _jsx("div", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${showProducts ? 'translate-x-5' : 'translate-x-0.5'}` }) })] }), layout === "slider" && (_jsxs("div", { className: "space-y-4 pt-4 border-t border-border", children: [_jsx("h3", { className: "text-xs font-bold uppercase text-muted-foreground", children: "Configura\u00E7\u00F5es do Slider" }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold uppercase text-muted-foreground block mb-1.5", children: "Tempo de Preview (Segundos)" }), _jsx("select", { className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring", value: previewTime, onChange: e => setPreviewTime(Number(e.target.value)), children: [3, 4, 5, 6, 7, 8].map(num => (_jsxs("option", { value: num, children: [num, " Segundos"] }, num))) }), _jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Tempo de reprodu\u00E7\u00E3o do v\u00EDdeo antes de dar auto-play no pr\u00F3ximo (3 a 8 seg)." })] })] }))] })] }) }), _jsx("div", { className: "lg:col-span-7 flex flex-col gap-5", children: _jsxs(Card, { className: "border-border flex flex-col overflow-hidden", children: [_jsx(CardHeader, { className: "pb-4 border-b border-border/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "text-xs font-bold uppercase text-muted-foreground tracking-widest", children: ["V\u00EDdeos (", videoList.length, ")"] }), videoList.length > 1 && (_jsxs("p", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [_jsx(GripVertical, { className: "w-3 h-3" }), " Arraste para reordenar"] }))] }) }), _jsxs("div", { className: "p-4 border-b border-border/50 bg-muted/10", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Buscar v\u00EDdeo pelo t\u00EDtulo...", className: "flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", value: searchQuery, onChange: e => setSearchQuery(e.target.value), onKeyDown: e => e.key === 'Enter' && handleSearch() })] }), _jsx(Button, { size: "sm", variant: "secondary", onClick: handleSearch, disabled: searching, children: searching ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : "Buscar" })] }), searchResults.length > 0 && (_jsx("div", { className: "mt-2 border border-border rounded-lg overflow-hidden bg-background shadow-lg max-h-[220px] overflow-y-auto", children: searchResults.map(v => (_jsxs("button", { className: "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 border-b border-border/40 last:border-0 text-left transition-colors", onClick: () => addVideo(v), children: [_jsx("div", { className: "w-14 h-9 bg-black rounded overflow-hidden shrink-0 border border-border", children: _jsx("video", { src: v.mediaUrl, className: "w-full h-full object-cover opacity-80", preload: "metadata", muted: true }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs font-semibold truncate", children: v.title }), v.description && _jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: v.description })] }), _jsx(Plus, { className: "w-4 h-4 text-primary shrink-0" })] }, v.id))) }))] }), _jsx("div", { className: "flex-1 overflow-y-auto max-h-[420px]", children: videoList.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center p-12 text-center text-muted-foreground", children: [_jsx(Video, { className: "w-8 h-8 opacity-20 mb-3" }), _jsx("p", { className: "text-sm", children: "Nenhum v\u00EDdeo adicionado ainda." }), _jsx("p", { className: "text-xs mt-1", children: "Use a busca acima para encontrar seus v\u00EDdeos cadastrados." })] })) : (_jsx("div", { className: "divide-y divide-border", children: videoList.map((entry, idx) => (_jsxs("div", { draggable: true, onDragStart: () => handleDragStart(idx), onDragEnter: () => handleDragEnter(idx), onDragEnd: handleDragEnd, onDragOver: e => e.preventDefault(), className: `flex items-center gap-3 px-4 py-3 group cursor-grab active:cursor-grabbing transition-all
                        ${dragOver === idx && dragIdx !== idx ? 'bg-primary/10 border-t-2 border-primary' : 'hover:bg-muted/30'}`, children: [_jsx(GripVertical, { className: "w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground shrink-0" }), _jsx("span", { className: "text-xs font-mono text-muted-foreground/50 w-5 shrink-0", children: idx + 1 }), _jsx("div", { className: "w-16 h-10 bg-black rounded border border-border overflow-hidden shrink-0", children: entry.video?.mediaUrl && (_jsx("video", { src: entry.video.mediaUrl, className: "w-full h-full object-cover opacity-80", preload: "metadata", muted: true })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold truncate", children: entry.video?.title ?? `Vídeo #${entry.videoId}` }), entry.video?.description && (_jsx("p", { className: "text-xs text-muted-foreground truncate", children: entry.video.description }))] }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity", onClick: () => removeVideo(idx), children: _jsx(X, { className: "w-4 h-4" }) })] }, `${entry.videoId}-${idx}`))) })) })] }) })] }), !isNew && (_jsx(EmbedSection, { id: id }))] }));
}
function EmbedSection({ id }) {
    const [copied, setCopied] = useState(null);
    const origin = window.location.origin;
    const scriptTag = `<script src="${origin}/embed/carousel.js" async></script>`;
    const divTag = `<div data-vidshop-carousel="${id}"></div>`;
    const copy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };
    return (_jsxs(Card, { className: "border-border", children: [_jsxs(CardHeader, { className: "pb-4 border-b border-border/50 flex flex-row items-center gap-2", children: [_jsx(Code2, { className: "w-4 h-4 text-muted-foreground" }), _jsx(CardTitle, { className: "text-xs font-bold uppercase text-muted-foreground tracking-widest", children: "Integra\u00E7\u00E3o \u2014 C\u00F3digo de Embed" })] }), _jsxs(CardContent, { className: "p-5 grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0", children: "1" }), _jsx("p", { className: "text-sm font-semibold", children: "Adicione UMA VEZ no template da loja" })] }), _jsxs("div", { className: "relative", children: [_jsx("pre", { className: "text-[11px] bg-muted/40 border border-border rounded-lg p-3 overflow-x-auto font-mono text-foreground whitespace-pre-wrap break-all", children: scriptTag }), _jsx(Button, { size: "icon", variant: "ghost", className: "absolute top-2 right-2 h-7 w-7", onClick: () => copy(scriptTag, "script"), children: copied === "script" ? _jsx(Check, { className: "w-3.5 h-3.5 text-green-500" }) : _jsx(Copy, { className: "w-3.5 h-3.5" }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0", children: "2" }), _jsx("p", { className: "text-sm font-semibold", children: "Cole onde quiser exibir o carrossel" })] }), _jsxs("div", { className: "relative", children: [_jsx("pre", { className: "text-[11px] bg-muted/40 border border-border rounded-lg p-3 overflow-x-auto font-mono text-foreground", children: divTag }), _jsx(Button, { size: "icon", variant: "ghost", className: "absolute top-2 right-2 h-7 w-7", onClick: () => copy(divTag, "div"), children: copied === "div" ? _jsx(Check, { className: "w-3.5 h-3.5 text-green-500" }) : _jsx(Copy, { className: "w-3.5 h-3.5" }) })] })] })] })] }));
}
