function DonutChart({ percentage, truePercentage, falsePercentage, unidentifiedPercentage, size = 220, compact = false }) {
  const radius = compact ? 32 : 72
  const circumference = 2 * Math.PI * radius
  const dashTrue = (truePercentage / 100) * circumference
  const dashFalse = (falsePercentage / 100) * circumference
  const dashUnidentified = (unidentifiedPercentage / 100) * circumference

  return (
    <div className={`donut-wrapper ${compact ? 'compact' : ''}`}>
      <svg viewBox="0 0 200 200" className="donut-svg" width={size} height={size}>
        <circle cx="100" cy="100" r={radius} className="donut-base" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="donut-segment true"
          strokeDasharray={`${dashTrue} ${circumference - dashTrue}`}
          strokeDashoffset={0}
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="donut-segment false"
          strokeDasharray={`${dashFalse} ${circumference - dashFalse}`}
          strokeDashoffset={-dashTrue}
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="donut-segment unidentified"
          strokeDasharray={`${dashUnidentified} ${circumference - dashUnidentified}`}
          strokeDashoffset={-(dashTrue + dashFalse)}
        />
      </svg>

      <div className="donut-center">
        <div className="donut-percent">{percentage}%</div>
        {!compact && <div className="donut-label">Índice de confiabilidade</div>}
      </div>
    </div>
  )
}

export default DonutChart
