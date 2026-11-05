# MVP-MARTHAKAYKYMIRELLA

Projeto frontend em React + Vite para análise de notícias e checagem de confiabilidade.

## Como rodar o frontend

1. Instale as dependências:
   npm install
2. Copie `.env.example` para `.env` (a configuração padrão usa o proxy local `/api`).
3. Inicie o servidor de desenvolvimento:
   npm run dev
4. Para gerar a build de produção:
   npm run build

## Como rodar o backend Python

1. Entre na pasta do backend:
   cd backend
2. Crie um ambiente virtual:
   python -m venv .venv
3. Ative o ambiente:
   .venv\Scripts\activate
4. Instale as dependências:
   pip install -r requirements.txt
5. Inicie a API:
   uvicorn app:app --reload --host 0.0.0.0 --port 8000

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
