# Plano em Sprints

## Sprint 0 — Kickoff & Setup do Projeto

**Objetivo:** Deixar tudo pronto para desenvolver com segurança e rapidez.

**Tarefas**

* Criar repositório e configurar Git.

  * `git init && git remote add origin <repo-url>`
  * Ativar *branch protection* no `main`.
* Estrutura inicial do monorepo (ou dois repositórios, se preferir):

  ```
  delivery-grades/
    backend/
    frontend/
    docs/
    .editorconfig
    .gitignore
    README.md
  ```
* Backend: iniciar projeto Node.

  * `cd backend && npm init -y`

  * `npm i` : instala
    * `express`:  cria rotas HTTP, middleware e gerencia requisições/respostas.
    * ` dotenv`: Variáveis de ambiente
    * ` mongoose `: Mapeia documentos do MongoDB para objetos JS, facilitando a validação, schemas e queries.
    * ` cookie-parser`: Middleware que analisa os cookies
    * ` cors `: Permite as requisições do frontend ao backend
    * `jsonwebtoken`: fBiblioteca para gerar e verificar token JWT.
  *  `npm i -D `: instala na dependencia de desenvolvedor
        * `nodemon` : monitora alterações no código e reinicia o servidor automaticamente
        * `eslint`: Analisa a estética para encontrar erros no Typescript.
        * ` prettier`: Formatador de código automático.
* Frontend: iniciar projeto (escolha 1).

  * React com Vite: `npm create vite@latest frontend -- --template react`
  * ou Next.js: `npx create-next-app@latest frontend`
  * UI: `npm i bootstrap` (ou `tailwindcss`)
* Configurar ESLint/Prettier nos dois lados (padronização).
* Escrever `README.md` com **Requisitos**, **Instalação** e **Rodando localmente**.
* Criar `.env.example` no backend:

  ```
  PORT=3000
  MONGO_URI=mongodb://localhost:27017/delivery_grades
  SESSION_SECRET=replace_me
  GOOGLE_CLIENT_ID=replace_me
  GOOGLE_CLIENT_SECRET=replace_me
  GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=replace_me@gmail.com
  SMTP_PASS=replace_me_app_password
  ```

**Critérios de aceitação**

* `npm run dev` no backend roda servidor básico (Hello World).
* Frontend sobe e exibe layout base.
* Lint/format funcionando: `npm run lint` / `npm run format`.
* README e `.env.example` completos.

**Entregáveis**

* Repositório com estrutura base.
* Pipelines locais (scripts NPM) e documentação mínima.

---

## Sprint 1 — Backend: Autenticação Google OAuth2 & Usuários

**Objetivo:** Login com Google e persistência de usuários.

**Tarefas**

* Model `User` no MongoDB (campos: `googleId`, `name`, `email`, `avatar`, `role` = `"student" | "teacher" | "admin"`, `createdAt`).
* Fluxo OAuth2:

  * Rotas: `GET /auth/google`, `GET /auth/google/callback`, `POST /auth/logout`.
  * Criar sessão ou JWT + cookie `httpOnly`.
* Middleware de autenticação (`requireAuth`) e leitura de usuário atual (`GET /me`).
* Semeadura opcional de um admin (script `npm run seed`).
* Testes básicos de rota (pode ser `supertest` ou manual via Postman/Insomnia).
* Atualizar README: **Como criar credenciais no Google Cloud** (tela OAuth, redirect URL).

**Critérios de aceitação**

* Usuário consegue logar com Google e fica autenticado.
* `GET /me` retorna dados do usuário logado.
* Logout limpa sessão/cookie.

**Entregáveis**

* Rotas de autenticação funcionando.
* Migrations/seed (se aplicável) e documentação.

---

## Sprint 2 — Frontend: Fluxo de Login/Logout & Sessão

**Objetivo:** Interface inicial e integração com backend para autenticação.

**Tarefas**

* Páginas: `Login`, `Dashboard`.
* Botão “Entrar com Google” → redireciona para `/auth/google`.
* Após callback, armazenar sessão (cookie vem do backend).
* Chamar `GET /me` para mostrar **nome** e **avatar** do usuário logado.
* Guardas de rota: se não logado, redireciona para `Login`.
* UI base (Navbar com `Login/Logout`, estado de carregamento, feedback).

**Critérios de aceitação**

* Usuário consegue logar do frontend e ver seu perfil na UI.
* Logout no frontend invalida sessão e volta para `Login`.
* Rotas protegidas funcionam (sem “flash” de conteúdo não autorizado).

**Entregáveis**

* Frontend com fluxo completo de auth.
* Documentação curta de “Como testar o login”.

---

## Sprint 3 — Backend: Domínio de Notas (Grades)

**Objetivo:** CRUD de tarefas/avaliações e notas.

**Tarefas**

* Models:

  * `Course` (opcional agora, pode ser `gradeGroup` simples).
  * `Assessment` (ex.: `title`, `description`, `dueDate`, `maxScore`).
  * `Grade` (`studentId`, `assessmentId`, `score`, `feedback`, `gradedAt`, `gradedBy`).
* Rotas (apenas para professores/admin):

  * `POST /assessments` (criar)
  * `GET /assessments` (listar)
  * `PATCH /assessments/:id` (editar)
  * `DELETE /assessments/:id` (deletar)
* Rotas de notas:

  * `POST /grades` (atribuir/atualizar nota p/ aluno)
  * `GET /grades?studentId=...` (listar do aluno logado)
  * `GET /grades/assessment/:assessmentId` (listar por avaliação)
* Middleware de autorização por **role**.
* Validações (ex.: `score <= maxScore`, campos obrigatórios).
* Testes de API (pelo menos “happy path”).

**Critérios de aceitação**

* Professor cria/edita/exclui avaliações.
* Professor lança/edita notas.
* Aluno vê apenas suas notas.
* Regras de autorização ativas.

**Entregáveis**

* Endpoints documentados (ex.: tabela no README ou `docs/api.md`).
* Scripts cURL/Insomnia export.

---

## Sprint 4 — Frontend: UI de Avaliações e Notas

**Objetivo:** Tela para professor gerenciar avaliações/notas e aluno visualizar.

**Tarefas**

* Páginas:

  * **Professor/Admin**: “Avaliações” (CRUD), “Lançar Notas” (tabela por aluno).
  * **Aluno**: “Minhas Notas” (lista com `score/maxScore`, `feedback`, `gradedAt`).
* Componentes:

  * Form de avaliação (title, dueDate, maxScore).
  * Form de nota (student, score, feedback).
  * Tabelas com paginação/ordenação simples.
* UX:

  * Estados de loading/error/success.
  * Confirmações em exclusão.

**Critérios de aceitação**

* Professor consegue gerenciar avaliações e lançar notas pela UI.
* Aluno consegue ver suas notas e feedbacks.
* Layout responsivo básico (Bootstrap/Tailwind).

**Entregáveis**

* Telas integradas ao backend.
* GIFs/prints no README para validação rápida.

---

## Sprint 5 — E-mail, Qualidade, Deploy

**Objetivo:** Notificação por e-mail, qualidade de código e publicação.

**Tarefas**

* **E-mail via SMTP**:

  * Enviar e-mail ao aluno quando nota for lançada/atualizada (assíncrono).
  * Template simples (“Você recebeu uma nova nota em X: Y/Z.”).
* Observabilidade:

  * Logger (ex.: `morgan`, `pino`), tratamento global de erros.
* Qualidade:

  * ESLint + Prettier consolidados.
  * Testes mínimos automatizados.
* Deploy:

  * **Docker** (opcional mas recomendado):

    * `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml` com Mongo.
  * Variáveis de ambiente seguras.
  * Guia de deploy (Railway/Render/Fly/GCP/AWS/Heroku-like).
* Documentação final:

  * **README** completo (setup, scripts, variáveis, screenshots).
  * **CHANGELOG.md** e **LICENSE** (se público).

**Critérios de aceitação**

* E-mail dispara ao lançar/editar nota (log de sucesso/erro).
* Build Docker roda localmente: `docker compose up`.
* Manual de deploy testado.

**Entregáveis**

* Imagens Docker + `docker-compose`.
* Documentação final e prints.

---

# Rituais e Organização (curtinho)

* **Boards**: To-Do / In-Progress / Review / Done (GitHub Projects/Taiga/Jira).
* **Branches**: `feature/*`, `fix/*`, `chore/*`. PR obrigatório para `main`.
* **Commits**: convencionais (ex.: `feat: create assessment model`).
* **Definition of Done**:

  * Código testado localmente.
  * Lint/format OK.
  * README/docs atualizados.
  * Rotas protegidas e válidas.
  * Prints/GIF (quando UI).

---

## Scripts sugeridos (exemplos)

**Backend — `package.json`**

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "lint": "eslint .",
    "format": "prettier -w .",
    "seed": "node scripts/seed.js",
    "test": "node scripts/smoke-tests.js"
  }
}
```

**Frontend — `package.json`** (Vite)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier -w ."
  }
}
```

**Docker Compose (exemplo mínimo)**

```yaml
version: "3.9"
services:
  mongo:
    image: mongo:6
    ports: ["27017:27017"]
    volumes: ["mongo_data:/data/db"]

  backend:
    build: ./backend
    env_file: ./backend/.env
    ports: ["3000:3000"]
    depends_on: ["mongo"]

  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    depends_on: ["backend"]

volumes:
  mongo_data:
```

---

