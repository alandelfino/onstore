import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export async function setupVite(app, server) {
    if (process.env.NODE_ENV === "development") {
        // Em dev: Vite roda como middleware com HMR (Hot Module Replacement)
        const { createServer: createViteServer } = await import("vite");
        const vite = await createViteServer({
            server: {
                middlewareMode: true, // Vite não cria servidor próprio
                hmr: { server }, // HMR usa o mesmo servidor HTTP
            },
            appType: "spa",
        });
        app.use(vite.middlewares);
    }
    else {
        // Em produção: serve os arquivos estáticos buildados
        const distPath = path.resolve(__dirname, "../../dist/public");
        if (!fs.existsSync(distPath)) {
            throw new Error(`Build não encontrado em ${distPath}. Rode 'npm run build' primeiro.`);
        }
        app.use(express.static(distPath));
        // SPA fallback: qualquer rota não encontrada serve o index.html
        app.get("*", (_req, res) => {
            res.sendFile(path.resolve(distPath, "index.html"));
        });
    }
}
