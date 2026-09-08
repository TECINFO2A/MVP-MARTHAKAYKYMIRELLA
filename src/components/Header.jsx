function Header({ onSettingsClick, searchValue, onSearchChange, onAnalyze, loading, placeholder, analyzeLabel, loadingLabel, settingsLabel }) {
  return (
    <header className="topbar">
      <div className="logo-block" aria-label="Verifica+ logo">
        <div className="logo-mark">VERIFICA+</div>
        <span className="logo-subtitle">Pense. Verifique. Compartilhe.</span>
      </div>

      <div className="search-panel">
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="search-input"
          placeholder={placeholder}
          aria-label={placeholder || 'Pesquisar notícia'}
        />
        <button type="button" className="search-button" onClick={onAnalyze} disabled={loading} aria-label={analyzeLabel}>
          {loading ? '⏳' : '🔍'} {loading ? loadingLabel : analyzeLabel}
        </button>
      </div>

      <button type="button" className="settings-button" onClick={onSettingsClick} aria-label={settingsLabel}>
        ⚙️
      </button>
    </header>
  )
}

export default Header
