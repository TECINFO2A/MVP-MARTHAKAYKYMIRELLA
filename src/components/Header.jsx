function Header({
  onSettingsClick,
  searchValue,
  onSearchChange,
  onAnalyze,
  loading,
  placeholder,
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
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="search-input"
          placeholder={placeholder}
          aria-label={placeholder || 'Pesquisar notícia'}
          required
        />
        <button type="submit" className="search-button" disabled={loading} aria-label={analyzeLabel}>
          {loading ? '⏳' : '🔍'} {loading ? loadingLabel : analyzeLabel}
        </button>
      </form>

      <button type="button" className="settings-button" onClick={onSettingsClick} aria-label={settingsLabel}>
        ⚙️
      </button>
    </header>
  )
}

export default Header
