# AppTrocaFigurinhas

MVP mobile-first para troca de figurinhas da Copa do Mundo 2026 entre moradores de um condomínio ou loteamento.

## Stack

- Next.js App Router com TypeScript.
- Supabase/Postgres para persistir o feed.
- Catálogo local em `src/data/stickers.ts`.
- UI mobile-first inspirada nos frames do Figma: catálogo, detalhe da figurinha, tabs do feed e formulário.

## Rodar Localmente

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis:

```bash
cp .env.example .env.local
```

Preencha:

```bash
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

3. Crie a tabela no Supabase executando o SQL em:

```text
supabase/migrations/0001_create_sticker_feed.sql
```

4. Rode o app:

```bash
npm run dev
```

## Scripts

```bash
npm run lint
npm run typecheck
npm run build
```

## Catálogo e Imagens

O catálogo inicial tem dados mockados suficientes para desenvolvimento. As imagens oficiais não são baixadas nem geradas automaticamente.

Para substituir placeholders:

1. coloque as imagens reais em `public/stickers/`;
2. atualize `imagemUrl` em `src/data/stickers.ts`;
3. mantenha os campos `id`, `numero`, `categoriaOuSelecao` e `paginaAlbum`.

## Supabase

A tabela `sticker_feed` usa:

- `sticker_id`;
- `tipo`: `tem_repetida` ou `precisa`;
- `nome`;
- `whatsapp` normalizado só com dígitos;
- `casa_lote`;
- `created_at`;
- `updated_at`;
- constraint única em `sticker_id + whatsapp`.

O app usa Server Actions, então a `SUPABASE_SERVICE_ROLE_KEY` fica somente no servidor. Sem login, qualquer pessoa que informe o mesmo WhatsApp consegue atualizar ou remover aquele registro, conforme definido para o MVP.

## Deploy GitHub para Vercel

O projeto Vercel será criado manualmente pelo owner.

Passos mínimos:

1. na Vercel, criar/importar um projeto a partir do GitHub;
2. selecionar `manager-rubens/AppTrocaFigurinhas`;
3. configurar `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`;
4. manter build command padrão `npm run build` e output padrão do Next.js;
5. fazer o primeiro deploy e validar home, filtro, detalhe, criação, edição e remoção de registro.

Depois disso, cada push na branch principal dispara deploy automático pela integração nativa GitHub + Vercel.
