import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Upload, Save, ArrowLeft, Plus, Search, Trash2, X, GripVertical, GripHorizontal, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function VideoEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [mediaUrl, setMediaUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [title, setTitle] = useState("Novo Vídeo Interativo");
    const [description, setDescription] = useState("");
    const [timeline, setTimeline] = useState([]);
    const videoRef = useRef(null);
    const trackRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(null);
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    // Drag and Drop State
    const [dragState, setDragState] = useState(null);
    useEffect(() => {
        if (isNew)
            return;
        const fetchVideo = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/videos/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMediaUrl(data.video.mediaUrl || "");
                    setThumbnailUrl(data.video.thumbnailUrl || "");
                    setTitle(data.video.title || "");
                    setDescription(data.video.description || "");
                    setTimeline(data.videoProducts || []);
                }
                else {
                    alert("Vídeo não encontrado.");
                    navigate("/dashboard/videos");
                }
            }
            finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id, navigate, isNew]);
    useEffect(() => {
        const video = videoRef.current;
        if (!video)
            return;
        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handleLoadedMeta = () => setDuration(video.duration);
        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMeta);
        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMeta);
        };
    }, [mediaUrl]);
    // Pointer Drag Effects
    useEffect(() => {
        if (!dragState)
            return;
        const handlePointerMove = (e) => {
            e.preventDefault();
            if (!trackRef.current)
                return;
            const trackWidth = trackRef.current.getBoundingClientRect().width || 1;
            const deltaX = e.clientX - dragState.startX;
            const deltaTime = (deltaX / trackWidth) * duration;
            setTimeline(prev => {
                const next = [...prev];
                const item = { ...next[dragState.index] };
                const minDuration = 1;
                if (dragState.mode === 'move') {
                    const itemDuration = dragState.initEnd - dragState.initStart;
                    let newStart = dragState.initStart + deltaTime;
                    if (newStart < dragState.minStart)
                        newStart = dragState.minStart;
                    if (newStart + itemDuration > dragState.maxEnd)
                        newStart = dragState.maxEnd - itemDuration;
                    item.startTime = newStart;
                    item.endTime = newStart + itemDuration;
                }
                else if (dragState.mode === 'resize-start') {
                    let newStart = dragState.initStart + deltaTime;
                    if (newStart < dragState.minStart)
                        newStart = dragState.minStart;
                    if (newStart > item.endTime - minDuration)
                        newStart = item.endTime - minDuration;
                    item.startTime = newStart;
                }
                else if (dragState.mode === 'resize-end') {
                    let newEnd = dragState.initEnd + deltaTime;
                    if (newEnd > dragState.maxEnd)
                        newEnd = dragState.maxEnd;
                    if (newEnd < item.startTime + minDuration)
                        newEnd = item.startTime + minDuration;
                    item.endTime = newEnd;
                }
                next[dragState.index] = item;
                return next;
            });
        };
        const handlePointerUp = () => setDragState(null);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [dragState, duration]);
    const handlePointerDown = (e, index, mode) => {
        e.stopPropagation();
        e.preventDefault();
        if (!trackRef.current)
            return;
        const sorted = [...timeline].sort((a, b) => a.startTime - b.startTime);
        // Find absolute bounds for the item based on its neighbors
        // Note: timeline array might not be sorted during the drag itself, but we sort it initially before drag
        const realIdx = sorted.findIndex(t => t === timeline[index]);
        const prev = sorted[realIdx - 1];
        const next = sorted[realIdx + 1];
        const minStart = prev ? prev.endTime : 0;
        const maxEnd = next ? next.startTime : duration;
        setDragState({
            index,
            mode,
            startX: e.clientX,
            initStart: timeline[index].startTime,
            initEnd: timeline[index].endTime,
            minStart,
            maxEnd
        });
        setSelectedTimelineIndex(index);
        setIsAddingMode(false);
    };
    const handleTrackClick = (e) => {
        if (dragState)
            return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        let time = (clickX / rect.width) * duration;
        if (time < 0)
            time = 0;
        if (time > duration)
            time = duration;
        if (videoRef.current)
            videoRef.current.currentTime = time;
        setSelectedTimelineIndex(null);
        setIsAddingMode(false);
    };
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };
    const hasOverlap = (start, end, ignoreIdx = -1) => {
        return timeline.some((item, idx) => {
            if (idx === ignoreIdx)
                return false;
            return start < item.endTime && end > item.startTime;
        });
    };
    const handleUploadNew = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const token = localStorage.getItem("token");
            const uploadRes = await fetch("/api/media/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!uploadRes.ok)
                throw new Error("Erro no upload do vídeo");
            const uploadData = await uploadRes.json();
            const videoRes = await fetch("/api/videos", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title: file.name, mediaUrl: uploadData.media.url, description: "" })
            });
            if (!videoRes.ok)
                throw new Error("Erro ao criar registro");
            const videoData = await videoRes.json();
            navigate(`/dashboard/videos/edit/${videoData.video.id}`, { replace: true });
        }
        catch (err) {
            alert(err.message);
            setLoading(false);
        }
    };
    const handleUploadThumbnail = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const token = localStorage.getItem("token");
            const uploadRes = await fetch("/api/media/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!uploadRes.ok)
                throw new Error("Erro no upload da capa");
            const uploadData = await uploadRes.json();
            setThumbnailUrl(uploadData.media.url);
        }
        catch (err) {
            alert(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSearchProduct = async () => {
        if (!searchQuery.trim())
            return;
        setSearching(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setSearchResults((await res.json()).products || []);
            }
        }
        finally {
            setSearching(false);
        }
    };
    const commitAddProduct = () => {
        if (!selectedProduct)
            return;
        let start = Math.floor(videoRef.current?.currentTime || 0);
        let end = start + 5;
        if (duration > 0 && end > duration)
            end = Math.floor(duration);
        if (hasOverlap(start, Math.min(start + 1, end))) {
            // Search for next available gap
            let foundGap = false;
            const sorted = [...timeline].sort((a, b) => a.startTime - b.startTime);
            for (let i = 0; i < sorted.length; i++) {
                const gapEnd = sorted[i + 1] ? sorted[i + 1].startTime : duration;
                if (gapEnd - sorted[i].endTime >= 3) {
                    start = sorted[i].endTime;
                    end = Math.min(start + 5, gapEnd);
                    foundGap = true;
                    break;
                }
            }
            if (!foundGap) {
                if (sorted[0].startTime >= 3) {
                    start = 0;
                    end = Math.min(3, sorted[0].startTime);
                    foundGap = true;
                }
                else {
                    alert("Não há espaço livre de pelo menos 3s na timeline. Arraste outros produtos e tente de novo.");
                    return;
                }
            }
        }
        else {
            // clamp 
            const nextItem = timeline.find(t => t.startTime > start);
            if (nextItem && nextItem.startTime < end)
                end = nextItem.startTime;
        }
        const newItems = [...timeline, {
                productId: selectedProduct.id,
                product: selectedProduct,
                startTime: start,
                endTime: end
            }].sort((a, b) => a.startTime - b.startTime);
        setTimeline(newItems);
        setSelectedTimelineIndex(newItems.findIndex(t => t.productId === selectedProduct.id && t.startTime === start));
        setIsAddingMode(false);
        setSelectedProduct(null);
        setSearchQuery("");
    };
    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/videos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    title, description, mediaUrl, thumbnailUrl, productsList: timeline.map(t => ({ productId: t.productId, startTime: t.startTime, endTime: t.endTime }))
                })
            });
            if (res.ok)
                alert("Vídeo e timeline salvos com sucesso!");
        }
        finally {
            setSaving(false);
        }
    };
    if (loading)
        return _jsx("div", { className: "flex h-full items-center justify-center p-24 text-muted-foreground", children: _jsx(Loader2, { className: "animate-spin" }) });
    if (id === "new" || !id) {
        return (_jsxs("div", { className: "flex flex-col gap-6 h-full max-w-3xl mx-auto w-full pt-10", children: [_jsxs(Button, { variant: "ghost", className: "w-fit", onClick: () => navigate("/dashboard/videos"), children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), " Voltar a V\u00EDdeos"] }), _jsxs("div", { className: "bg-card rounded-xl border border-border shadow-md overflow-hidden", children: [_jsxs("div", { className: "px-6 pt-6 pb-4 border-b border-border", children: [_jsx("h2", { className: "text-xl font-bold", children: "Criar Novo Shoppable Video" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Envie o v\u00EDdeo matriz para come\u00E7armos a edi\u00E7\u00E3o na timeline." })] }), _jsx("div", { className: "p-6", children: _jsxs("label", { className: "flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-16 bg-muted/10 hover:bg-muted/20 cursor-pointer transition-colors group", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors", children: _jsx(Upload, { className: "w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" }) }), _jsx("p", { className: "text-base font-semibold text-foreground", children: "Clique para escolher o v\u00EDdeo" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Formatos suportados: .mp4, .mov, .webm" }), _jsx("input", { type: "file", accept: "video/*", className: "hidden", onChange: handleUploadNew })] }) })] })] }));
    }
    return (_jsxs("div", { className: "flex flex-col gap-5 h-full max-w-[1400px] mx-auto w-full pb-8", children: [_jsxs("div", { className: "flex items-center justify-between bg-card p-4 rounded-xl border border-border sticky top-0 z-50 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("/dashboard/videos"), children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsxs("h1", { className: "text-lg font-bold text-foreground line-clamp-1", children: ["NLE Studio \u2022 ", title] }), _jsxs("p", { className: "text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center", children: [_jsx(Video, { className: "w-3 h-3 mr-1" }), " Timeline Editor Pro"] })] })] }), _jsxs(Button, { onClick: handleSave, disabled: saving, className: "bg-primary hover:bg-primary/90", children: [saving ? _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : _jsx(Save, { className: "w-4 h-4 mr-2" }), " Salvar Altera\u00E7\u00F5es"] })] }), _jsxs("div", { className: "flex flex-col gap-5 flex-1 min-h-0", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-5", children: [_jsx("div", { className: "lg:col-span-8 bg-black/90 aspect-video rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center border border-border/50", children: _jsx("video", { ref: videoRef, src: mediaUrl, poster: thumbnailUrl || undefined, className: "w-full h-full object-contain", controls: true, controlsList: "nodownload" }) }), _jsx("div", { className: "lg:col-span-4 flex flex-col", children: _jsxs(Card, { className: "border-border flex-1 flex flex-col", children: [_jsx(CardHeader, { className: "py-3 px-4 border-b border-border/50 shrink-0", children: _jsx(CardTitle, { className: "text-sm", children: "Configura\u00E7\u00F5es" }) }), _jsxs(CardContent, { className: "space-y-4 p-5 flex-1 flex flex-col", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "T\u00EDtulo" }), _jsx("input", { className: "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary shadow-sm", value: title, onChange: e => setTitle(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Capa (Thumbnail)" }), _jsxs("div", { className: "flex items-center gap-3", children: [thumbnailUrl && _jsx("img", { src: thumbnailUrl, className: "w-10 h-10 object-cover rounded-md border border-border shrink-0" }), _jsxs("label", { className: "flex h-10 items-center justify-center rounded-md border border-input bg-secondary hover:bg-secondary/80 px-4 py-2 text-sm font-medium cursor-pointer transition-colors w-full", children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), "Escolher Imagem", _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleUploadThumbnail })] })] })] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Descri\u00E7\u00E3o" }), _jsx("textarea", { className: "flex flex-1 min-h-[120px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary resize-none shadow-sm", value: description, onChange: e => setDescription(e.target.value) })] })] })] }) })] }), _jsx("div", { className: "flex-1 flex flex-col min-w-0", children: _jsxs("div", { className: "bg-card rounded-xl border border-border flex flex-col grow shadow-sm overflow-hidden", children: [_jsxs("div", { className: "px-5 py-3 border-b border-border flex items-center justify-between", children: [_jsxs("h3", { className: "font-semibold text-sm flex items-center", children: [_jsx(GripHorizontal, { className: "w-4 h-4 mr-2 text-muted-foreground" }), " Timeline de Produtos"] }), _jsxs("div", { className: "text-xs bg-muted/80 px-2 py-1 rounded font-mono font-medium shadow-inner tracking-widest text-primary", children: [formatTime(currentTime), " / ", formatTime(duration)] })] }), _jsxs("div", { className: "p-6 bg-muted/10 shrink-0 border-b border-border select-none", children: [_jsxs("div", { className: "flex justify-between text-[10px] text-muted-foreground font-mono mb-1.5 px-0.5 opacity-60", children: [_jsx("span", { children: "00:00" }), _jsx("span", { children: formatTime(duration) })] }), _jsxs("div", { ref: trackRef, className: "relative h-[100px] bg-background border border-border rounded-lg overflow-hidden cursor-text shadow-inner", onPointerDown: handleTrackClick, children: [_jsx("div", { className: "absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px)] bg-[size:10%] pointer-events-none" }), _jsx("div", { className: "absolute top-0 bottom-0 w-[1px] bg-red-500 z-30 pointer-events-none", style: { left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }, children: _jsx("div", { className: "absolute -top-[2px] -left-[4px] w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-transparent border-t-red-500" }) }), timeline.map((item, idx) => {
                                                    const left = duration > 0 ? (item.startTime / duration) * 100 : 0;
                                                    const width = duration > 0 ? ((item.endTime - item.startTime) / duration) * 100 : 0;
                                                    const isSelected = selectedTimelineIndex === idx;
                                                    return (_jsxs("div", { className: `absolute top-2 bottom-2 rounded-md transition-shadow group flex items-center overflow-hidden
                           ${isSelected ? 'bg-primary/20 ring-1 ring-primary shadow-[0_0_12px_rgba(59,130,246,0.2)] z-20' : 'bg-card ring-1 ring-border shadow-sm hover:ring-primary/50 hover:bg-muted/40 z-10'}
                           ${dragState?.index === idx ? 'cursor-grabbing opacity-90' : 'cursor-grab'}
                         `, style: { left: `${left}%`, width: `${width}%` }, onPointerDown: (e) => handlePointerDown(e, idx, 'move'), children: [_jsx("div", { className: "absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-primary/20 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-background z-30", onPointerDown: (e) => handlePointerDown(e, idx, 'resize-start'), children: _jsx("div", { className: "w-[2px] h-4 bg-primary/50 rounded-full" }) }), _jsxs("div", { className: "flex-1 flex gap-2 h-full items-center px-3 py-1 pointer-events-none overflow-hidden select-none", children: [item.product?.imageLink && (_jsx("img", { src: item.product.imageLink, className: "h-full max-h-[60px] rounded aspect-square object-cover shadow-sm bg-muted border border-border/50 shrink-0 pointer-events-none", draggable: false })), _jsxs("div", { className: "flex flex-col min-w-0 flex-1 opacity-90 hidden sm:flex pointer-events-none", children: [_jsx("span", { className: "text-[12px] font-bold text-foreground truncate", children: item.product?.title }), _jsxs("span", { className: "text-[10px] text-muted-foreground font-mono truncate", children: [formatTime(item.startTime), " / ", formatTime(item.endTime)] })] })] }), _jsx("div", { className: "absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-primary/20 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-background z-30", onPointerDown: (e) => handlePointerDown(e, idx, 'resize-end'), children: _jsx("div", { className: "w-[2px] h-4 bg-primary/50 rounded-full" }) })] }, idx));
                                                })] }), _jsx("div", { className: "mt-3 flex gap-2", children: _jsxs(Button, { variant: "secondary", size: "sm", className: "w-full text-xs font-semibold py-1 h-8", onClick: () => { setIsAddingMode(true); setSelectedTimelineIndex(null); }, children: [_jsx(Plus, { className: "w-3.5 h-3.5 mr-1.5" }), " Adicionar Bloco de Produto"] }) })] }), _jsxs("div", { className: "flex-1 bg-background/50 p-6 relative", children: [dragState ? (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[1px] z-10 text-muted-foreground animate-in fade-in", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx(GripHorizontal, { className: "w-8 h-8 mb-2 animate-bounce opacity-50" }), _jsx("p", { className: "font-semibold text-sm", children: "Arraste para ajustar o tempo na r\u00E9gua..." })] }) })) : null, selectedTimelineIndex !== null ? (_jsxs("div", { className: "flex gap-5 items-start animate-in fade-in zoom-in-95 duration-200", children: [_jsx("div", { className: "w-24 h-24 rounded-lg border-2 border-border bg-muted overflow-hidden shrink-0 shadow-sm", children: timeline[selectedTimelineIndex]?.product?.imageLink && _jsx("img", { src: timeline[selectedTimelineIndex].product?.imageLink, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "flex flex-col flex-1 min-w-0", children: [_jsx("h4", { className: "font-semibold text-lg line-clamp-1", children: timeline[selectedTimelineIndex]?.product?.title }), _jsx("p", { className: "text-sm text-muted-foreground mt-1 flex-1", children: "Voc\u00EA pode redimensionar clicando e arrastando as bordas diretas do bloco l\u00E1 na timeline cinza. O sistema previne conflitos sozinho." }), _jsx("div", { className: "flex items-center gap-3 mt-4", children: _jsxs(Button, { variant: "destructive", size: "sm", onClick: () => { setTimeline(p => p.filter((_, i) => i !== selectedTimelineIndex)); setSelectedTimelineIndex(null); }, children: [_jsx(Trash2, { className: "w-4 h-4 mr-2" }), " Excluir da Cena"] }) })] })] })) :
                                            /* State 2: Adding a NEW BLOCK */
                                            isAddingMode ? (_jsxs("div", { className: "flex flex-col sm:flex-row gap-8 animate-in fade-in duration-300", children: [_jsxs("div", { className: "flex-1 max-w-[400px]", children: [_jsx("h3", { className: "text-sm font-bold mb-3", children: "Pesquisar Cat\u00E1logo" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" }), _jsx("input", { className: "flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm focus:ring-primary", placeholder: "Ex: T\u00EAnis Nike...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), onKeyDown: e => e.key === 'Enter' && handleSearchProduct(), autoFocus: true })] }), _jsx(Button, { size: "sm", onClick: handleSearchProduct, disabled: searching, variant: "secondary", children: searching ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : "Enter" })] }), searchResults.length > 0 && (_jsx("div", { className: "mt-3 border border-border rounded-lg overflow-hidden bg-background max-h-[140px] overflow-y-auto custom-scrollbar shadow-inner", children: searchResults.map(p => (_jsxs("button", { className: "w-full text-left flex items-center gap-3 p-2.5 hover:bg-muted/50 border-b border-border/40 last:border-0 transition-colors", onClick: () => setSelectedProduct(p), children: [_jsx("img", { src: p.imageLink, className: "w-8 h-8 rounded border object-cover shrink-0" }), _jsx("p", { className: "text-xs font-medium truncate flex-1", children: p.title })] }, p.id))) }))] }), _jsxs("div", { className: "flex-1 flex flex-col justify-start border-l border-border pl-8", children: [_jsx("h3", { className: "text-sm font-bold mb-3", children: "Vincular Sele\u00E7\u00E3o" }), !selectedProduct ? (_jsx("p", { className: "text-sm text-muted-foreground italic bg-muted/20 p-4 rounded-md border border-border/50 text-center", children: "Nenhum produto selecionado na lista." })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3 bg-muted/40 p-2.5 rounded-lg border border-border/80 shadow-sm", children: [_jsx("img", { src: selectedProduct.imageLink, className: "w-10 h-10 rounded object-cover shadow-sm" }), _jsx("p", { className: "text-sm font-semibold truncate flex-1", children: selectedProduct.title }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-muted-foreground", onClick: () => setSelectedProduct(null), children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs(Button, { className: "w-full text-xs font-bold uppercase tracking-wider h-10", onClick: commitAddProduct, children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Dropar na Timeline"] }), _jsx("p", { className: "text-[10px] text-muted-foreground text-center", children: "O sistema vai testar os intervalos de espa\u00E7o vazio antes de injetar." })] }))] })] })) :
                                                /* State 3: default empty state */
                                                (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-muted-foreground text-center animate-in fade-in", children: [_jsx(GripVertical, { className: "w-8 h-8 opacity-20 mb-3" }), _jsx("p", { className: "text-sm max-w-sm", children: "DICA: Clique num quadrado colorido l\u00E1 encima e segure os cantos para esticar ou encolher facilmente o tempo em que o produto vai sumir." })] }))] })] }) })] }), _jsx("style", { dangerouslySetInnerHTML: { __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--muted-foreground)/0.3); border-radius: 4px; }
      ` } })] }));
}
