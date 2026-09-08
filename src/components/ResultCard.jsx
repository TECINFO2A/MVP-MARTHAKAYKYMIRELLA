function ResultCard({ source, date, author, reliability, clues, resultText }) {
  return (
    <section className="card result-card">
      <h2>Resultado da análise</h2>
      <p className="result-summary">{resultText}</p>

      <div className="result-grid">
        <div>
          <span className="label">Fonte</span>
          <strong>{source}</strong>
        </div>
        <div>
          <span className="label">Data</span>
          <strong>{date}</strong>
        </div>
        <div>
          <span className="label">Autor</span>
          <strong>{author}</strong>
        </div>
        <div>
          <span className="label">Confiabilidade</span>
          <strong>{reliability}</strong>
        </div>
      </div>

      <div className="clues-block">
        <span className="label">Indícios encontrados</span>
        <ul>
          {clues.map((clue) => (
            <li key={clue}>✓ {clue}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ResultCard
