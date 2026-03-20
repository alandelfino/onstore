import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Upload, Image as ImageIcon, Video, Trash2, Loader2, FolderOpen, X, Play, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
function formatBytes(bytes) {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function getToken() {
    return localStorage.getItem("token") ?? "";
}
export default function MediaPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [dragging, setDragging] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [preview, setPreview] = useState(null);
    const inputRef = useRef(null);
    async function fetchMedia() {
        setLoading(true);
        try {
            const res = await fetch("/api/media", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await res.json();
            setItems(data.media ?? []);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchMedia();
    }, []);
    async function uploadFile(file) {
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
            setUploadError("Tipo não permitido. Envie somente imagens ou vídeos.");
            return;
        }
        setUploadError("");
        setUploading(true);
        const form = new FormData();
        form.append("file", file);
        try {
            const res = await fetch("/api/media/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
                body: form,
            });
            const data = await res.json();
            if (!res.ok) {
                setUploadError(data.error ?? "Erro ao fazer upload.");
                return;
            }
            setItems((prev) => [data.media, ...prev]);
        }
        catch {
            setUploadError("Erro de conexão. Tente novamente.");
        }
        finally {
            setUploading(false);
        }
    }
    function handleFiles(files) {
        if (!files || files.length === 0)
            return;
        // Upload all files sequentially
        Array.from(files).forEach((f) => uploadFile(f));
    }
    async function handleDelete(id) {
        setDeletingId(id);
        try {
            await fetch(`/api/media/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setItems((prev) => prev.filter((m) => m.id !== id));
            if (preview?.id === id)
                setPreview(null);
        }
        finally {
            setDeletingId(null);
        }
    }
    const filtered = items.filter((item) => {
        if (filter === "image")
            return item.mimeType.startsWith("image/");
        if (filter === "video")
            return item.mimeType.startsWith("video/");
        return true;
    });
    const imageCount = items.filter((i) => i.mimeType.startsWith("image/")).length;
    const videoCount = items.filter((i) => i.mimeType.startsWith("video/")).length;
    // ── Render ────────────────────────────────────────────────────────────────
    return (_jsxs("div", { className: "flex flex-col gap-6 h-full", children: [_jsxs("div", { className: "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "M\u00EDdias" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [items.length, " arquivo", items.length !== 1 ? "s" : "", " \u00B7 ", imageCount, " imagens \u00B7 ", videoCount, " v\u00EDdeos"] })] }), _jsxs(Button, { onClick: () => inputRef.current?.click(), disabled: uploading, className: "min-h-[44px] w-full sm:w-auto", children: [uploading ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsx(Upload, { className: "w-4 h-4" })), uploading ? "Enviando..." : "Fazer upload"] }), _jsx("input", { ref: inputRef, type: "file", accept: "image/*,video/*", multiple: true, className: "hidden", onChange: (e) => handleFiles(e.target.files) })] }), uploadError && (_jsxs("div", { className: "flex items-center justify-between gap-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-2.5", children: [_jsx("span", { children: uploadError }), _jsx("button", { onClick: () => setUploadError(""), className: "text-destructive hover:opacity-70 transition-opacity", children: _jsx(X, { className: "w-3.5 h-3.5" }) })] })), _jsxs("div", { onDragOver: (e) => { e.preventDefault(); setDragging(true); }, onDragLeave: () => setDragging(false), onDrop: (e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFiles(e.dataTransfer.files);
                }, onClick: () => inputRef.current?.click(), className: cn("border-2 border-dashed rounded-lg px-6 py-8 flex flex-col items-center gap-3 cursor-pointer", "transition-all duration-150", dragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/40"), children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center", children: _jsx(Upload, { className: "w-5 h-5 text-primary" }) }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: dragging ? "Solte para fazer upload" : "Arraste arquivos aqui" }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "ou clique para selecionar \u00B7 Imagens e v\u00EDdeos \u00B7 At\u00E9 100 MB" })] })] }), _jsx("div", { className: "flex items-center gap-1 border-b border-border pb-0", children: ["all", "image", "video"].map((f) => (_jsxs("button", { onClick: () => setFilter(f), className: cn("flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-150 border-b-2 -mb-px", filter === f
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"), children: [f === "all" && "Todos", f === "image" && _jsxs(_Fragment, { children: [_jsx(ImageIcon, { className: "w-3.5 h-3.5" }), "Imagens"] }), f === "video" && _jsxs(_Fragment, { children: [_jsx(Video, { className: "w-3.5 h-3.5" }), "V\u00EDdeos"] }), _jsx("span", { className: "text-xs bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 font-normal", children: f === "all" ? items.length : f === "image" ? imageCount : videoCount })] }, f))) }), loading ? (_jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", children: Array.from({ length: 8 }).map((_, i) => (_jsx(Skeleton, { className: "aspect-square rounded-lg" }, i))) })) : filtered.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 gap-3", children: [_jsx(FolderOpen, { className: "w-10 h-10 text-muted-foreground" }), _jsx("p", { className: "text-sm text-muted-foreground", children: filter === "all" ? "Nenhuma mídia encontrada" : `Nenhum(a) ${filter === "image" ? "imagem" : "vídeo"} encontrado(a)` }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => inputRef.current?.click(), children: "Fazer upload" })] })) : (_jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", children: filtered.map((item) => {
                    const isImage = item.mimeType.startsWith("image/");
                    const isDeleting = deletingId === item.id;
                    return (_jsxs("div", { className: "group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted cursor-pointer", onClick: () => setPreview(item), children: [isImage ? (_jsx("img", { src: item.url, alt: item.originalName, className: "w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" })) : (_jsxs("div", { className: "w-full h-full flex items-center justify-center bg-foreground/5", children: [_jsx("video", { src: item.url, className: "w-full h-full object-cover", muted: true, preload: "metadata" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("div", { className: "w-10 h-10 rounded-full bg-black/60 flex items-center justify-center", children: _jsx(Play, { className: "w-4 h-4 text-white fill-white ml-0.5" }) }) })] })), _jsxs("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex flex-col justify-between p-2.5 opacity-0 group-hover:opacity-100", children: [_jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: (e) => { e.stopPropagation(); handleDelete(item.id); }, disabled: isDeleting, className: "w-7 h-7 rounded-md bg-destructive/90 hover:bg-destructive flex items-center justify-center transition-colors duration-150", children: isDeleting
                                                ? _jsx(Loader2, { className: "w-3 h-3 text-white animate-spin" })
                                                : _jsx(Trash2, { className: "w-3 h-3 text-white" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white text-xs font-medium truncate leading-tight", children: item.originalName }), _jsxs("div", { className: "flex items-center gap-1.5 mt-1", children: [_jsx(Badge, { variant: "secondary", className: "text-xs py-0 px-1.5 bg-white/20 text-white border-0", children: isImage ? "Imagem" : "Vídeo" }), _jsx("span", { className: "text-white/70 text-xs", children: formatBytes(item.size) })] })] })] })] }, item.id));
                }) })), preview && (_jsx("div", { className: "fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4", onClick: () => setPreview(null), children: _jsxs("div", { className: "relative bg-card rounded-xl overflow-hidden max-w-3xl w-full shadow-xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-foreground truncate", children: preview.originalName }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [formatBytes(preview.size), " \u00B7 ", preview.mimeType] })] }), _jsx("button", { onClick: () => setPreview(null), className: "ml-4 text-muted-foreground hover:text-foreground transition-colors duration-150 p-1", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsx("div", { className: "max-h-[70vh] overflow-auto bg-muted/30 flex items-center justify-center p-4", children: preview.mimeType.startsWith("image/") ? (_jsx("img", { src: preview.url, alt: preview.originalName, className: "max-w-full max-h-full object-contain rounded" })) : (_jsx("video", { src: preview.url, controls: true, autoPlay: true, className: "max-w-full max-h-[60vh] rounded" })) }), _jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3 border-t border-border", children: [_jsxs("p", { className: "text-xs text-muted-foreground", children: ["Enviado em ", new Date(preview.createdAt).toLocaleDateString("pt-BR", {
                                            day: "2-digit", month: "long", year: "numeric",
                                        })] }), _jsxs(Button, { variant: "destructive", size: "sm", disabled: deletingId === preview.id, onClick: () => handleDelete(preview.id), children: [deletingId === preview.id
                                            ? _jsx(Loader2, { className: "w-3 h-3 animate-spin" })
                                            : _jsx(Trash2, { className: "w-3 h-3" }), "Excluir"] })] })] }) }))] }));
}
