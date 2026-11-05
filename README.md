# MVP-MARTHAKAYKYMIRELLA

Projeto frontend em React + Vite para análise de notícias e checagem de confiabilidade.

## Como rodar o projeto no Windows

O frontend e o backend rodam em terminais separados. Mantenha os dois terminais abertos enquanto usar o projeto.

## Publicação

O frontend é publicado no [GitHub Pages](https://tecinfo2a.github.io/MVP-MARTHAKAYKYMIRELLA/) pelo workflow em `.github/workflows/deploy.yml`. A API FastAPI é hospedada separadamente no Render. O workflow define `VITE_API_URL` durante a build para que o botão de análise use a API publicada; o backend deve permitir a origem `https://tecinfo2a.github.io` em `ALLOWED_ORIGINS`.

### Terminal 1: backend

No PowerShell, a partir da pasta do projeto:

```powershell
cd backend
py -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Deixe esse comando rodando. A API não abre uma janela do navegador; para conferir se está ativa, acesse http://127.0.0.1:8000/docs.

### Terminal 2: frontend

Abra outro PowerShell na pasta do projeto (a pasta que contém `package.json`) e execute:

```powershell
npm.cmd run dev
```

Use `npm.cmd` no PowerShell se `npm run dev` for bloqueado pela política de execução de scripts. Acesse o endereço mostrado pelo Vite, normalmente http://localhost:5173.

Para instalar as dependências do frontend caso necessário, execute `npm.cmd install` nessa mesma pasta. Para gerar a build de produção, execute `npm.cmd run build`.

## Como rodar o backend Python

O comando acima pressupõe que as dependências do backend já foram instaladas. Para prepará-las:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Depois, inicie a API com `py -m uvicorn app:app --reload --host 127.0.0.1 --port 8000` a partir da pasta `backend`.

### Exemplo de requisição

POST http://localhost:8000/analyze

{
  "title": "Relatório da agência confirma nova medida",
  "text": "A agência oficial publicou um relatório com dados e fontes confirmadas sobre a medida deste ano.",
  "url": "https://www.gov.br/noticia"
}

### Resposta esperada

{
  "score": 98.0,
  "level": "confiável",
  "reasons": [
    "Pistas de credibilidade: oficial, relatório, fontes.",
    "O domínio parece ser de uma fonte confiável."
  ],
  "source": "gov.br",
  "domain": "gov.br",
  "model": "heuristic-rules"
}

## Observações

- O projeto compila corretamente com Vite.
- O frontend envia título, texto e URL para `POST /analyze` e mostra score, classificação, fonte e motivos.
- A URL é analisada como metadado; o backend não abre a página nem extrai o texto automaticamente.
- Sem `MODEL_NAME`, a API informa que está usando regras heurísticas. `xlm-roberta-base` sozinho não é um classificador de notícias falsas; configure `MODEL_NAME` apenas com um modelo fine-tuned para classificação com rótulos compatíveis.
- Para produção, configure `VITE_API_URL` com a URL base do backend e `ALLOWED_ORIGINS` no backend com a origem do site.
- Recomendado verificar as dependências com `npm audit` para tratar vulnerabilidades reportadas.
