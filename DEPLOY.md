# Deploy no GitHub Pages

## Como o Astro chega ao GitHub Pages

O GitHub Pages **não executa o Astro**. Ele só serve arquivos estáticos (HTML, CSS, JS, imagens).
Quem executa o Astro é o **GitHub Actions**, uma vez a cada push, para gerar esses arquivos.

```
push na master
   └─► GitHub Actions (.github/workflows/deploy.yml)
         ├─ npm ci          → instala as dependências
         ├─ npm run build   → o Astro gera a pasta dist/ com HTML pronto
         ├─ upload-pages-artifact → empacota a dist/
         └─ deploy-pages    → publica no GitHub Pages
                                  └─► https://leandrogelain.github.io serve os arquivos estáticos
```

O projeto usa o modo estático do Astro (`output: "static"`, o padrão), então **não há servidor Node em produção**.
O build gera um arquivo por rota, por exemplo:

- `dist/index.html` → `/`
- `dist/sobre/index.html` → `/sobre/`
- `dist/en/work/dponet/index.html` → `/en/work/dponet/`

Tudo que é dinâmico roda no navegador, com JavaScript mínimo embutido nas páginas:

- animação de digitação do hero e menu mobile;
- descriptografia dos cases protegidos (Web Crypto API do navegador);
- envio do formulário de contato, direto para o Formspree.

Para ver exatamente o que vai ser publicado, rode `npm run build` e abra a pasta `dist/`.

## Configuração única no GitHub

No repositório: **Settings → Pages → Build and deployment → Source** → selecione **GitHub Actions**.

Sem isso, o Pages continua servindo os arquivos da raiz da `master` (o site antigo) e ignora o build.

## Acompanhar um deploy

Aba **Actions** do repositório → workflow **Deploy to GitHub Pages**.
Também dá para disparar manualmente pelo botão **Run workflow** (`workflow_dispatch`).

## Senhas e cases protegidos

- O `.env` (senhas) e `src/content/protected/` (texto claro) estão no `.gitignore` e **nunca vão para o GitHub**.
- O build no Actions **não precisa de senha**: ele publica só o payload já criptografado em `src/data/encrypted/*.json`.
- Ao alterar um case protegido, rode `npm run encrypt-cases` localmente e commite os JSONs gerados.
