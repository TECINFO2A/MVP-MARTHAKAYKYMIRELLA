function SearchBar({ value, onChange, onAnalyze, loading, placeholder, analyzeLabel }) {
  return (
    <div className="searchbar-wrap">
      <label className="sr-only" htmlFor="news-search">
        {placeholder}
      </label>
      <input
        id="news-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="searchbar-input"
        aria-label={placeholder}
      />
      <button type="button" className="primary-button" onClick={onAnalyze} disabled={loading}>
        {loading ? '⏳' : '🔍'} {loading ? 'Analisando...' : analyzeLabel}
      </button>
    </div>
  )
}

export default SearchBar
