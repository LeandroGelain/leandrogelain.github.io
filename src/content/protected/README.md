# Cases protegidos (texto claro — fora do git)

Tudo nesta pasta, exceto este README, está no `.gitignore`.

1. Crie `{slug}.pt.md` e `{slug}.en.md` (mesmo formato de `src/content/projects/`, com `summary`, `cover` opcional e as seções `## ...` no corpo).
2. Em `src/content/projects/{slug}.{pt,en}.md`, mantenha só os metadados públicos e `protected: true`.
3. Defina `PROJECT_PW_{SLUG}` no `.env`.
4. Rode `npm run encrypt-cases`. O resultado criptografado vai para `src/data/encrypted/` e **esse** é o arquivo que se commita.

Imagens referenciadas aqui (caminho relativo a esta pasta) são embutidas como data-URI dentro do payload criptografado. Não coloque essas imagens em `public/`.
