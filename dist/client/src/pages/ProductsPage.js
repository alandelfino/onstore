import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, Loader2, Edit, Trash2, PackageOpen, X, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit, setLimit] = useState(50);
    const [pageInput, setPageInput] = useState("1");
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        setPageInput(page.toString());
    }, [page]);
    const handlePageSubmit = (e) => {
        e.preventDefault();
        const p = parseInt(pageInput);
        if (!isNaN(p) && p >= 1 && p <= totalPages) {
            setPage(p);
        }
        else {
            setPageInput(page.toString());
        }
    };
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Voltamos para a página 1 ao buscar algo novo
        }, 50);
        return () => clearTimeout(t);
    }, [search]);
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/products?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
                setTotalPages(data.totalPages || 1);
                setTotalItems(data.total || 0);
            }
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, [page, limit, debouncedSearch]); // Refetch when page or search query changes
    const handleDelete = async (id) => {
        if (!window.confirm("Certeza que deseja remover este produto?"))
            return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`/api/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(prev => prev.filter(p => p.id !== id));
            setTotalItems(prev => prev - 1);
        }
        catch {
            alert("Erro ao remover produto.");
        }
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!editingProduct)
            return;
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/products/${editingProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editingProduct),
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(prev => prev.map(p => p.id === data.product.id ? data.product : p));
                setEditingProduct(null);
            }
            else {
                alert("Erro ao salvar o produto.");
            }
        }
        finally {
            setIsSaving(false);
        }
    };
    return (_jsxs("div", { className: "flex flex-col gap-6 h-full max-w-7xl mx-auto w-full", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Produtos Importados" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [totalItems, " produtos registrados."] })] }), _jsxs("div", { className: "relative w-full sm:w-72", children: [_jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx("input", { type: "search", placeholder: "Buscar por ID ou Nome...", className: "flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", value: search, onChange: (e) => setSearch(e.target.value) })] })] }), _jsx("div", { className: "flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden relative shadow-sm", children: loading && products.length === 0 ? (_jsxs("div", { className: "flex-1 flex flex-col gap-3 p-6 justify-center items-center h-64", children: [_jsx(Loader2, { className: "w-8 h-8 text-muted-foreground animate-spin" }), _jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Carregando cat\u00E1logo..." })] })) : products.length === 0 ? (_jsxs("div", { className: "flex-1 flex flex-col items-center justify-center p-12 text-center h-64", children: [_jsx(PackageOpen, { className: "w-12 h-12 text-muted-foreground mb-4 opacity-30" }), _jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Sem produtos nesta lista" }), _jsxs("p", { className: "text-sm text-muted-foreground mt-1 max-w-sm mx-auto", children: ["Nenhum resultado foi encontrado na p\u00E1gina ", page, " para sua busca atual."] })] })) : (_jsxs("div", { className: "flex-1 flex flex-col overflow-hidden relative", children: [loading && (_jsx("div", { className: "absolute inset-0 z-20 bg-background/50 backdrop-blur-[1px] flex items-center justify-center", children: _jsx(Loader2, { className: "w-8 h-8 text-primary animate-spin" }) })), _jsx("div", { className: "flex-1 overflow-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "sticky top-0 z-10 bg-muted/90 backdrop-blur border-b border-border shadow-sm", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-semibold text-left text-muted-foreground w-16", children: "Img" }), _jsx("th", { className: "px-4 py-3 font-semibold text-left text-muted-foreground", children: "Produto" }), _jsx("th", { className: "px-4 py-3 font-semibold text-left text-muted-foreground", children: "Pre\u00E7o" }), _jsx("th", { className: "px-4 py-3 font-semibold text-left text-muted-foreground", children: "Marca" }), _jsx("th", { className: "px-4 py-3 font-semibold text-left text-muted-foreground", children: "Estoque" }), _jsx("th", { className: "px-4 py-3 font-semibold text-right text-muted-foreground", children: "A\u00E7\u00F5es" })] }) }), _jsx("tbody", { className: "divide-y divide-border", children: products.map(p => (_jsxs("tr", { className: "hover:bg-muted/30 transition-colors group", children: [_jsx("td", { className: "px-4 py-3", children: p.imageLink ? (_jsx("div", { className: "w-10 h-10 rounded overflow-hidden border border-border bg-muted flex items-center justify-center", children: _jsx("img", { src: p.imageLink, alt: p.title, className: "w-full h-full object-cover", loading: "lazy" }) })) : (_jsx("div", { className: "w-10 h-10 rounded border border-border bg-muted flex items-center justify-center", children: _jsx(ImageIcon, { className: "w-4 h-4 text-muted-foreground opacity-50" }) })) }), _jsxs("td", { className: "px-4 py-3 max-w-xs", children: [_jsx("p", { className: "text-sm font-medium text-foreground line-clamp-1", title: p.title, children: p.title }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5 font-mono", children: p.externalId })] }), _jsx("td", { className: "px-4 py-3", children: p.price ? _jsx("span", { className: "font-medium whitespace-nowrap", children: p.price }) : _jsx("span", { className: "text-muted-foreground", children: "-" }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: "text-muted-foreground max-w-[120px] truncate block", title: p.brand || "", children: p.brand || "-" }) }), _jsx("td", { className: "px-4 py-3", children: _jsx(Badge, { variant: p.availability?.includes("in stock") ? "default" : "secondary", className: "whitespace-nowrap", children: p.availability || "N/A" }) }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8", onClick: () => setEditingProduct(p), children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "destructive", size: "icon", className: "h-8 w-8", onClick: () => handleDelete(p.id), children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, p.id))) })] }) }), _jsxs("div", { className: "border-t border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20", children: [_jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-3", children: [_jsxs("span", { children: ["Mostrando do ", totalItems === 0 ? 0 : (page - 1) * limit + 1, " ao ", Math.min(page * limit, totalItems), " de ", totalItems, " produtos"] }), loading && _jsx(Loader2, { className: "w-3 h-3 animate-spin inline" }), _jsxs("div", { className: "flex items-center gap-2 border-l border-border pl-3", children: [_jsx("span", { className: "hidden sm:inline", children: "Itens por p\u00E1gina:" }), _jsxs("select", { className: "h-7 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", value: limit, onChange: (e) => {
                                                        setLimit(Number(e.target.value));
                                                        setPage(1);
                                                    }, disabled: loading, children: [_jsx("option", { value: 20, children: "20" }), _jsx("option", { value: 30, children: "30" }), _jsx("option", { value: 40, children: "40" }), _jsx("option", { value: 50, children: "50" })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", disabled: page <= 1 || loading, onClick: () => setPage(page - 1), title: "Anterior", className: "px-2", children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsxs("form", { onSubmit: handlePageSubmit, className: "flex items-center gap-1.5", children: [_jsx("span", { className: "text-xs text-muted-foreground hidden sm:inline", children: "P\u00E1gina" }), _jsx("input", { type: "number", min: 1, max: totalPages || 1, className: "flex h-8 w-14 text-center rounded-md border border-input bg-background px-1 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", value: pageInput, onChange: (e) => setPageInput(e.target.value), onBlur: handlePageSubmit, disabled: loading || totalPages === 0 }), _jsxs("span", { className: "text-xs text-muted-foreground hidden sm:inline", children: ["de ", totalPages] })] }), _jsx(Button, { variant: "outline", size: "sm", disabled: page >= totalPages || loading, onClick: () => setPage(page + 1), title: "Pr\u00F3xima", className: "px-2", children: _jsx(ChevronRight, { className: "w-4 h-4" }) })] })] })] })) }), editingProduct && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6", onClick: () => setEditingProduct(null), children: _jsx(Card, { className: "w-full max-w-lg shadow-xl shadow-black/10 animate-in zoom-in-95 duration-200", onClick: (e) => e.stopPropagation(), children: _jsxs("form", { onSubmit: handleSave, children: [_jsxs(CardHeader, { className: "border-b border-border pb-4 flex flex-row items-center justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-lg", children: "Editar Produto" }), _jsxs(CardDescription, { className: "font-mono mt-1", children: ["ID: ", editingProduct.externalId] })] }), _jsx(Button, { variant: "ghost", size: "icon", className: "-mr-2 -mt-4 text-muted-foreground", type: "button", onClick: () => setEditingProduct(null), children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs(CardContent, { className: "space-y-4 pt-6 max-h-[60vh] overflow-y-auto", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "T\u00EDtulo" }), _jsx("input", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", value: editingProduct.title || "", onChange: e => setEditingProduct({ ...editingProduct, title: e.target.value }), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Link da Imagem URL" }), _jsx("input", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", value: editingProduct.imageLink || "", onChange: e => setEditingProduct({ ...editingProduct, imageLink: e.target.value }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Pre\u00E7o (ex: 99.99 BRL)" }), _jsx("input", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", value: editingProduct.price || "", onChange: e => setEditingProduct({ ...editingProduct, price: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Marca" }), _jsx("input", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", value: editingProduct.brand || "", onChange: e => setEditingProduct({ ...editingProduct, brand: e.target.value }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Descri\u00E7\u00E3o" }), _jsx("textarea", { className: "flex min-h-[100px] w-full items-start rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", value: editingProduct.description || "", onChange: e => setEditingProduct({ ...editingProduct, description: e.target.value }) })] })] }), _jsxs("div", { className: "p-4 border-t border-border bg-muted/20 flex justify-end gap-2 rounded-b-xl", children: [_jsx(Button, { variant: "outline", type: "button", onClick: () => setEditingProduct(null), disabled: isSaving, children: "Cancelar" }), _jsxs(Button, { type: "submit", disabled: isSaving, children: [isSaving ? _jsx(Loader2, { className: "w-4 h-4 animate-spin mr-2" }) : null, isSaving ? "Salvando..." : "Salvar Alterações"] })] })] }) }) }))] }));
}
