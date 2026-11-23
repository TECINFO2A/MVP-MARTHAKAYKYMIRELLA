import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import NewsAnalysis from './components/NewsAnalysis'
import Settings from './components/Settings'
import GamificationCard from './components/GamificationCard'
import { STORAGE_KEYS, readStorage, writeStorage } from './utils/storage'
import { analyzeNews } from './utils/newsApi'
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
    titleLabel: 'Título da notícia',
    articleTextLabel: 'Texto da notícia',
    urlLabel: 'URL da notícia (opcional)',
    inputHelp: 'A API analisa o conteúdo informado; ela não abre nem extrai o texto do link.',
    analyze: 'Analisar',
    loading: 'Analisando informação...',
    apiError: 'Não foi possível analisar a notícia.',
    resultTitle: 'Resultado da análise',
    scoreLabel: 'Score de confiabilidade',
    trustedLevel: 'Confiável',
    cautionLevel: 'Atenção',
    falseLevel: 'Possivelmente falsa',
    analysisDisclaimer: 'Análise automatizada experimental. Não confirma fatos nem substitui checagem jornalística.',
    domainLabel: 'Domínio informado',
    domainUnknown: 'Não identificado',
    sourceUnknown: 'Não informada',
    modelLabel: 'Sistema de análise',
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
    trustedSummary: 'A API classificou o conteúdo como confiável segundo os sinais analisados.',
    cautionSummary: 'A API encontrou sinais mistos ou insuficientes. Verifique a notícia em outras fontes.',
    falseSummary: 'A API encontrou sinais preocupantes. Confirme a informação antes de compartilhar.',
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
    titleLabel: 'News title',
    articleTextLabel: 'News text',
    urlLabel: 'News URL (optional)',
    inputHelp: 'The API analyzes the provided text; it does not open or extract content from the link.',
    analyze: 'Analyze',
    loading: 'Analyzing information...',
    apiError: 'Could not analyze the news item.',
    resultTitle: 'Analysis result',
    scoreLabel: 'Reliability score',
    trustedLevel: 'Reliable',
    cautionLevel: 'Caution',
    falseLevel: 'Possibly false',
    analysisDisclaimer: 'Experimental automated analysis. It does not confirm facts or replace journalistic fact-checking.',
    domainLabel: 'Provided domain',
    domainUnknown: 'Not identified',
    sourceUnknown: 'Not provided',
    modelLabel: 'Analysis system',
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
    trustedSummary: 'The API classified the content as reliable based on the signals analyzed.',
    cautionSummary: 'The API found mixed or insufficient signals. Check the story against other sources.',
    falseSummary: 'The API found concerning signals. Verify the information before sharing.',
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
    titleLabel: 'Título de la noticia',
    articleTextLabel: 'Texto de la noticia',
    urlLabel: 'URL de la noticia (opcional)',
    inputHelp: 'La API analiza el texto proporcionado; no abre ni extrae contenido del enlace.',
    analyze: 'Analizar',
    loading: 'Analizando información...',
    apiError: 'No se pudo analizar la noticia.',
    resultTitle: 'Resultado del análisis',
    scoreLabel: 'Puntuación de confiabilidad',
    trustedLevel: 'Confiable',
    cautionLevel: 'Precaución',
    falseLevel: 'Posiblemente falsa',
    analysisDisclaimer: 'Análisis automatizado experimental. No confirma hechos ni sustituye la verificación periodística.',
    domainLabel: 'Dominio indicado',
    domainUnknown: 'No identificado',
    sourceUnknown: 'No indicada',
    modelLabel: 'Sistema de análisis',
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
    trustedSummary: 'La API clasificó el contenido como confiable según las señales analizadas.',
    cautionSummary: 'La API encontró señales mixtas o insuficientes. Verifica la noticia en otras fuentes.',
    falseSummary: 'La API encontró señales preocupantes. Confirma la información antes de compartirla.',
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

function App() {
  const [theme, setTheme] = useState(() => readStorage(STORAGE_KEYS.theme, 'light'))
  const [language, setLanguage] = useState(() => {
    const storedLanguage = readStorage(STORAGE_KEYS.language, 'pt')
    return translations[storedLanguage] ? storedLanguage : 'pt'
  })
  const [screen, setScreen] = useState('home')
  const [title, setTitle] = useState('')
  const [articleText, setArticleText] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [history, setHistory] = useState(() => readStorage(STORAGE_KEYS.history, []))
  const [stats, setStats] = useState(() => readStorage(STORAGE_KEYS.stats, defaultStats))

  const text = useMemo(() => translations[language] || translations.pt, [language])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.theme, theme)
  }, [theme])

  useEffect(() => {
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

  const handleAnalyze = async (event) => {
    event.preventDefault()
    if (loading) return

    setAnalysisError('')
    setAnalysis(null)
    setLoading(true)

    try {
      const response = await analyzeNews({
        title: title.trim(),
        text: articleText.trim(),
        url: url.trim(),
      })
      const nextAnalysis = {
        ...response,
        score: Number(response.score),
        resultText: {
          confiável: text.trustedSummary,
          atenção: text.cautionSummary,
          falsa: text.falseSummary,
        }[response.level] || text.cautionSummary,
      }

      setAnalysis(nextAnalysis)
      setHistory((previousHistory) => [
        {
          id: `${Date.now()}`,
          date: new Intl.DateTimeFormat(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR').format(new Date()),
          percentage: nextAnalysis.score,
          result: nextAnalysis.level,
          source: nextAnalysis.source,
        },
        ...previousHistory,
      ].slice(0, 3))
      setStats((previousStats) => {
        const nextResearches = (previousStats.researches ?? 0) + 1
        const nextHits = (previousStats.hits ?? 0) + (nextAnalysis.score >= 75 ? 1 : 0)
        return {
          xp: (previousStats.xp ?? 0) + 85,
          researches: nextResearches,
          hits: nextHits,
        }
      })
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : text.apiError)
    } finally {
      setLoading(false)
      setScreen('home')
    }
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
          title={title}
          onTitleChange={setTitle}
          articleText={articleText}
          onArticleTextChange={setArticleText}
          url={url}
          onUrlChange={setUrl}
          onAnalyze={handleAnalyze}
          loading={loading}
          titleLabel={text.titleLabel}
          textLabel={text.articleTextLabel}
          urlLabel={text.urlLabel}
          inputHelp={text.inputHelp}
          analyzeLabel={text.analyze}
          loadingLabel={text.analyzing}
          settingsLabel={text.settingsLabel}
        />

        <section className="dashboard">
          {analysisError && (
            <div className="analysis-error card" role="alert">
              {analysisError}
            </div>
          )}

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
                reasons={analysis.reasons}
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
