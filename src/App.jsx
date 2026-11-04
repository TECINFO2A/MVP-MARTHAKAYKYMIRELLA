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
    alertIndex: 'Sinais de alerta',
    noAlertLabel: 'Sem sinal detectado',
    alertLabel: 'Com sinais de alerta',
    unverifiedLabel: 'Não verificado',
    unknownSource: 'Não identificada',
    unknownMetadata: 'Não informado',
    linkNotRead: 'O link não foi aberto nem comparado com fontes de checagem. Cole o texto completo da notícia para analisar sinais de alerta.',
    alertsFound: 'A análise encontrou sinais de alerta na linguagem. Isso recomenda cautela, mas não confirma que a notícia seja falsa.',
    noAlertsFound: 'Não foram encontrados sinais comuns de alerta na linguagem. Isso não comprova que a notícia seja verdadeira.',
    noTextClue: 'O texto não contém padrões comuns de linguagem sensacionalista ou urgente.',
    limitation: 'Esta análise automática procura padrões no texto; não verifica os fatos em fontes externas. Links não são abertos.',
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
    alertIndex: 'Warning signs',
    noAlertLabel: 'No signs detected',
    alertLabel: 'Warning signs found',
    unverifiedLabel: 'Unverified',
    unknownSource: 'Not identified',
    unknownMetadata: 'Not provided',
    linkNotRead: 'The link was not opened or checked against fact-checking sources. Paste the full article text to analyze warning signs.',
    alertsFound: 'The analysis found warning signs in the wording. This calls for caution but does not confirm the story is false.',
    noAlertsFound: 'No common warning signs were found in the wording. This does not prove the story is true.',
    noTextClue: 'The text contains no common sensational or urgent wording patterns.',
    limitation: 'This automated analysis looks for text patterns; it does not verify facts against external sources. Links are not opened.',
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
    alertIndex: 'Señales de alerta',
    noAlertLabel: 'Sin señales detectadas',
    alertLabel: 'Con señales de alerta',
    unverifiedLabel: 'Sin verificar',
    unknownSource: 'No identificada',
    unknownMetadata: 'No informado',
    linkNotRead: 'El enlace no se abrió ni se comparó con fuentes de verificación. Pega el texto completo de la noticia para analizar señales de alerta.',
    alertsFound: 'El análisis encontró señales de alerta en el lenguaje. Esto recomienda cautela, pero no confirma que la noticia sea falsa.',
    noAlertsFound: 'No se encontraron señales comunes de alerta en el lenguaje. Esto no demuestra que la noticia sea verdadera.',
    noTextClue: 'El texto no contiene patrones comunes de lenguaje sensacionalista o urgente.',
    limitation: 'Este análisis automático busca patrones en el texto; no verifica los hechos con fuentes externas. Los enlaces no se abren.',
  },
}

const defaultStats = {
  xp: 425,
  researches: 8,
}

const alertPatterns = {
  pt: [
    { pattern: /\b(compartilhe|espalhe).{0,35}\b(apaguem|apagar|censura)\b/, clue: 'Pedido de compartilhamento urgente ou antes de uma suposta censura.' },
    { pattern: /\b(nao querem que voce saiba|estao escondendo a verdade|midia esconde)\b/, clue: 'Alegação de conspiração sem evidência apresentada.' },
    { pattern: /\b(cura garantida|cura milagrosa|100\s*%\s*eficaz|resultado garantido)\b/, clue: 'Promessa absoluta ou de cura garantida.' },
    { pattern: /\b(urgente|chocante|inacreditavel|bomba|exclusivo)\b/, clue: 'Linguagem sensacionalista ou de urgência.' },
  ],
  en: [
    { pattern: /\b(share|forward).{0,35}\b(before they delete|before it is deleted|censored)\b/, clue: 'Urgent request to share or claim of suppression.' },
    { pattern: /\b(they dont want you to know|hiding the truth|media is hiding)\b/, clue: 'Conspiracy claim without evidence presented.' },
    { pattern: /\b(guaranteed cure|miracle cure|100\s*%\s*effective|guaranteed results)\b/, clue: 'Absolute promise or guaranteed cure.' },
    { pattern: /\b(urgent|shocking|unbelievable|breaking|exclusive)\b/, clue: 'Sensational or urgent wording.' },
  ],
  es: [
    { pattern: /\b(comparte|difunde).{0,35}\b(antes de que lo borren|censura)\b/, clue: 'Solicitud urgente para compartir o afirmación de censura.' },
    { pattern: /\b(no quieren que sepas|estan ocultando la verdad|los medios ocultan)\b/, clue: 'Afirmación de conspiración sin pruebas presentadas.' },
    { pattern: /\b(cura garantizada|cura milagrosa|100\s*%\s*eficaz|resultado garantizado)\b/, clue: 'Promesa absoluta o de cura garantizada.' },
    { pattern: /\b(urgente|impactante|increible|bomba|exclusivo)\b/, clue: 'Lenguaje sensacionalista o urgente.' },
  ],
}

function createAnalysis(input, lang) {
  const text = String(input || '').trim()
  const normalizedText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const locale = translations[lang] ? lang : 'pt'
  const patterns = alertPatterns[locale]
  const clues = patterns
    .filter(({ pattern }) => pattern.test(normalizedText))
    .map(({ clue }) => clue)
  const urlMatch = text.match(/https?:\/\/[^\s]+|www\.[^\s]+/i)
  let source = translations[locale].unknownSource

  if (urlMatch) {
    try {
      source = new URL(urlMatch[0].startsWith('www.') ? `https://${urlMatch[0]}` : urlMatch[0]).hostname.replace(/^www\./, '')
    } catch {
      source = translations[locale].unknownSource
    }
  }

  const linkOnly = Boolean(urlMatch && text.replace(urlMatch[0], '').trim().length === 0)
  const falsePercentage = linkOnly ? 0 : clues.length ? Math.min(35 + clues.length * 20, 85) : 0
  const unidentifiedPercentage = 100 - falsePercentage
  const result = falsePercentage ? translations[locale].falseLabel : translations[locale].unidentifiedLabel

  if (!clues.length && !linkOnly) clues.push(translations[locale].noTextClue)

  return {
    percentage: falsePercentage,
    truePercentage: 0,
    falsePercentage,
    unidentifiedPercentage,
    result,
    source,
    date: translations[locale].unknownMetadata,
    author: translations[locale].unknownMetadata,
    reliability: lang === 'en' ? 'Low' : lang === 'es' ? 'Baja' : 'Baixa',
    clues,
    reasons: [...clues, translations[locale].limitation],
    resultText: linkOnly
      ? translations[locale].linkNotRead
      : falsePercentage
        ? translations[locale].alertsFound
        : translations[locale].noAlertsFound,
    educationalNote: translations[locale].evidence,
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
        return {
          xp: (previousStats.xp ?? 0) + 85,
          researches: nextResearches,
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
