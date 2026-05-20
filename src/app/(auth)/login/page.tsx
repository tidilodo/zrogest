'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'recovery'>('login')
  const [recoveryMsg, setRecoveryMsg] = useState('')
  const [recoverySent, setRecoverySent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  async function handleRecovery(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setRecoveryMsg('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)
    if (error) {
      setRecoveryMsg('Erro ao enviar. Verifique o email.')
    } else {
      setRecoverySent(true)
      setRecoveryMsg(`Email enviado para ${email}. Verifique sua caixa de entrada.`)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            ZroGest
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            {mode === 'login' ? 'Gerencie todos os seus projetos' : 'Recuperar senha'}
          </p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setMode('recovery'); setError('') }}
                className="text-xs text-zinc-500 hover:text-blue-400 transition"
              >
                Esqueci minha senha
              </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRecovery} className="space-y-4">
            <input
              type="email"
              placeholder="Seu email de cadastro"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
              required
              disabled={recoverySent}
            />
            {recoveryMsg && (
              <p className={`text-sm ${recoverySent ? 'text-green-400' : 'text-red-400'}`}>
                {recoveryMsg}
              </p>
            )}
            {!recoverySent && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
            )}
            <button
              type="button"
              onClick={() => { setMode('login'); setRecoveryMsg(''); setRecoverySent(false) }}
              className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-sm transition"
            >
              ← Voltar ao login
            </button>
          </form>
        )}

        {mode === 'login' && (
          <p className="text-center text-zinc-500 text-sm mt-6">
            Não tem conta? <Link href="/register" className="text-blue-400 hover:underline">Criar conta</Link>
          </p>
        )}
      </div>
    </div>
  )
}
