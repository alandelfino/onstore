---
description: how to make database schema changes
---

// turbo-all

## ⚠️ REGRA ABSOLUTA

**NUNCA use `npm run db:push` ou `drizzle-kit push` neste projeto.**
Sempre use o fluxo de migrations abaixo. O `db:push` dessincroniza o histórico de migrations e causa erros impossíveis de resolver sem resetar o banco.

---

## Fluxo para qualquer mudança no schema

### 1. Editar o schema
Modifique `shared/schema.ts` com as alterações desejadas.

### 2. Gerar e aplicar a migration
```powershell
npm run db:mig
```
Este comando executa `drizzle-kit generate && drizzle-kit migrate`, que:
- Gera um novo arquivo `.sql` em `drizzle/`
- Aplica no banco e registra na tabela `__drizzle_migrations`

### 3. Confirmar
O output deve terminar com:
```
[✓] migrations applied successfully!
```

---

## Se o banco precisar ser resetado do zero

1. Rodar o script de reset:
```powershell
node reset-db.cjs
```

2. Deletar todos os arquivos `drizzle/*.sql` manualmente.

3. Resetar o journal de migrations:
```json
{ "version": "6", "dialect": "postgresql", "entries": [] }
```
Salve em `drizzle/meta/_journal.json`.

4. Aplicar tudo do zero:
```powershell
npm run db:mig
```

---

## Comandos disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run db:mig` | Gera migration + aplica no banco ✅ |
| `npm run db:push` | ❌ NUNCA USAR |
