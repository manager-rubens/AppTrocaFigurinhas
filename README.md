# AppTrocaFigurinhas

MVP mobile-first para troca de figurinhas da Copa do Mundo 2026 entre moradores de um condominio ou loteamento.

## Stack

- Next.js App Router com TypeScript.
- Supabase/Postgres para feed e Supabase Auth para login.
- Catalogo local em `src/data/stickers.ts`.
- UI mobile-first inspirada nos frames do Figma: catalogo, detalhe da figurinha, tabs do feed, formulario e login.

## Rodar Localmente

1. Instale as dependencias:

```bash
npm install
```

2. Configure as variaveis:

```bash
cp .env.example .env.local
```

Preencha:

```bash
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_PUBLISHABLE_KEY=sua-publishable-ou-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

Se voce seguiu a documentacao do Supabase para Next.js, tambem pode usar os aliases
`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. A
`SUPABASE_SERVICE_ROLE_KEY` continua obrigatoria para as Server Actions do feed e
deve ficar somente no servidor.

3. Crie/atualize o banco no Supabase executando os SQLs em ordem:

```text
supabase/migrations/0001_create_sticker_feed.sql
supabase/migrations/0002_add_auth_owner_to_sticker_feed.sql
supabase/migrations/0003_repair_sticker_feed_user_id.sql
```

4. Configure o Auth no Supabase:

- Em Authentication > Providers, mantenha Email habilitado.
- Desative confirmacao obrigatoria de email para o MVP, pois o fluxo principal e celular + senha sem confirmacao.
- O usuario digita celular, mas o app cria um email interno derivado do numero para evitar dependencia do provider Phone/SMS do Supabase.
- Em Authentication > Providers > Google, mantenha o Google habilitado.
- Em Authentication > URL Configuration, adicione os redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://SEU-DOMINIO-VERCEL/auth/callback`

5. Rode o app:

```bash
npm run dev
```

## Scripts

```bash
npm run lint
npm run typecheck
npm run build
```

## Catalogo e Imagens

O catalogo inicial tem dados mockados suficientes para desenvolvimento. As imagens oficiais nao sao baixadas nem geradas automaticamente.

Para substituir placeholders:

1. coloque as imagens reais em `public/stickers/`;
2. atualize `imagemUrl` em `src/data/stickers.ts`;
3. mantenha os campos `id`, `numero`, `categoriaOuSelecao` e `paginaAlbum`.

## Supabase

A tabela `sticker_feed` usa:

- `sticker_id`;
- `user_id`, ligado ao usuario do Supabase Auth;
- `tipo`: `tem_repetida` ou `precisa`;
- `nome`;
- `whatsapp` normalizado so com digitos, usado como contato publico;
- `casa_lote`;
- `created_at`;
- `updated_at`;
- constraint unica em `sticker_id + user_id`.

O app usa Server Actions. A `SUPABASE_SERVICE_ROLE_KEY` deve ficar somente no servidor/local `.env.local` e nas variaveis privadas da Vercel. Nunca exponha essa chave no frontend.

## Deploy GitHub para Vercel

O projeto Vercel sera criado manualmente pelo owner.

Passos minimos:

1. na Vercel, criar/importar um projeto a partir do GitHub;
2. selecionar `manager-rubens/AppTrocaFigurinhas`;
3. configurar `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` e `SUPABASE_SERVICE_ROLE_KEY`;
4. manter build command padrao `npm run build` e output padrao do Next.js;
5. configurar no Supabase o redirect URL final da Vercel: `https://SEU-DOMINIO-VERCEL/auth/callback`;
6. fazer o primeiro deploy e validar home, filtro, detalhe, login, criacao, edicao e remocao de registro.

Depois disso, cada push na branch principal dispara deploy automatico pela integracao nativa GitHub + Vercel.
