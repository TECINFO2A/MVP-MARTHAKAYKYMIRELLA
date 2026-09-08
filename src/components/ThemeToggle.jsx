function ThemeToggle({ theme, onToggle, lightLabel, darkLabel }) {
  return (
    <button type="button" className="toggle-theme" onClick={onToggle} aria-label={theme === 'dark' ? darkLabel : lightLabel}>
      <span className="toggle-knob" aria-hidden="true" />
      <span className="toggle-labels">
        <span className={theme === 'light' ? 'active' : ''}>☀️ {lightLabel}</span>
        <span className={theme === 'dark' ? 'active' : ''}>🌙 {darkLabel}</span>
      </span>
    </button>
  )
}

export default ThemeToggle
