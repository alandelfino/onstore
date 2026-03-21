import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  
  const [code, setCode] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendAttempts, setResendAttempts] = useState(1);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  async function handleResend() {
    if (timeLeft > 0) return;
    setIsResending(true);
    setError("");
    setResendMessage("");
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao reenviar o código.");
      } else {
        setResendMessage("Código reenviado com sucesso!");
        const nextAttempts = resendAttempts + 1;
        setResendAttempts(nextAttempts);
        setTimeLeft(nextAttempts * 60);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsResending(false);
    }
  }

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (code.length < 6) {
      setError("Código inválido.");
      return;
    }

    setIsPending(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao verificar o e-mail.");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm shadow-sm text-center">
        <CardHeader className="pb-4 items-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
             <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Verifique seu E-mail</CardTitle>
          <CardDescription>
            Enviamos um código de 6 dígitos para o e-mail <strong className="text-foreground">{email}</strong>.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Digite o código"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
              disabled={isPending}
              className="text-center text-2xl tracking-widest py-6 font-bold"
            />

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2 text-left">
                {error}
              </p>
            )}
            
            {resendMessage && (
              <p className="text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-3 py-2 text-left">
                {resendMessage}
              </p>
            )}

            <Button type="submit" disabled={isPending || code.length < 6} className="w-full mt-2 min-h-[44px]">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Verificando..." : "Verificar E-mail"}
            </Button>
            
            <div className="mt-4 text-sm text-center text-muted-foreground">
              Não recebeu o código?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={timeLeft > 0 || isResending}
                className="text-primary hover:underline font-medium disabled:opacity-50 disabled:no-underline"
              >
                {isResending ? "Reenviando..." : timeLeft > 0 ? `Reenviar em ${timeLeft}s` : "Reenviar e-mail"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
