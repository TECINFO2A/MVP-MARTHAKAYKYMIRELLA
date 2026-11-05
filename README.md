# MVP-MARTHAKAYKYMIRELLA

Projeto frontend em React + Vite para análise de notícias e checagem de confiabilidade.

## Como rodar o frontend

1. Instale as dependências:
   npm install
2. Inicie o servidor de desenvolvimento:
   npm run dev
3. Para gerar a build de produção:
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
  "score": 87.5,
  "level": "confiável",
  "reasons": [
    "Pistas de credibilidade: relatórios, fontes, dados.",
    "O domínio parece ser de uma fonte confiável."
  ],
  "source": "www.gov.br",
  "domain": "www.gov.br",
  "model": "xlm-roberta-base"
}

## Observações

- O projeto compila corretamente com Vite.
- O backend usa Hugging Face Transformers e aceita um modelo configurável por variáveis de ambiente.
- O padrão é `xlm-roberta-base`, mas um modelo fine-tuned em fake news pode ser substituído via `MODEL_NAME`.
- Recomendado verificar as dependências com `npm audit` para tratar vulnerabilidades reportadas.
