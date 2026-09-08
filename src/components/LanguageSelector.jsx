function LanguageSelector({ value, onChange, options }) {
  return (
    <div className="language-selector" role="group" aria-label="Seletor de idioma">
      {options.map((option) => (
        <button
          key={option.code}
          type="button"
          className={`language-option ${value === option.code ? 'selected' : ''}`}
          onClick={() => onChange(option.code)}
          aria-pressed={value === option.code}
        >
          {option.flag} {option.label}
        </button>
      ))}
    </div>
  )
}

export default LanguageSelector
