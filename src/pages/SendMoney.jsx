import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTransactions } from '../context/TransactionContext'

const QUICK_AMOUNTS = [10, 25, 50, 100, 200, 500]
const FEE_RATE = 0.029 // 2.9%

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function SendMoney() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sendMoney, balance } = useTransactions()

  const [recipient, setRecipient] = useState(location.state?.recipient || '')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [quickAmt, setQuickAmt] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [sentTx, setSentTx] = useState(null)

  const numAmount = parseFloat(amount) || 0
  const fee = numAmount > 0 ? parseFloat((numAmount * FEE_RATE).toFixed(2)) : 0
  const total = numAmount + fee

  function validate() {
    const e = {}
    if (!recipient.trim()) e.recipient = 'Recipient is required'
    if (!amount || numAmount <= 0) e.amount = 'Enter a valid amount'
    else if (numAmount < 1) e.amount = 'Minimum send is $1.00'
    else if (total > balance) e.amount = 'Insufficient balance'
    return e
  }

  function handleQuickAmount(amt) {
    setAmount(amt.toString())
    setQuickAmt(amt)
    setErrors(e => ({ ...e, amount: '' }))
  }

  function handleAmountChange(e) {
    const v = e.target.value
    if (v === '' || /^\d*\.?\d{0,2}$/.test(v)) {
      setAmount(v)
      setQuickAmt(null)
      setErrors(er => ({ ...er, amount: '' }))
    }
  }

  async function handleSend(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const tx = await sendMoney({ recipient, amount: numAmount, note })
      setSentTx(tx)
      setShowSuccess(true)
    } catch (err) {
      setErrors({ api: 'Payment failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setRecipient('')
    setAmount('')
    setNote('')
    setQuickAmt(null)
    setErrors({})
    setShowSuccess(false)
    setSentTx(null)
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Send Money</h1>
        <p className="page-subtitle">Transfer funds instantly to anyone</p>
      </div>

      <form onSubmit={handleSend} noValidate>
        <div className="send-layout">
          {/* Left — form */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pp-text-light)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                Amount
              </div>

              <div className="amount-input-wrap">
                <span className="amount-prefix">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  className={`amount-input${errors.amount ? ' error' : ''}`}
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  style={errors.amount ? { borderColor: 'var(--pp-red)' } : {}}
                />
              </div>
              {errors.amount && <p className="form-error" style={{ marginBottom: 12 }}>{errors.amount}</p>}

              <div className="quick-amounts">
                {QUICK_AMOUNTS.map(a => (
                  <button
                    key={a}
                    type="button"
                    className={`btn-quick${quickAmt === a ? ' active' : ''}`}
                    onClick={() => handleQuickAmount(a)}
                  >
                    ${a}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pp-text-light)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                Recipient
              </div>
              <input
                type="text"
                className="recipient-input"
                value={recipient}
                onChange={e => { setRecipient(e.target.value); setErrors(er => ({ ...er, recipient: '' })) }}
                placeholder="Email, phone, or name"
                style={errors.recipient ? { borderColor: 'var(--pp-red)' } : {}}
              />
              {errors.recipient && <p className="form-error" style={{ marginBottom: 12 }}>{errors.recipient}</p>}

              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pp-text-light)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Note (optional)
              </div>
              <textarea
                className="note-input"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="What's it for? 🍕"
                maxLength={200}
              />
              <div style={{ fontSize: 12, color: 'var(--pp-text-light)', textAlign: 'right' }}>{note.length}/200</div>

              {errors.api && <div className="alert alert-error" style={{ marginTop: 12 }}>{errors.api}</div>}
            </div>
          </div>

          {/* Right — summary */}
          <div className="send-summary card">
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Payment Summary</div>
            <div style={{ fontSize: 12, color: 'var(--pp-text-light)', marginBottom: 16 }}>
              Available balance: {fmt(balance)}
            </div>

            <div className="summary-row">
              <span>Send amount</span>
              <span>{numAmount > 0 ? fmt(numAmount) : '—'}</span>
            </div>
            <div className="summary-row">
              <span>Processing fee (2.9%)</span>
              <span>{fee > 0 ? fmt(fee) : '—'}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span style={{ color: 'var(--pp-blue)' }}>{total > 0 ? fmt(total) : '—'}</span>
            </div>

            <button
              type="submit"
              className="btn-send"
              disabled={loading || !amount || !recipient}
            >
              {loading ? 'Processing…' : `Send ${numAmount > 0 ? fmt(numAmount) : ''}`}
            </button>

            <p style={{ fontSize: 11, color: 'var(--pp-text-light)', textAlign: 'center', marginTop: 12 }}>
              🔒 Payments are protected by PayPal Purchase Protection
            </p>
          </div>
        </div>
      </form>

      {/* Success modal */}
      {showSuccess && sentTx && (
        <div className="modal-overlay" onClick={reset}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">✅</div>
            <div className="modal-title">Payment Sent!</div>
            <div className="modal-subtitle">
              You sent <strong>{fmt(sentTx.amount)}</strong> to <strong>{sentTx.name}</strong>
            </div>
            <button className="btn-primary" onClick={() => navigate('/history')}>View History</button>
            <button className="btn-secondary" style={{ marginTop: 8 }} onClick={reset}>Send Another</button>
          </div>
        </div>
      )}
    </>
  )
}
