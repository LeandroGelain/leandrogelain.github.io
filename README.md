# leandrogelain.github.io

Portfólio bilíngue (PT/EN) de Leandro Gelain — Astro, CSS puro, GitHub Pages.

## Comandos

```sh
npm install
npm run dev            # http://localhost:4321
npm run build          # gera dist/
npm run preview
npm run check          # astro check (tipos)
npm run encrypt-cases  # criptografa os cases protegidos
```

## Onde editar

| O quê | Onde |
|---|---|
| Textos da interface | `src/i18n/pt.json`, `src/i18n/en.json` |
| Serviços, experiência, skills | `src/data/*.ts` |
| E-mail, links, ID do Formspree | `src/data/site.ts` |
| Cases | `src/content/projects/{slug}.{pt,en}.md` (`cover`/`thumb` apontam para imagens em `src/assets/`) |
| Foto do Sobre | `src/views/AboutPage.astro` (constante `photo`) |
| Tokens de design | `src/styles/tokens.css` |

O corpo de cada case usa títulos `## ...`; cada título vira uma coluna (Desafio / Abordagem / Resultado).

## Cases protegidos

1. Metadados públicos em `src/content/projects/{slug}.{pt,en}.md` com `protected: true`.
2. Conteúdo em texto claro em `src/content/protected/{slug}.{pt,en}.md` (no `.gitignore`).
3. Senha em `.env`: `PROJECT_PW_{SLUG}=...` (veja `.env.example`).
4. `npm run encrypt-cases` → gera `src/data/encrypted/{slug}.{lang}.json` (AES-256-GCM, PBKDF2-SHA256 600k). **Commite só esse JSON.**

O CI não precisa de senha: ele publica o payload já criptografado. Páginas protegidas recebem `noindex` e ficam fora do sitemap.

## Deploy

Push em `master` → `.github/workflows/deploy.yml` → GitHub Pages.
Em **Settings → Pages → Source**, selecione **GitHub Actions**.
Detalhes em [DEPLOY.md](DEPLOY.md).
