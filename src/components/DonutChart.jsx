function DonutChart({ percentage, label, size = 220 }) {
  const radius = 72
  const circumference = 2 * Math.PI * radius
  const safePercentage = Number.isFinite(Number(percentage))
    ? Math.min(Math.max(Number(percentage), 0), 100)
    : 0
  const dashScore = (safePercentage / 100) * circumference

  return (
    <div className="donut-wrapper">
      <svg viewBox="0 0 200 200" className="donut-svg" width={size} height={size}>
        <circle cx="100" cy="100" r={radius} className="donut-base" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="donut-segment true"
          strokeDasharray={`${dashScore} ${circumference - dashScore}`}
          strokeDashoffset={0}
        />
      </svg>

      <div className="donut-center">
        <div className="donut-percent">{safePercentage}%</div>
        <div className="donut-label">{label}</div>
      </div>
    </div>
  )
}

export default DonutChart
