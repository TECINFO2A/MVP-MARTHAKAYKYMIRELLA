function Header({
  onSettingsClick,
  title,
  onTitleChange,
  articleText,
  onArticleTextChange,
  url,
  onUrlChange,
  onAnalyze,
  loading,
  titleLabel,
  textLabel,
  urlLabel,
  inputHelp,
  analyzeLabel,
  loadingLabel,
  settingsLabel,
}) {
  return (
    <header className="topbar">
      <div className="logo-block" aria-label="Verifica+ logo">
        <div className="logo-mark">VERIFICA+</div>
        <span className="logo-subtitle">Pense. Verifique. Compartilhe.</span>
      </div>

      <form className="search-panel" onSubmit={onAnalyze}>
        <label className="news-field">
          <span>{titleLabel}</span>
          <input
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="search-input"
            maxLength={300}
            required
          />
        </label>
        <label className="news-field article-field">
          <span>{textLabel}</span>
          <textarea
            value={articleText}
            onChange={(event) => onArticleTextChange(event.target.value)}
            className="search-input article-input"
            maxLength={20000}
            required
          />
        </label>
        <label className="news-field url-field">
          <span>{urlLabel}</span>
          <input
            type="url"
            value={url}
            onChange={(event) => onUrlChange(event.target.value)}
            className="search-input"
          />
        </label>
        <div className="input-actions">
          <span className="input-help">{inputHelp}</span>
          <button type="submit" className="search-button" disabled={loading} aria-label={analyzeLabel}>
            {loading ? '⏳' : '🔍'} {loading ? loadingLabel : analyzeLabel}
          </button>
        </div>
      </form>

      <button type="button" className="settings-button" onClick={onSettingsClick} aria-label={settingsLabel}>
        ⚙️
      </button>
    </header>
  )
}

export default Header
