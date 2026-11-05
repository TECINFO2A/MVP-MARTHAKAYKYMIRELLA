import os
import re
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title='News Trust API', version='1.0.0')

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        'ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=['GET', 'POST'],
    allow_headers=['Content-Type'],
)

MODEL_NAME = os.getenv('MODEL_NAME', '').strip()
model_pipeline = None

if MODEL_NAME:
    try:
        from transformers import pipeline

        model_pipeline = pipeline(
            'text-classification',
            model=MODEL_NAME,
            tokenizer=MODEL_NAME,
            device=-1,
        )
    except Exception:
        import logging

        logging.getLogger(__name__).exception(
            'Could not load the configured Transformers model: %s',
            MODEL_NAME,
        )


class NewsInput(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    text: str = Field(..., min_length=1, max_length=20000)
    url: Optional[str] = None


class NewsAnalysisResult(BaseModel):
    score: float
    level: str
    reasons: List[str]
    source: str
    domain: str
    model: str


def extract_domain(url: Optional[str]) -> str:
    if not url:
        return 'input-text'

    match = re.search(r'https?://(?:www\.)?([^/\s]+)', url, flags=re.IGNORECASE)
    if not match:
        return 'input-text'

    return match.group(1).lower()


def normalize_text(value: str) -> str:
    return re.sub(r'\s+', ' ', value or '').strip().lower()


def score_with_rules(title: str, text: str, url: Optional[str]) -> tuple[float, List[str], str]:
    combined = f'{title} {text}'.strip()
    normalized = normalize_text(combined)
    domain = extract_domain(url)

    suspicious_patterns = [
        'viral', 'alerta', 'revelado', 'surpreendente', 'urgente', 'compartilhe',
        'rumor', 'fake', 'mentira', 'sem confirmação', 'sem prova', 'milagroso',
        'compartilhado por', 'me diga se vocês viram', 'apenas no whatsapp'
    ]

    trusted_patterns = [
        'oficial', 'relatório', 'fontes', 'confirmado', 'documento', 'dados',
        'estudo', 'agência', 'instituto', 'ministério', 'pesquisa', 'verificado',
        'evidência', 'publicado', 'declaração', 'reportagem'
    ]

    trusted_domains = {
        'gov', 'bbc.com', 'reuters.com', 'apnews.com', 'nytimes.com', 'globo.com',
        'g1.globo.com', 'folha.uol.com.br', 'estadao.com.br', 'cnn.com', 'who.int',
        'nasa.gov', 'uol.com.br', 'terra.com.br', 'exame.com.br'
    }

    suspicious_domains = {
        'whatsapp.com', 'telegram.org', 'facebook.com', 'instagram.com', 'twitter.com',
        'x.com', 'tiktok.com', 'blogspot.com', 'wordpress.com', 'medium.com'
    }

    reasons: List[str] = []
    score = 50.0

    suspicious_hits = [p for p in suspicious_patterns if p in normalized]
    trusted_hits = [p for p in trusted_patterns if p in normalized]

    if suspicious_hits:
        score -= min(28, len(suspicious_hits) * 7)
        reasons.append(f'Pistas de desinformação detectadas: {", ".join(suspicious_hits[:3])}.')
    else:
        reasons.append('Nenhuma pista clara de desinformação foi detectada no texto.')

    if trusted_hits:
        score += min(30, len(trusted_hits) * 8)
        reasons.append(f'Pistas de credibilidade: {", ".join(trusted_hits[:3])}.')

    has_url = bool(url and 'http' in url.lower())
    if has_url:
        source = domain if domain and domain != 'input-text' else 'URL informada'
        reasons.append(f'Fonte/URL detectada: {source}.')
        if domain:
            if any(d in domain for d in trusted_domains):
                score += 18
                reasons.append('O domínio parece ser de uma fonte confiável.')
            elif any(d in domain for d in suspicious_domains):
                score -= 20
                reasons.append('O domínio parece ser um canal de compartilhamento social, que exige mais cuidado.')
            elif domain.endswith('.com') or domain.endswith('.org'):
                score -= 5
                reasons.append('O domínio não é claramente institucional, então a verificação deve ser mais cautelosa.')
    else:
        source = 'texto livre'

    if re.search(r'\b[A-Z]{5,}\b', title or ''):
        score -= 6
        reasons.append('Uso excessivo de letras maiúsculas sugere tom alarmista.')

    if re.search(r'(fake|falsa|mentira|rumor|hoax|desinformação)', normalized):
        score -= 12
        reasons.append('O texto menciona sinais explícitos de desinformação.')

    score = max(0.0, min(100.0, score))
    return score, reasons[:5], source if has_url else 'texto livre'


def classify_level(score: float) -> str:
    if score >= 75:
        return 'confiável'
    if score >= 45:
        return 'atenção'
    return 'falsa'


def get_model_signal(title: str, text: str) -> Optional[float]:
    if model_pipeline is None:
        return None

    payload = f'{title}. {text}'[:512]
    try:
        result = model_pipeline(payload)
        if isinstance(result, list) and result:
            first = result[0]
            if isinstance(first, dict):
                label = first.get('label', '').upper()
                confidence = float(first.get('score', 0.0))
                if 'FAKE' in label or 'NEGATIVE' in label or 'UNSAFE' in label:
                    return max(0.0, 50.0 - (confidence * 100.0))
                if 'REAL' in label or 'POSITIVE' in label or 'SAFE' in label:
                    return min(100.0, 50.0 + (confidence * 100.0))
                return confidence * 100.0
    except Exception:
        return None

    return None


@app.get('/health')
def healthcheck() -> dict:
    return {
        'status': 'ok',
        'model': MODEL_NAME if model_pipeline else 'heuristic-rules',
    }


@app.post('/analyze', response_model=NewsAnalysisResult)
def analyze_news(payload: NewsInput) -> NewsAnalysisResult:
    score, reasons, source = score_with_rules(payload.title, payload.text, payload.url)
    model_signal = get_model_signal(payload.title, payload.text)

    if model_signal is not None:
        score = (score * 0.75) + (model_signal * 0.25)

    score = max(0.0, min(100.0, score))
    level = classify_level(score)

    if len(reasons) == 0:
        reasons = ['Não foi possível identificar sinais suficientes para avaliar a notícia.']

    return NewsAnalysisResult(
        score=round(score, 2),
        level=level,
        reasons=reasons,
        source=source,
        domain=extract_domain(payload.url),
        model=MODEL_NAME if model_pipeline else 'heuristic-rules',
    )
