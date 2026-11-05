import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import NewsAnalysis from './components/NewsAnalysis'
import Settings from './components/Settings'
import GamificationCard from './components/GamificationCard'
import { STORAGE_KEYS, readStorage, writeStorage } from './utils/storage'
import './App.css'

const languageOptions = [
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
]

const translations = {
  pt: {
    home: 'Página Inicial',
    settings: 'Ajustes',
    searchPlaceholder: 'Pesquise uma notícia ou cole um link...',
    analyze: 'Analisar',
    loading: 'Analisando informação...',
    resultTitle: 'Resultado da análise',
    whyTitle: 'Por que chegamos a esse resultado?',
    historyTitle: 'Histórico',
    darkMode: 'Modo noturno',
    recentSearches: 'Últimas pesquisas',
    back: 'Voltar para Página Inicial',
    theme: 'Aparência',
    language: 'Idioma',
    homeCaption: 'Analise uma notícia',
    homeText: 'Pesquise uma notícia ou cole um link para começar.',
    homeText2: 'Antes de acreditar ou compartilhar,',
    homeText3: 'verifique a informação.',
    settingsLabel: 'Ajustes',
    newsLabel: 'Pesquisar notícia',
    emptyState: 'Sem análises recentes',
    success: 'Esta notícia apresenta características semelhantes a informações verificadas por fontes confiáveis.',
    warning: 'Há sinais que exigem cuidado antes de compartilhar a informação.',
    neutral: 'A notícia precisa de mais contexto para ser avaliada com confiança.',
    evidence: 'Antes de compartilhar uma informação, pare, verifique e questione.',
    educationalTag: 'Uma porcentagem não substitui a verificação humana.',
    xpMessage: 'Você está desenvolvendo seu pensamento crítico!',
    totalXp: 'XP acumulado',
    searches: 'Pesquisas',
    hits: 'Acertos',
    hitRate: 'Taxa de acerto',
    sourceLabel: 'Fonte',
    dateLabel: 'Data',
    authorLabel: 'Autor',
    reliabilityLabel: 'Nível de confiabilidade',
    cluesLabel: 'Principais indícios encontrados',
    trueLabel: 'Verdadeiro',
    possiblyTrueLabel: 'Possivelmente verdadeiro',
    falseLabel: 'Possivelmente falso',
    unidentifiedLabel: 'Não identificado',
    analyzing: 'Analisando...',
    searchNewsLabel: 'Pesquisar notícia',
    recentSearchesSettings: 'Últimas pesquisas',
  },
  en: {
    home: 'Home',
    settings: 'Settings',
    searchPlaceholder: 'Search a news article or paste a link...',
    analyze: 'Analyze',
    loading: 'Analyzing information...',
    resultTitle: 'Analysis result',
    whyTitle: 'Why did we reach this result?',
    historyTitle: 'History',
    darkMode: 'Dark mode',
    recentSearches: 'Recent searches',
    back: 'Back to Home',
    theme: 'Appearance',
    language: 'Language',
    homeCaption: 'Analyze a news story',
    homeText: 'Search a news story or paste a link to begin.',
    homeText2: 'Before believing or sharing,',
    homeText3: 'verify the information.',
    settingsLabel: 'Settings',
    newsLabel: 'Search news',
    emptyState: 'No recent analyses',
    success: 'This news item shows characteristics similar to information verified by reliable sources.',
    warning: 'There are signs that require caution before sharing this information.',
    neutral: 'The story needs more context before it can be assessed with confidence.',
    evidence: 'Before sharing information, pause, verify and question it.',
    educationalTag: 'A percentage does not replace human verification.',
    xpMessage: 'You are developing your critical thinking!',
    totalXp: 'Accumulated XP',
    searches: 'Searches',
    hits: 'Correct answers',
    hitRate: 'Accuracy rate',
    sourceLabel: 'Source',
    dateLabel: 'Date',
    authorLabel: 'Author',
    reliabilityLabel: 'Reliability level',
    cluesLabel: 'Main signs found',
    trueLabel: 'True',
    possiblyTrueLabel: 'Possibly true',
    falseLabel: 'Possibly false',
    unidentifiedLabel: 'Unidentified',
    analyzing: 'Analyzing...',
    searchNewsLabel: 'Search news',
    recentSearchesSettings: 'Recent searches',
  },
  es: {
    home: 'Inicio',
    settings: 'Configuración',
    searchPlaceholder: 'Busca una noticia o pega un enlace...',
    analyze: 'Analizar',
    loading: 'Analizando información...',
    resultTitle: 'Resultado del análisis',
    whyTitle: '¿Por qué llegamos a este resultado?',
    historyTitle: 'Historial',
    darkMode: 'Modo nocturno',
    recentSearches: 'Últimas búsquedas',
    back: 'Volver a Inicio',
    theme: 'Apariencia',
    language: 'Idioma',
    homeCaption: 'Analiza una noticia',
    homeText: 'Busca una noticia o pega un enlace para comenzar.',
    homeText2: 'Antes de creer o compartir,',
    homeText3: 'verifica la información.',
    settingsLabel: 'Configuración',
    newsLabel: 'Buscar noticia',
    emptyState: 'Sin análisis recientes',
    success: 'Esta noticia presenta características similares a información verificada por fuentes confiables.',
    warning: 'Hay señales que requieren precaución antes de compartir la información.',
    neutral: 'La noticia necesita más contexto para evaluarse con confianza.',
    evidence: 'Antes de compartir una información, haz una pausa, verifícala y cuestiona.',
    educationalTag: 'Un porcentaje no reemplaza la verificación humana.',
    xpMessage: '¡Estás desarrollando tu pensamiento crítico!',
    totalXp: 'XP acumulado',
    searches: 'Búsquedas',
    hits: 'Aciertos',
    hitRate: 'Tasa de acierto',
    sourceLabel: 'Fuente',
    dateLabel: 'Fecha',
    authorLabel: 'Autor',
    reliabilityLabel: 'Nivel de confiabilidad',
    cluesLabel: 'Principales indicios encontrados',
    trueLabel: 'Verdadero',
    possiblyTrueLabel: 'Posiblemente verdadero',
    falseLabel: 'Posiblemente falso',
    unidentifiedLabel: 'No identificado',
    analyzing: 'Analizando...',
    searchNewsLabel: 'Buscar noticia',
    recentSearchesSettings: 'Últimas búsquedas',
  },
}

const defaultStats = {
  xp: 425,
  researches: 8,
  hits: 6,
}

function buildDateLabel(date, lang) {
  const localeMap = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES',
  }

  return new Intl.DateTimeFormat(localeMap[lang] || 'pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function extractDomain(value) {
  const text = String(value || '').trim()
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?([a-z0-9.-]+\.[a-z]{2,})(?:\/|$)/i)

  if (!match) {
    return ''
  }

  return match[1].toLowerCase().replace(/^www\./, '')
}

function createAnalysis(input, lang) {
  const rawText = String(input || '')
  const text = rawText.trim().toLowerCase()
  const seed = text.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
  const domain = extractDomain(rawText)

  const suspiciousWords = [
    'viral',
    'alerta',
    'revelado',
    'surpreendente',
    'exclusivo',
    'urgente',
    'compartilhe',
    'rumor',
    'fake',
    'misterioso',
    'sem confirmação',
    'sem prova',
    'não foi verificado',
    'milagroso',
    'todo mundo está falando',
    'sem fontes',
    'seu amigo mandou',
    'apenas no whatsapp',
    'me diga se vocês viram',
    'isso é verdade',
  ]

  const trustedWords = [
    'oficial',
    'relatório',
    'fontes',
    'confirmado',
    'dados',
    'estudo',
    'documento',
    'declaração',
    'agência',
    'instituto',
    'reportagem',
    'verificado',
    'evidência',
    'publicado',
    'notícia',
    'pesquisa',
    'análise',
    'conferiu',
    'comprovação',
    'demonstra',
    'apresentou',
    'dados oficiais',
  ]

  const trustedDomains = [
    'gov',
    'governo',
    'bbc',
    'reuters',
    'apnews',
    'nytimes',
    'globo',
    'g1',
    'folha',
    'estadao',
    'cnn',
    'nasa',
    'who',
    'uol',
    'terra',
    'exame',
    'correio',
    'jornaldocomercio',
  ]

  const suspiciousDomains = [
    'whatsapp',
    'facebook',
    'instagram',
    'twitter',
    'x.com',
    'tiktok',
    'telegram',
    'youtube',
    'blogspot',
    'wordpress',
    'medium',
    'livejournal',
  ]

  const hasUrl = /(https?:\/\/|www\.)/i.test(rawText)
  const hasExcessiveCaps = /[A-Z]{5,}/.test(rawText)
  const hasSourceReference = /(fonte|fontes|agência|instituto|ministério|governo|empresa|portal|reportagem|oficial)/i.test(rawText)
  const hasExplicitFakeSignal = /(fake|falsa|mentira|rumor|desinformação|hoax)/i.test(text)
  const isLikelySocialShare = /(whatsapp|telegram|facebook|instagram|twitter|x\.com|tiktok|grupo de whatsapp|compartilhado|mandei para vocês)/i.test(text)

  const domainCredibility = (() => {
    if (!domain) {
      return 0
    }

    const host = domain.split('.').slice(0, -1).join('.') || domain
    const isTrustedDomain = trustedDomains.some((item) => domain.includes(item) || host.includes(item))
    const isSuspiciousDomain = suspiciousDomains.some((item) => domain.includes(item) || host.includes(item))

    if (isTrustedDomain) return 3
    if (isSuspiciousDomain) return -4
    if (domain.endsWith('.com') || domain.endsWith('.net') || domain.endsWith('.org')) return -1

    return 0
  })()

  const suspiciousScore = suspiciousWords.reduce(
    (total, word) => total + (text.includes(word) ? 1 : 0),
    0,
  ) + (hasUrl ? 2 : 0) + (hasExcessiveCaps ? 2 : 0) + (isLikelySocialShare ? 3 : 0) + (domainCredibility < 0 ? 2 : 0)

  const trustedScore = trustedWords.reduce(
    (total, word) => total + (text.includes(word) ? 1 : 0),
    0,
  ) + (hasSourceReference ? 3 : 0) + (domainCredibility > 0 ? 4 : 0)

  const balance = trustedScore * 12 - suspiciousScore * 14 + domainCredibility * 6
  const variance = (seed % 19) - 9
  let percentage = 50 + balance + variance

  if (hasExplicitFakeSignal && suspiciousScore >= 2) {
    percentage -= 25
  }

  if (trustedScore >= 4 && suspiciousScore <= 1) {
    percentage += 22
  }

  if (suspiciousScore >= 4 && trustedScore === 0) {
    percentage -= 30
  }

  percentage = Math.max(8, Math.min(94, percentage))

  const truePercentage = Math.max(8, Math.min(92, Math.round(percentage)))
  const falsePercentage = Math.max(8, Math.min(72, Math.round((100 - truePercentage) * 0.7)))
  const unidentifiedPercentage = Math.max(0, 100 - truePercentage - falsePercentage)

  let result = translations[lang].trueLabel
  let reliability = 'Alta'
  let resultText = translations[lang].success

  if (percentage < 70) {
    result = translations[lang].possiblyTrueLabel
    reliability = lang === 'en' ? 'Medium' : lang === 'es' ? 'Media' : 'Média'
    resultText = translations[lang].warning
  }

  if (percentage < 45) {
    result = translations[lang].falseLabel
    reliability = lang === 'en' ? 'Low' : lang === 'es' ? 'Baja' : 'Baixa'
    resultText = translations[lang].neutral
  }

  const localizedContent = {
    pt: {
      source: 'Portal de Notícias',
      author: 'Redação',
      clues: ['Fonte identificada', 'Data identificada', 'Informações comparáveis'],
      reasons: [
        'Fonte identificada e verificável.',
        'Data da publicação está clara e consistente.',
        'Informações podem ser comparadas com fontes de checagem.',
        'Há sinais de desinformação que exigem atenção antes do compartilhamento.',
      ],
    },
    en: {
      source: 'News portal',
      author: 'Editorial team',
      clues: ['Source identified', 'Date identified', 'Comparable information'],
      reasons: [
        'The source was identified and can be checked.',
        'The publication date is clear and consistent.',
        'The information can be compared with fact-checking sources.',
        'There are signs of misinformation that require attention before sharing.',
      ],
    },
    es: {
      source: 'Portal de noticias',
      author: 'Redacción',
      clues: ['Fuente identificada', 'Fecha identificada', 'Información comparable'],
      reasons: [
        'La fuente fue identificada y se puede verificar.',
        'La fecha de publicación es clara y consistente.',
        'La información se puede comparar con fuentes de verificación.',
        'Hay señales de desinformación que requieren atención antes de compartir.',
      ],
    },
  }[lang]

  const sourceLabel = domain ? domain : localizedContent.source

  return {
    percentage,
    truePercentage,
    falsePercentage,
    unidentifiedPercentage,
    result,
    source: sourceLabel,
    date: buildDateLabel(new Date(), lang),
    author: localizedContent.author,
    reliability,
    clues: localizedContent.clues,
    reasons: localizedContent.reasons,
    resultText,
    educationalNote: translations[lang].evidence,
    origin: domain || 'input-text',
  }
}

function App() {
  const [theme, setTheme] = useState(() => readStorage(STORAGE_KEYS.theme, 'light'))
  const [language, setLanguage] = useState(() => {
    const storedLanguage = readStorage(STORAGE_KEYS.language, 'pt')
    return translations[storedLanguage] ? storedLanguage : 'pt'
  })
  const [screen, setScreen] = useState('home')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [history, setHistory] = useState(() => readStorage(STORAGE_KEYS.history, []))
  const [stats, setStats] = useState(() => readStorage(STORAGE_KEYS.stats, defaultStats))
  const languageRef = useRef(language)

  const text = useMemo(() => translations[language] || translations.pt, [language])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.theme, theme)
  }, [theme])

  useEffect(() => {
    languageRef.current = language
    writeStorage(STORAGE_KEYS.language, language)
  }, [language])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.history, history)
  }, [history])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.stats, stats)
  }, [stats])

  useEffect(() => {
    document.body.style.background = theme === 'dark' ? '#2B0D18' : '#FFF9FB'
  }, [theme])

  const handleAnalyze = () => {
    const sanitizedQuery = query.trim()
    if (!sanitizedQuery) return

    setLoading(true)

    window.setTimeout(() => {
      const nextAnalysis = createAnalysis(sanitizedQuery, languageRef.current)
      const nextHistory = [
        {
          id: `${Date.now()}`,
          date: nextAnalysis.date,
          percentage: nextAnalysis.percentage,
          result: nextAnalysis.result,
          truePercentage: nextAnalysis.truePercentage,
          falsePercentage: nextAnalysis.falsePercentage,
          unidentifiedPercentage: nextAnalysis.unidentifiedPercentage,
          source: nextAnalysis.source,
          author: nextAnalysis.author,
        },
        ...history,
      ].slice(0, 3)

      setAnalysis(nextAnalysis)
      setHistory(nextHistory)
      setStats((previousStats) => {
        const nextResearches = (previousStats.researches ?? 0) + 1
        const nextHits = (previousStats.hits ?? 0) + (nextAnalysis.percentage >= 70 ? 1 : 0)
        return {
          xp: (previousStats.xp ?? 0) + 85,
          researches: nextResearches,
          hits: nextHits,
        }
      })
      setLoading(false)
      setScreen('home')
    }, 1000)
  }

  const handleThemeToggle = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage)
  }

  const totalXp = stats.xp ?? defaultStats.xp
  const hitRate = stats.researches ? Math.round((stats.hits / stats.researches) * 100) : 0

  if (screen === 'settings') {
    return (
      <div className={`app-shell ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
        <Settings
          theme={theme}
          onThemeToggle={handleThemeToggle}
          language={language}
          onLanguageChange={handleLanguageChange}
          history={history}
          onBack={() => setScreen('home')}
          themeLabel={text.darkMode}
          darkModeLabel="Modo noturno"
          lightModeLabel="Modo claro"
          languageLabel={text.language}
          languageOptions={languageOptions}
          recentSearchesLabel={text.recentSearchesSettings || text.recentSearches}
          backButtonLabel={text.back}
        />
      </div>
    )
  }

  return (
    <div className={`app-shell ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <main className="page-shell">
        <Header
          onSettingsClick={() => setScreen('settings')}
          searchValue={query}
          onSearchChange={setQuery}
          onAnalyze={handleAnalyze}
          loading={loading}
          placeholder={text.searchPlaceholder}
          analyzeLabel={text.analyze}
          loadingLabel={text.analyzing}
          settingsLabel={text.settingsLabel}
        />

        <section className="dashboard">
          {loading && (
            <div className="loading-banner card">
              <span className="loading-spinner" aria-hidden="true" />
              {text.loading}
            </div>
          )}

          {!loading && !analysis && (
            <section className="empty-state card">
              <h1>{text.homeCaption}</h1>
              <p>{text.homeText}</p>
              <p>
                {text.homeText2}
                <br />
                {text.homeText3}
              </p>
            </section>
          )}

          {!loading && analysis && (
            <>
              <NewsAnalysis
                analysis={analysis}
                resultText={analysis.resultText}
                summary={analysis.resultText}
                reasons={analysis.reasons}
                education={analysis.educationalNote}
                labels={text}
              />

              <section className="bottom-grid">
                <GamificationCard
                  xp={85}
                  totalXp={totalXp}
                  researches={stats.researches}
                  hits={stats.hits}
                  hitRate={hitRate}
                  labels={text}
                />

                <section className="card history-card">
                  <h2>{text.historyTitle}</h2>
                  <div className="history-list">
                    {history.length === 0 && <p>{text.emptyState}</p>}
                    {history.map((item) => (
                      <div key={item.id} className="history-item">
                        <div className="mini-donut" style={{ background: `conic-gradient(#d81b60 ${item.percentage}%, #f3d6e0 0)` }}>
                          <span>{item.percentage}%</span>
                        </div>
                        <div className="history-info">
                          <strong>{item.percentage}%</strong>
                          <span>{item.date}</span>
                          <small>{item.result}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </section>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
