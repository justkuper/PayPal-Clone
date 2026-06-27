import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { register, confirmCode } = useAuth()

  const [step, setStep] = useState('form') // 'form' | 'confirm'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'At least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  async function handleRegister(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')

    try {
      await register(form.email, form.password, form.name)
      setStep('confirm')
    } catch (err) {
      setApiError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm(e) {
    e.preventDefault()
    if (!code.trim()) { setErrors({ code: 'Verification code is required' }); return }

    setLoading(true)
    setApiError('')

    try {
      await confirmCode(form.email, code)
      navigate('/login')
    } catch (err) {
      setApiError(err.message || 'Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function change(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      setErrors(er => ({ ...er, [field]: '' }))
    }
  }

  if (step === 'confirm') {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="logo-text">Pay<span>Pal</span></div>
          </div>

          <h2 className="auth-title">Verify your email</h2>
          <p style={{ fontSize: 14, color: 'var(--pp-text-light)', marginBottom: 24 }}>
            We sent a 6-digit code to <strong>{form.email}</strong>
          </p>

          {apiError && <div className="alert alert-error">{apiError}</div>}

          <form onSubmit={handleConfirm}>
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value); setErrors({}) }}
                className={errors.code ? 'error' : ''}
                placeholder="123456"
                maxLength={6}
                autoComplete="one-time-code"
              />
              {errors.code && <p className="form-error">{errors.code}</p>}
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify Email'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?{' '}
            <button className="btn-link" onClick={() => navigate('/login')}>Log In</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-text">Pay<span>Pal</span></div>
        </div>

        <h2 className="auth-title">Create your account</h2>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleRegister} noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={change('name')}
              className={errors.name ? 'error' : ''}
              placeholder="Jane Smith"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={change('email')}
              className={errors.email ? 'error' : ''}
              placeholder="you@example.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={change('password')}
              className={errors.password ? 'error' : ''}
              placeholder="Min. 8 characters"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={change('confirm')}
              className={errors.confirm ? 'error' : ''}
              placeholder="Repeat password"
            />
            {errors.confirm && <p className="form-error">{errors.confirm}</p>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{' '}
          <button className="btn-link" onClick={() => navigate('/login')}>Log In</button>
        </div>
      </div>
    </div>
  )
}
