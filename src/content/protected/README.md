# Cases protegidos (texto claro — fora do git)

Tudo nesta pasta, exceto este README, está no `.gitignore`.

1. Crie `{slug}.pt.md` e `{slug}.en.md` (mesmo formato de `src/content/projects/`, com `summary`, `cover` opcional e as seções `## ...` no corpo).
2. Em `src/content/projects/{slug}.{pt,en}.md`, mantenha só os metadados públicos e `protected: true`.
3. Defina `PROJECT_PW_{SLUG}` no `.env`.
4. Rode `npm run encrypt-cases`. O resultado criptografado vai para `src/data/encrypted/` e **esse** é o arquivo que se commita.

## Botão de download

- `download: <url>`: link fixo.
- `release: owner/repo`: arquivo da **release mais recente** do GitHub, consultada no navegador depois do desbloqueio. Uma versão nova publicada no repositório aparece sozinha no case, sem criptografar de novo. `releaseAsset` é a regex do nome do arquivo (padrão `\.exe$`) e `{version}` no `downloadNote` vira a tag da release.
  - Repositório privado: defina `PROJECT_RELEASE_TOKEN_{SLUG}` no `.env` com um token **fine-grained, só de leitura (Contents: Read-only) e só do repositório de releases**. Ele vai dentro do payload criptografado, então quem tem a senha do case consegue extraí-lo.
  - O download passa pelo service worker `public/download-sw.js` (o GitHub não libera CORS no arquivo da release privada).
  - Quando o token expirar, o botão mostra "Download indisponível": gere outro, troque no `.env`, rode `npm run encrypt-cases` e commite. O script mostra a data de expiração a cada execução.

`downloadLabel` e `downloadNote` valem para os dois.

Imagens referenciadas aqui (caminho relativo a esta pasta) são embutidas como data-URI dentro do payload criptografado. Não coloque essas imagens em `public/`.
