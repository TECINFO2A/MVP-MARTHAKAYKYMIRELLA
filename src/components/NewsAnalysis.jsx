import DonutChart from './DonutChart'

function NewsAnalysis({ analysis, resultText, reasons, education, labels }) {
  if (!analysis) {
    return (
      <section className="empty-state card">
        <h1>{labels.homeCaption}</h1>
        <p>{labels.homeText}</p>
        <p>{labels.homeText2}<br />{labels.homeText3}</p>
      </section>
    )
  }

  return (
    <section className="analysis-shell">
      <div className="analysis-chart">
        <DonutChart
          percentage={analysis.percentage}
          truePercentage={analysis.truePercentage}
          falsePercentage={analysis.falsePercentage}
          unidentifiedPercentage={analysis.unidentifiedPercentage}
          label={labels.resultIndex}
        />

        <div className="legend">
          <div className="legend-item">
            <span className="dot true" />
            <div>
              <strong>{labels.possiblyTrueLabel}</strong>
              <span>{analysis.truePercentage}%</span>
            </div>
          </div>
          <div className="legend-item">
            <span className="dot false" />
            <div>
              <strong>{labels.falseLabel}</strong>
              <span>{analysis.falsePercentage}%</span>
            </div>
          </div>
          <div className="legend-item">
            <span className="dot unidentified" />
            <div>
              <strong>{labels.unverifiedLabel}</strong>
              <span>{analysis.unidentifiedPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analysis-main">
        <div className="mvp-note">{labels.limitation}</div>
        <div className="analysis-summary card">
          <h2>{labels.resultTitle}</h2>
          <p className="analysis-result"><strong>{analysis.result}</strong></p>
          <p className="analysis-true-score">
            <strong>{labels.trueLabel}:</strong> {analysis.truePercentage}%
          </p>
          <p>{resultText}</p>
          <div className="meta-list">
            <div><span>{labels.sourceLabel}</span><strong>{analysis.source}</strong></div>
            <div><span>{labels.dateLabel}</span><strong>{analysis.date}</strong></div>
            <div><span>{labels.authorLabel}</span><strong>{analysis.author}</strong></div>
            <div><span>{labels.reliabilityLabel}</span><strong>{analysis.reliability}</strong></div>
          </div>
          <div className="analysis-clues">
            <span>{labels.cluesLabel}</span>
            <ul>
              {analysis.clues.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="explainers">
        <section className="card explain-card">
          <h2>{labels.whyTitle}</h2>
          <ul>
            {reasons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{education}</p>
        </section>
      </div>
    </section>
  )
}

export default NewsAnalysis
