'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [parts, setParts] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (i: number, val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    const next = [...parts];
    next[i] = clean;
    setParts(next);
    if (clean.length === 4 && i < 3) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && parts[i] === '' && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const raw = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (raw.length === 0) return;
    // Distribui em blocos de 4
    const blocks = [raw.slice(0, 4), raw.slice(4, 8), raw.slice(8, 12), raw.slice(12, 16)];
    setParts(blocks);
    // Foca no último campo preenchido ou no 4º
    const lastFilled = blocks.filter(b => b.length === 4).length;
    refs[Math.min(lastFilled, 3)].current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const serial = `${parts[0]}-${parts[1]}-${parts[2]}-${parts[3]}`;
    if (parts.some(p => p.length !== 4)) {
      setError('Preencha todos os campos do serial.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serial }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Acesso negado.');
      } else {
        router.push('/0V3R/dashboard');
      }
    } catch {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex justify-center mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#E10600] flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-tight">O</span>
          </div>
        </div>

        <h1 className="text-white text-xl font-semibold text-center mb-1">Acesso restrito</h1>
        <p className="text-white/30 text-sm text-center mb-8">Insira o serial de acesso</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Serial inputs */}
          <div className="flex items-center gap-2 justify-center">
            {parts.map((part, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  ref={refs[i]}
                  value={part}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  maxLength={4}
                  spellCheck={false}
                  className="w-16 h-12 bg-[#111] border border-white/10 rounded-lg text-center text-white font-mono text-sm tracking-widest focus:outline-none focus:border-[#E10600]/60 focus:bg-[#E10600]/5 transition-all uppercase"
                  placeholder="XXXX"
                />
                {i < 3 && <span className="text-white/20 text-lg select-none">–</span>}
              </div>
            ))}
          </div>

          {error && (
            <p className="text-[#E10600] text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E10600] text-white rounded-lg font-medium text-sm hover:bg-[#b00500] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
