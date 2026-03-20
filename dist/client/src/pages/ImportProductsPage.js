import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Upload, Link as LinkIcon, AlertCircle, Loader2, CheckCircle2, XCircle, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export default function ImportProductsPage() {
    const [jobs, setJobs] = useState([]);
    const [syncs, setSyncs] = useState([]);
    const [urlInput, setUrlInput] = useState("");
    // Recurring Configuration
    const [isRecurring, setIsRecurring] = useState(false);
    const [syncInterval, setSyncInterval] = useState(1);
    const [syncTime, setSyncTime] = useState("03:00");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const fileInputRef = useRef(null);
    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const [resJobs, resSyncs] = await Promise.all([
                fetch("/api/catalog/imports", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/catalog/syncs", { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (resJobs.ok) {
                const data = await resJobs.json();
                setJobs(data.imports || []);
            }
            if (resSyncs.ok) {
                const data = await resSyncs.json();
                setSyncs(data.syncs || []);
            }
        }
        catch (e) {
            console.error("Failed to fetch jobs");
        }
    };
    // Poll every 3 seconds
    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 3000);
        return () => clearInterval(interval);
    }, []);
    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        if (!urlInput.trim())
            return;
        setIsSubmitting(true);
        setErrorMsg("");
        try {
            const token = localStorage.getItem("token");
            const endpoint = isRecurring ? "/api/catalog/sync" : "/api/catalog/import";
            const bodyPayload = isRecurring
                ? { url: urlInput, frequencyDays: syncInterval, syncTime }
                : { url: urlInput };
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bodyPayload),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Erro ao iniciar importação");
            setUrlInput("");
            setIsRecurring(false);
            fetchJobs();
        }
        catch (e) {
            setErrorMsg(e.message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setIsSubmitting(true);
        setErrorMsg("");
        const formData = new FormData();
        formData.append("file", file);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/catalog/import", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Erro ao fazer upload");
            if (fileInputRef.current)
                fileInputRef.current.value = "";
            fetchJobs();
        }
        catch (e) {
            setErrorMsg(e.message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDeleteSync = async (id) => {
        if (!window.confirm("Deseja realmente remover esta automação? Seu catálogo não será apagado."))
            return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`/api/catalog/syncs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchJobs();
        }
        catch (e) {
            alert("Erro ao excluir agendamento.");
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case "completed": return _jsx(Badge, { className: "bg-emerald-500 hover:bg-emerald-600 border-0", children: "Conclu\u00EDdo" });
            case "failed": return _jsx(Badge, { variant: "destructive", children: "Falhou" });
            case "processing": return _jsx(Badge, { className: "bg-blue-500 hover:bg-blue-600 border-0", children: "Processando" });
            default: return _jsx(Badge, { variant: "secondary", children: "Pendente" });
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "completed": return _jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-500" });
            case "failed": return _jsx(XCircle, { className: "w-5 h-5 text-destructive" });
            case "processing": return _jsx(Loader2, { className: "w-5 h-5 text-blue-500 animate-spin" });
            default: return _jsx(Loader2, { className: "w-5 h-5 text-muted-foreground" });
        }
    };
    return (_jsxs("div", { className: "flex flex-col gap-6 h-full max-w-5xl mx-auto w-full pb-10", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Importar Cat\u00E1logo" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Importe seus produtos usando o formato de XML do Facebook." })] }), errorMsg && (_jsxs("div", { className: "flex items-center gap-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-3", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), _jsx("span", { children: errorMsg })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "border-border", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [_jsx(LinkIcon, { className: "w-4 h-4 text-primary" }), "Importar por URL"] }), _jsx(CardDescription, { children: "Cole o link direto para o feed XML p\u00FAblico." })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleUrlSubmit, className: "flex flex-col gap-3", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "url", placeholder: "https://exemplo.com/feed.xml", value: urlInput, onChange: (e) => setUrlInput(e.target.value), className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", required: true }), _jsx(Button, { type: "submit", disabled: isSubmitting || !urlInput, children: isSubmitting ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : "Importar" })] }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx("input", { type: "checkbox", id: "recurring", checked: isRecurring, onChange: e => setIsRecurring(e.target.checked), className: "rounded border-input text-primary focus:ring-primary w-4 h-4" }), _jsx("label", { htmlFor: "recurring", className: "text-sm font-medium cursor-pointer", children: "Sincronizar Automaticamente" })] }), isRecurring && (_jsxs("div", { className: "flex gap-3 p-4 bg-muted/30 rounded-lg border border-border animate-in fade-in zoom-in-95 duration-200", children: [_jsxs("div", { className: "flex-1 space-y-1.5", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground", children: "Frequ\u00EAncia" }), _jsx("select", { className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", value: syncInterval, onChange: e => setSyncInterval(Number(e.target.value)), children: Array.from({ length: 30 }).map((_, i) => (_jsx("option", { value: i + 1, children: i === 0 ? "Todo dia" : `A cada ${i + 1} dias` }, i + 1))) })] }), _jsxs("div", { className: "w-32 space-y-1.5", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground", children: "Hor\u00E1rio" }), _jsx("input", { type: "time", className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", value: syncTime, onChange: e => setSyncTime(e.target.value), required: true })] })] }))] }) })] }), _jsxs(Card, { className: "border-border", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [_jsx(Upload, { className: "w-4 h-4 text-primary" }), "Upload de Arquivo"] }), _jsx(CardDescription, { children: "Envie um arquivo XML pesado (at\u00E9 500MB)." })] }), _jsxs(CardContent, { children: [_jsx("input", { type: "file", accept: ".xml", className: "hidden", ref: fileInputRef, onChange: handleFileChange }), _jsxs(Button, { variant: "outline", className: "w-full h-10 border-dashed border-2", onClick: () => fileInputRef.current?.click(), disabled: isSubmitting, children: [isSubmitting ? _jsx(Loader2, { className: "w-4 h-4 animate-spin mr-2" }) : _jsx(Upload, { className: "w-4 h-4 mr-2" }), isSubmitting ? "Enviando..." : "Selecionar Arquivo XML"] }), _jsx("p", { className: "text-xs text-muted-foreground mt-4 text-center", children: "Arquivos de upload s\u00E3o importa\u00E7\u00F5es manuais, feitas apenas uma vez." })] })] })] }), syncs.length > 0 && (_jsxs(Card, { className: "border-border flex flex-col overflow-hidden", children: [_jsxs(CardHeader, { className: "border-b border-border bg-muted/20 pb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 text-blue-500" }), _jsx(CardTitle, { className: "text-base", children: "Cronogramas de Sincroniza\u00E7\u00E3o" })] }), _jsx(CardDescription, { children: "Links que est\u00E3o operando em piloto autom\u00E1tico." })] }), _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "divide-y divide-border", children: syncs.map((sync) => (_jsxs("div", { className: "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-foreground truncate", title: sync.url, children: sync.url }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsxs("span", { className: "text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded", children: [sync.frequencyDays === 1 ? 'Diário' : `A cada ${sync.frequencyDays} dias`, " \u00E0s ", sync.syncTime] }), _jsx("span", { className: "text-xs text-muted-foreground", children: "\u2022" }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["Pr\u00F3ximo: ", new Date(sync.nextSyncAt).toLocaleString("pt-BR")] })] })] }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-destructive shrink-0", onClick: () => handleDeleteSync(sync.id), children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, sync.id))) }) })] })), _jsxs(Card, { className: "border-border flex-1 border flex flex-col overflow-hidden", children: [_jsxs(CardHeader, { className: "border-b border-border bg-muted/20 pb-3", children: [_jsx(CardTitle, { className: "text-base", children: "Hist\u00F3rico e Fila" }), _jsx(CardDescription, { children: "Acompanhe o disparo das importa\u00E7\u00F5es em tempo real." })] }), _jsx(CardContent, { className: "p-0 flex-1 overflow-auto max-h-[400px]", children: jobs.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center p-12 text-center text-muted-foreground", children: [_jsx(AlertCircle, { className: "w-8 h-8 mb-3 opacity-20" }), _jsx("p", { className: "text-sm", children: "Nenhuma importa\u00E7\u00E3o encontrada." })] })) : (_jsx("div", { className: "divide-y divide-border", children: jobs.map((job) => (_jsxs("div", { className: "p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors", children: [_jsx("div", { className: "shrink-0", children: getStatusIcon(job.status) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-foreground truncate", title: job.sourceType === "url" ? job.sourceUrl : "Arquivo Local", children: job.sourceType === "url" ? job.sourceUrl : "Arquivo Local" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: new Date(job.createdAt).toLocaleString("pt-BR") }), _jsx("span", { className: "text-xs text-muted-foreground", children: "\u2022" }), _jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: [job.processedItems, " itens lidos"] }), job.error && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "\u2022" }), _jsx("span", { className: "text-xs text-destructive truncate max-w-[200px]", title: job.error, children: job.error })] }))] })] }), _jsx("div", { className: "shrink-0", children: getStatusBadge(job.status) })] }, job.id))) })) })] })] }));
}
