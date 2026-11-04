function GamificationCard({ xp, totalXp, researches, labels }) {
  return (
    <section className="card gamification-card">
      <div className="xp-row">
        <span className="xp-badge">+{xp} XP</span>
      </div>
      <p className="xp-message">{labels.xpMessage}</p>

      <div className="stats-grid">
        <div className="mini-stat">
          <span>{labels.totalXp}</span>
          <strong>{totalXp} XP</strong>
        </div>
        <div className="mini-stat">
          <span>{labels.searches}</span>
          <strong>{researches}</strong>
        </div>
      </div>
    </section>
  )
}

export default GamificationCard
