/**
 * Transaction context — wraps Amplify DataStore/GraphQL.
 * Falls back to localStorage-backed mock data so the UI works
 * before the backend is deployed.
 */
import { createContext, useContext, useState, useEffect } from 'react'
import { generateClient } from 'aws-amplify/api'

const TransactionContext = createContext(null)

// ---- Mock data used when no real backend is wired up ----
const MOCK_TRANSACTIONS = [
  { id: '1', type: 'credit', name: 'Sarah Johnson', email: 'sarah@example.com', amount: 250.00, note: 'Dinner split 🍕', date: '2026-06-26', status: 'completed', emoji: '👩' },
  { id: '2', type: 'debit',  name: 'Netflix',        email: 'billing@netflix.com', amount: 15.99,  note: 'Monthly subscription', date: '2026-06-25', status: 'completed', emoji: '🎬' },
  { id: '3', type: 'credit', name: 'Mark Davis',     email: 'mark@example.com',   amount: 80.00,  note: 'Concert tickets',      date: '2026-06-24', status: 'completed', emoji: '👨' },
  { id: '4', type: 'debit',  name: 'Amazon',         email: 'orders@amazon.com',  amount: 129.99, note: 'Electronics order',    date: '2026-06-23', status: 'completed', emoji: '📦' },
  { id: '5', type: 'credit', name: 'Emily Chen',     email: 'emily@example.com',  amount: 45.50,  note: 'Uber share',           date: '2026-06-22', status: 'completed', emoji: '👩' },
  { id: '6', type: 'debit',  name: 'Spotify',        email: 'billing@spotify.com', amount: 9.99,  note: 'Monthly subscription', date: '2026-06-21', status: 'pending',   emoji: '🎵' },
  { id: '7', type: 'credit', name: 'James Wilson',   email: 'james@example.com',  amount: 320.00, note: 'Rent split',           date: '2026-06-20', status: 'completed', emoji: '🏠' },
  { id: '8', type: 'debit',  name: 'Whole Foods',    email: 'wf@wholefds.com',    amount: 67.43,  note: 'Grocery run',          date: '2026-06-19', status: 'completed', emoji: '🛒' },
]

const STORAGE_KEY = 'pp_clone_transactions'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : MOCK_TRANSACTIONS
  } catch {
    return MOCK_TRANSACTIONS
  }
}

function saveToStorage(txs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txs))
}

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(2847.50)

  useEffect(() => {
    // Try to load from Amplify; fall back to local mock
    loadTransactions()
  }, [])

  async function loadTransactions() {
    setLoading(true)
    try {
      // If you have a real GraphQL API set up, replace below with:
      // const client = generateClient()
      // const result = await client.graphql({ query: listTransactions })
      // setTransactions(result.data.listTransactions.items)
      const data = loadFromStorage()
      setTransactions(data)
      const bal = data.reduce((acc, tx) => tx.type === 'credit' ? acc + tx.amount : acc - tx.amount, 2847.50)
      setBalance(parseFloat(bal.toFixed(2)))
    } catch (err) {
      console.error('Failed to load transactions:', err)
      setTransactions(MOCK_TRANSACTIONS)
    } finally {
      setLoading(false)
    }
  }

  async function sendMoney({ recipient, amount, note }) {
    const newTx = {
      id: Date.now().toString(),
      type: 'debit',
      name: recipient,
      email: recipient.includes('@') ? recipient : `${recipient.toLowerCase().replace(/\s/g, '')}@example.com`,
      amount: parseFloat(amount),
      note: note || 'Payment',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      emoji: '💸',
    }

    try {
      // Real Amplify call would go here:
      // const client = generateClient()
      // await client.graphql({ query: createTransaction, variables: { input: newTx } })
      const updated = [newTx, ...transactions]
      setTransactions(updated)
      saveToStorage(updated)
      setBalance(prev => parseFloat((prev - newTx.amount).toFixed(2)))
      return newTx
    } catch (err) {
      console.error('Send money failed:', err)
      throw err
    }
  }

  return (
    <TransactionContext.Provider value={{ transactions, loading, balance, sendMoney, reload: loadTransactions }}>
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactions = () => useContext(TransactionContext)
