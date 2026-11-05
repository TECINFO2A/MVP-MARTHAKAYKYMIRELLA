import DonutChart from './DonutChart'

function NewsAnalysis({ analysis, resultText, reasons, labels }) {
  if (!analysis) {
    return (
      <section className="empty-state card">
        <h1>{labels.homeCaption}</h1>
        <p>{labels.homeText}</p>
        <p>{labels.homeText2}<br />{labels.homeText3}</p>
      </section>
    )
  }

  const levelLabels = {
    confiável: labels.trustedLevel,
    atenção: labels.cautionLevel,
    falsa: labels.falseLevel,
  }
  const levelClasses = {
    confiável: 'trusted',
    atenção: 'caution',
    falsa: 'false',
  }
  const levelLabel = levelLabels[analysis.level] || labels.cautionLevel

  return (
    <section className="analysis-shell">
      <div className="analysis-chart">
        <DonutChart
          percentage={analysis.score}
          label={labels.scoreLabel}
        />

        <div className={`analysis-level level-${levelClasses[analysis.level] || 'caution'}`}>
          {levelLabel}
        </div>
      </div>

      <div className="analysis-main">
        <div className="mvp-note">{labels.analysisDisclaimer}</div>
        <div className="analysis-summary card">
          <h2>{labels.resultTitle}</h2>
          <p>{resultText}</p>
          <div className="meta-list">
            <div><span>{labels.sourceLabel}</span><strong>{analysis.source || labels.sourceUnknown}</strong></div>
            <div><span>{labels.domainLabel}</span><strong>{analysis.domain || labels.domainUnknown}</strong></div>
            <div><span>{labels.modelLabel}</span><strong>{analysis.model}</strong></div>
            <div><span>{labels.scoreLabel}</span><strong>{analysis.score}%</strong></div>
          </div>
        </div>
      </div>

      <div className="explainers">
        <section className="card explain-card">
          <h2>{labels.whyTitle}</h2>
          <ul>
            {(reasons || []).map((item, index) => (
              <li key={`${index}-${item}`}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  )
}

export default NewsAnalysis
