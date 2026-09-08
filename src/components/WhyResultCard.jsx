function WhyResultCard({ reasons, motto }) {
  return (
    <section className="card why-card">
      <h2>Por que chegamos a esse resultado?</h2>
      <ul className="why-list">
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <p className="educational-note">{motto}</p>
    </section>
  )
}

export default WhyResultCard
