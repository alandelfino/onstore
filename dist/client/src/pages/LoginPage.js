import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShoppingBag, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        if (!email.trim() || !password.trim()) {
            setError("Preencha e-mail e senha para continuar.");
            return;
        }
        setIsPending(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Erro ao autenticar.");
                return;
            }
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        }
        catch {
            setError("Erro de conexão. Tente novamente.");
        }
        finally {
            setIsPending(false);
        }
    }
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8", children: [_jsxs("div", { className: "flex items-center gap-2 mb-8", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-primary flex items-center justify-center", children: _jsx(ShoppingBag, { className: "w-5 h-5 text-primary-foreground" }) }), _jsx("span", { className: "text-xl font-bold tracking-tight text-foreground", children: "Vidshop" })] }), _jsxs(Card, { className: "w-full max-w-sm shadow-sm", children: [_jsxs(CardHeader, { className: "pb-4", children: [_jsx(CardTitle, { className: "text-xl", children: "Bem-vindo de volta" }), _jsx(CardDescription, { children: "Entre com sua conta para acessar o painel." })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx(Label, { htmlFor: "email", children: "E-mail" }), _jsx(Input, { id: "email", type: "email", placeholder: "seu@email.com", value: email, onChange: (e) => setEmail(e.target.value), disabled: isPending, autoComplete: "email" })] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx(Label, { htmlFor: "password", children: "Senha" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "password", type: showPassword ? "text" : "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), disabled: isPending, autoComplete: "current-password", className: "pr-10" }), _jsx("button", { type: "button", onClick: () => setShowPassword((v) => !v), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150", tabIndex: -1, children: showPassword ? (_jsx(EyeOff, { className: "w-4 h-4" })) : (_jsx(Eye, { className: "w-4 h-4" })) })] })] }), error && (_jsx("p", { className: "text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2", children: error })), _jsxs(Button, { type: "submit", disabled: isPending, className: "w-full mt-1 min-h-[44px]", children: [isPending && _jsx(Loader2, { className: "w-4 h-4 animate-spin" }), isPending ? "Entrando..." : "Entrar"] })] }) })] }), _jsxs("p", { className: "text-xs text-muted-foreground mt-6", children: ["N\u00E3o tem conta?", " ", _jsx("button", { className: "text-primary hover:underline transition-all duration-150 font-medium", children: "Fale com o administrador" })] })] }));
}
