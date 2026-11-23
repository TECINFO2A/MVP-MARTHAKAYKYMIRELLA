function SearchBar({ value, onChange, onAnalyze, loading, placeholder, analyzeLabel }) {
  return (
    <form
      className="searchbar-wrap"
      onSubmit={(event) => {
        event.preventDefault()
        onAnalyze()
      }}
    >
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
      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? '⏳' : '🔍'} {loading ? 'Analisando...' : analyzeLabel}
      </button>
    </form>
  )
}

export default SearchBar
