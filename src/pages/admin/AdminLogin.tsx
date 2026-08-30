import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react'
import { supabase } from '../../utils/supabaseClient'

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    try {
      // 1. Attempt Supabase Auth Sign In
      if (email.includes('@')) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (!error && data?.session) {
          localStorage.setItem('adminToken', data.session.access_token)
          navigate('/admin/pos')
          return
        }
      }

      // 2. Fallback to default local admin credentials ('admin' / 'admin123' or 'admin@jana.com')
      if (
        (email === 'admin' || email === 'admin@jana.com' || email === 'admin@janafibreglass.com') &&
        password === 'admin123'
      ) {
        const token = 'mock-admin-token-' + Date.now()
        localStorage.setItem('adminToken', token)
        navigate('/admin/pos')
        return
      }

      setErrorMsg('Invalid email or password. Please verify your credentials.')
    } catch (err: any) {
      console.error('Login error:', err)
      setErrorMsg(err.message || 'Authentication failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex items-center justify-center p-4">
      {/* Centered Light-Theme Login Card */}
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl p-8 space-y-6 text-left relative overflow-hidden">
        
        {/* Decorative ambient gradients */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header & Brand Logo */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Box className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-mono font-bold uppercase tracking-wider">
              Protected Portal
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              JANA Admin Login
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage website content, 3D POS orders, and customer CRM.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Email / Username</span>
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@jana.com or admin"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-900 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-900 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Authenticate Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Info Footnote */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Auth Enabled</span>
          </div>
          <span>Default: admin / admin123</span>
        </div>

      </div>
    </div>
  )
}

export default AdminLogin
