import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'
import SearchHistory from './SearchHistory'

function Settings({
  theme,
  onThemeToggle,
  language,
  onLanguageChange,
  history,
  onBack,
  themeLabel,
  darkModeLabel,
  lightModeLabel,
  languageLabel,
  languageOptions,
  recentSearchesLabel,
  backButtonLabel,
}) {
  return (
    <main className="settings-screen">
      <div className="settings-shell">
        <button type="button" className="back-button" onClick={onBack}>
          ← {backButtonLabel}
        </button>

        <div className="settings-grid">
          <section className="card settings-card">
            <h2>{themeLabel}</h2>
            <ThemeToggle
              theme={theme}
              onToggle={onThemeToggle}
              lightLabel={lightModeLabel}
              darkLabel={darkModeLabel}
            />
          </section>

          <section className="card settings-card">
            <h2>{languageLabel}</h2>
            <LanguageSelector value={language} onChange={onLanguageChange} options={languageOptions} />
          </section>
        </div>

        <section className="card settings-card recent-card">
          <h2>{recentSearchesLabel}</h2>
          <SearchHistory items={history} />
        </section>
      </div>
    </main>
  )
}

export default Settings
