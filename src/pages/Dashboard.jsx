import { useNavigate } from 'react-router-dom'
import { useTransactions } from '../context/TransactionContext'

const QUICK_CONTACTS = [
  { name: 'Sarah J.', emoji: '👩' },
  { name: 'Mark D.', emoji: '👨' },
  { name: 'Emily C.', emoji: '👩' },
  { name: 'James W.', emoji: '🧑' },
]

function fmt(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { transactions, balance, loading } = useTransactions()

  const recent = transactions.slice(0, 5)

  const totalSent = transactions
    .filter(t => t.type === 'debit')
    .reduce((s, t) => s + t.amount, 0)

  const totalReceived = transactions
    .filter(t => t.type === 'credit')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <>
      {/* Balance card */}
      <div className="balance-card">
        <div className="balance-label">PayPal Balance</div>
        <div className="balance-amount">{fmt(balance)}</div>
        <div className="balance-actions">
          <button className="btn-action btn-action-primary" onClick={() => navigate('/send')}>
            Send Money
          </button>
          <button className="btn-action btn-action-outline" onClick={() => navigate('/history')}>
            View Activity
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-label">Sent This Month</div>
          <div className="stat-value">{fmt(totalSent)}</div>
          <div className="stat-change down">↑ 12% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📥</div>
          <div className="stat-label">Received</div>
          <div className="stat-value">{fmt(totalReceived)}</div>
          <div className="stat-change up">↑ 8% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-label">Transactions</div>
          <div className="stat-value">{transactions.length}</div>
          <div className="stat-change up">+3 this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-label">Linked Cards</div>
          <div className="stat-value">2</div>
          <div className="stat-change" style={{ color: 'var(--pp-text-light)' }}>Visa, Mastercard</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Recent Transactions */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Recent Activity</span>
            <button className="btn-text" onClick={() => navigate('/history')}>View all</button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--pp-text-light)', padding: '20px 0' }}>Loading…</p>
          ) : (
            <ul className="tx-list">
              {recent.map(tx => (
                <li key={tx.id} className="tx-item">
                  <div className="tx-avatar">{tx.emoji}</div>
                  <div className="tx-info">
                    <div className="tx-name">{tx.name}</div>
                    <div className="tx-date">{fmtDate(tx.date)} · {tx.note}</div>
                  </div>
                  <span className={`tx-badge badge-${tx.status}`}>{tx.status}</span>
                  <div className={`tx-amount ${tx.type === 'credit' ? 'credit' : 'debit'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Send */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Quick Send</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {QUICK_CONTACTS.map(c => (
              <button
                key={c.name}
                onClick={() => navigate('/send', { state: { recipient: c.name } })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 8,
                  border: '1px solid var(--pp-border)', background: '#fff',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--pp-light-gray)'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <div className="user-avatar" style={{ width: 34, height: 34, fontSize: 14 }}>
                  {c.emoji}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</span>
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            style={{ marginTop: 16, fontSize: 14 }}
            onClick={() => navigate('/send')}
          >
            + New Payment
          </button>
        </div>
      </div>
    </>
  )
}
