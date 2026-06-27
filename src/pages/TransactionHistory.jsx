import { useState, useMemo } from 'react'
import { useTransactions } from '../context/TransactionContext'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TransactionHistory() {
  const { transactions, loading } = useTransactions()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch =
        tx.name.toLowerCase().includes(search.toLowerCase()) ||
        tx.note.toLowerCase().includes(search.toLowerCase()) ||
        tx.email.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'all' || tx.type === typeFilter
      const matchStatus = statusFilter === 'all' || tx.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [transactions, search, typeFilter, statusFilter])

  const totalSent = filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const totalReceived = filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Transaction History</h1>
        <p className="page-subtitle">{transactions.length} total transactions</p>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--pp-text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>
            Filtered Sent
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pp-red)' }}>{fmt(totalSent)}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--pp-text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>
            Filtered Received
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pp-green)' }}>{fmt(totalReceived)}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--pp-text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>
            Showing
          </div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{filtered.length} / {transactions.length}</div>
        </div>
      </div>

      <div className="card">
        {/* Filters */}
        <div className="filter-bar">
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search by name, note, or email…"
          />
          <select
            className="filter-select"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="credit">Received</option>
            <option value="debit">Sent</option>
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {loading ? (
          <p style={{ color: 'var(--pp-text-light)', padding: '40px 0', textAlign: 'center' }}>Loading transactions…</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No transactions match your filters</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Date</th>
                  <th>Note</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'var(--pp-light-gray)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, flexShrink: 0,
                          }}
                        >
                          {tx.emoji}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{tx.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--pp-text-light)' }}>{tx.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--pp-text-light)', whiteSpace: 'nowrap' }}>
                      {fmtDate(tx.date)}
                    </td>
                    <td style={{ color: 'var(--pp-text-light)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.note}
                    </td>
                    <td>
                      <span className={`tx-badge badge-${tx.status}`}>{tx.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`tx-amount ${tx.type === 'credit' ? 'credit' : 'debit'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
