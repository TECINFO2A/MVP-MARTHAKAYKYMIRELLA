function SearchHistory({ items }) {
  return (
    <div className="history-list">
      {items.map((item) => (
        <div key={item.id} className="history-item">
          <div className="history-donut-wrap">
            <div className="mini-donut" style={{ '--value': item.percentage }}>
              <span>{item.percentage}%</span>
            </div>
          </div>
          <div className="history-info">
            <strong>{item.percentage}%</strong>
            <span>{item.date}</span>
            <small>{item.result}</small>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SearchHistory
