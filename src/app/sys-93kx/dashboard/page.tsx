'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'portfolio' | 'testimonials' | 'blog' | 'pricing';

/* ─── helpers ─────────────────────────────────────────────── */
function toast(msg: string, type: 'ok' | 'err' = 'ok') {
  const el = document.createElement('div');
  el.className = `fixed bottom-6 right-6 z-[999] px-4 py-3 rounded-xl text-sm font-medium shadow-xl transition-all ${
    type === 'ok' ? 'bg-[#E10600] text-white' : 'bg-[#1a1a1a] text-red-400 border border-red-500/30'
  }`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ─── Modal ───────────────────────────────────────────────── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-white font-semibold">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-white/50 text-xs font-medium uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#E10600]/50 placeholder-white/20";

/* ─── Portfolio ────────────────────────────────────────────── */
function PortfolioTab() {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<null | 'new' | any>(null);
  const [form, setForm] = useState({ title: '', category: '', description: '', imageUrl: '', videoUrl: '', projectUrl: '', featured: false, order: 0 });
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const uploadVideo = async (file: File) => {
    setUploadingVideo(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      if (r.ok) { const { url } = await r.json(); setForm(f => ({ ...f, videoUrl: url })); toast('Vídeo enviado!'); }
      else toast('Erro no upload do vídeo', 'err');
    } finally { setUploadingVideo(false); }
  };

  const load = useCallback(async () => {
    const r = await fetch('/api/portfolio'); setItems(await r.json());
  }, []);
  useEffect(() => { load(); }, [load]);

  const openEdit = (item: any) => { setForm({ ...item, videoUrl: item.videoUrl ?? '' }); setModal(item); };
  const openNew = () => { setForm({ title: '', category: '', description: '', imageUrl: '', videoUrl: '', projectUrl: '', featured: false, order: 0 }); setModal('new'); };

  const save = async () => {
    const isNew = modal === 'new';
    const url = isNew ? '/api/portfolio' : `/api/portfolio/${modal.id}`;
    const method = isNew ? 'POST' : 'PUT';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (r.ok) { toast(isNew ? 'Projeto criado!' : 'Projeto atualizado!'); setModal(null); load(); }
    else {
      const body = await r.json().catch(() => ({}));
      const msg = body?.error?.[0]?.message ?? body?.error ?? 'Erro ao salvar';
      toast(typeof msg === 'string' ? msg : JSON.stringify(msg), 'err');
    }
  };

  const del = async (id: string) => {
    if (!confirm('Deletar este projeto?')) return;
    const r = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
    if (r.ok) { toast('Deletado!'); load(); } else toast('Erro ao deletar', 'err');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-white/40 text-sm">{items.length} projeto(s)</p>
        <button onClick={openNew} className="px-4 py-2 bg-[#E10600] text-white rounded-lg text-sm font-medium hover:bg-[#b00500] transition-colors">+ Novo projeto</button>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-[#111] border border-white/5 rounded-xl px-4 py-3">
            <div>
              <p className="text-white text-sm font-medium">{item.title}</p>
              <p className="text-white/30 text-xs">{item.category} {item.featured && '· Destaque'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="text-white/40 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-all">Editar</button>
              <button onClick={() => del(item.id)} className="text-red-400/60 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30 transition-all">Deletar</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal === 'new' ? 'Novo Projeto' : 'Editar Projeto'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Título"><input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nome do projeto" /></Field>
            <Field label="Categoria"><input className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Ex: Plataforma Web" /></Field>
            <Field label="Descrição"><textarea className={inputCls} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descrição curta" /></Field>
            <Field label="URL da Imagem"><input className={inputCls} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="/portfolio/imagem.jpg" /></Field>
            <Field label="Vídeo do Projeto">
              <div className="space-y-2">
                <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-dashed border-white/10 cursor-pointer hover:border-[#E10600]/40 transition-colors text-sm text-white/40 hover:text-white/70 ${uploadingVideo ? 'opacity-50 pointer-events-none' : ''}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                  {uploadingVideo ? 'Enviando vídeo...' : 'Clique para enviar vídeo'}
                  <input type="file" accept="video/mp4,video/webm,video/mov,video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadVideo(f); }} />
                </label>
                {form.videoUrl && form.videoUrl.startsWith('/uploads/') && (
                  <div className="relative w-full rounded-lg overflow-hidden bg-black/40">
                    <video src={form.videoUrl} controls className="w-full max-h-48 object-cover" />
                    <button onClick={() => setForm(f => ({ ...f, videoUrl: '' }))} className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                  </div>
                )}
                <input className={inputCls} value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="Ou cole URL: YouTube, Vimeo, .mp4..." />
              </div>
            </Field>
            <Field label="URL do Projeto"><input className={inputCls} value={form.projectUrl} onChange={e => setForm(f => ({ ...f, projectUrl: e.target.value }))} placeholder="https://..." /></Field>
            <div className="flex gap-4">
              <Field label="Ordem"><input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} /></Field>
              <Field label="Destaque">
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-[#E10600]" />
                  <label htmlFor="featured" className="text-white/60 text-sm">Sim</label>
                </div>
              </Field>
            </div>
            <button onClick={save} className="w-full py-2.5 bg-[#E10600] text-white rounded-lg text-sm font-medium hover:bg-[#b00500] transition-colors mt-2">Salvar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Testimonials ────────────────────────────────────────── */
function TestimonialsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<null | 'new' | any>(null);
  const [form, setForm] = useState({ name: '', role: '', company: '', content: '', rating: 5, featured: false });

  const load = useCallback(async () => { const r = await fetch('/api/testimonials'); setItems(await r.json()); }, []);
  useEffect(() => { load(); }, [load]);

  const openEdit = (item: any) => { setForm(item); setModal(item); };
  const openNew = () => { setForm({ name: '', role: '', company: '', content: '', rating: 5, featured: false }); setModal('new'); };

  const save = async () => {
    const isNew = modal === 'new';
    const url = isNew ? '/api/testimonials' : `/api/testimonials/${modal.id}`;
    const r = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (r.ok) { toast(isNew ? 'Criado!' : 'Atualizado!'); setModal(null); load(); } else toast('Erro', 'err');
  };

  const del = async (id: string) => {
    if (!confirm('Deletar?')) return;
    const r = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    if (r.ok) { toast('Deletado!'); load(); } else toast('Erro', 'err');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-white/40 text-sm">{items.length} depoimento(s)</p>
        <button onClick={openNew} className="px-4 py-2 bg-[#E10600] text-white rounded-lg text-sm font-medium hover:bg-[#b00500] transition-colors">+ Novo depoimento</button>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-[#111] border border-white/5 rounded-xl px-4 py-3">
            <div>
              <p className="text-white text-sm font-medium">{item.name}</p>
              <p className="text-white/30 text-xs">{item.role} · {item.company} · {'★'.repeat(item.rating)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="text-white/40 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-all">Editar</button>
              <button onClick={() => del(item.id)} className="text-red-400/60 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30 transition-all">Deletar</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal === 'new' ? 'Novo Depoimento' : 'Editar Depoimento'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Nome"><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do cliente" /></Field>
            <div className="flex gap-3">
              <Field label="Cargo"><input className={inputCls} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="CEO" /></Field>
              <Field label="Empresa"><input className={inputCls} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Empresa" /></Field>
            </div>
            <Field label="Depoimento"><textarea className={inputCls} rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="O que o cliente disse..." /></Field>
            <div className="flex gap-4">
              <Field label="Avaliação (1-5)"><input type="number" min={1} max={5} className={inputCls} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} /></Field>
              <Field label="Destaque">
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-[#E10600]" />
                  <span className="text-white/60 text-sm">Sim</span>
                </div>
              </Field>
            </div>
            <button onClick={save} className="w-full py-2.5 bg-[#E10600] text-white rounded-lg text-sm font-medium hover:bg-[#b00500] transition-colors mt-2">Salvar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Blog ────────────────────────────────────────────────── */
function BlogTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [modal, setModal] = useState<null | 'new' | any>(null);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', coverImage: '', author: 'Overframe', published: false });

  const load = useCallback(async () => { const r = await fetch('/api/blog?published=false'); setPosts(await r.json()); }, []);
  useEffect(() => { load(); }, [load]);

  const openEdit = (post: any) => { setForm(post); setModal(post); };
  const openNew = () => { setForm({ title: '', slug: '', excerpt: '', content: '', coverImage: '', author: 'Overframe', published: false }); setModal('new'); };

  const autoSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

  const save = async () => {
    const isNew = modal === 'new';
    const url = isNew ? '/api/blog' : `/api/blog/${modal.slug}`;
    const r = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (r.ok) { toast(isNew ? 'Post criado!' : 'Post atualizado!'); setModal(null); load(); } else toast('Erro', 'err');
  };

  const del = async (slug: string) => {
    if (!confirm('Deletar post?')) return;
    const r = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
    if (r.ok) { toast('Deletado!'); load(); } else toast('Erro', 'err');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-white/40 text-sm">{posts.length} post(s)</p>
        <button onClick={openNew} className="px-4 py-2 bg-[#E10600] text-white rounded-lg text-sm font-medium hover:bg-[#b00500] transition-colors">+ Novo post</button>
      </div>
      <div className="space-y-2">
        {posts.map(post => (
          <div key={post.id} className="flex items-center justify-between bg-[#111] border border-white/5 rounded-xl px-4 py-3">
            <div>
              <p className="text-white text-sm font-medium">{post.title}</p>
              <p className="text-white/30 text-xs">/{post.slug} · {post.published ? <span className="text-green-400">Publicado</span> : 'Rascunho'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(post)} className="text-white/40 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-all">Editar</button>
              <button onClick={() => del(post.slug)} className="text-red-400/60 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30 transition-all">Deletar</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal === 'new' ? 'Novo Post' : 'Editar Post'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Título">
              <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: modal === 'new' ? autoSlug(e.target.value) : f.slug }))} placeholder="Título do post" />
            </Field>
            <Field label="Slug"><input className={inputCls} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="url-do-post" /></Field>
            <Field label="Resumo"><textarea className={inputCls} rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Resumo curto..." /></Field>
            <Field label="Conteúdo"><textarea className={inputCls} rows={6} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Conteúdo completo do post..." /></Field>
            <Field label="Imagem de Capa"><input className={inputCls} value={form.coverImage} onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))} placeholder="/blog/capa.jpg" /></Field>
            <Field label="Autor"><input className={inputCls} value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} /></Field>
            <Field label="Publicar">
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="accent-[#E10600]" />
                <span className="text-white/60 text-sm">Publicar agora</span>
              </div>
            </Field>
            <button onClick={save} className="w-full py-2.5 bg-[#E10600] text-white rounded-lg text-sm font-medium hover:bg-[#b00500] transition-colors mt-2">Salvar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Pricing ─────────────────────────────────────────────── */
function PricingTab() {
  const [plans, setPlans] = useState<any[]>([]);
  const [modal, setModal] = useState<null | 'new' | any>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', period: 'projeto', features: '', highlighted: false, order: 0 });

  const load = useCallback(async () => { const r = await fetch('/api/pricing'); setPlans(await r.json()); }, []);
  useEffect(() => { load(); }, [load]);

  const openEdit = (plan: any) => {
    setForm({ ...plan, price: String(plan.price), features: Array.isArray(plan.features) ? plan.features.join('\n') : '' });
    setModal(plan);
  };
  const openNew = () => { setForm({ name: '', description: '', price: '', period: 'projeto', features: '', highlighted: false, order: 0 }); setModal('new'); };

  const save = async () => {
    const isNew = modal === 'new';
    const url = isNew ? '/api/pricing' : `/api/pricing/${modal.id}`;
    const payload = { ...form, price: parseFloat(form.price), features: form.features.split('\n').filter(Boolean) };
    const r = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (r.ok) { toast(isNew ? 'Plano criado!' : 'Plano atualizado!'); setModal(null); load(); } else toast('Erro', 'err');
  };

  const del = async (id: string) => {
    if (!confirm('Deletar plano?')) return;
    const r = await fetch(`/api/pricing/${id}`, { method: 'DELETE' });
    if (r.ok) { toast('Deletado!'); load(); } else toast('Erro', 'err');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-white/40 text-sm">{plans.length} plano(s)</p>
        <button onClick={openNew} className="px-4 py-2 bg-[#E10600] text-white rounded-lg text-sm font-medium hover:bg-[#b00500] transition-colors">+ Novo plano</button>
      </div>
      <div className="space-y-2">
        {plans.map(plan => (
          <div key={plan.id} className="flex items-center justify-between bg-[#111] border border-white/5 rounded-xl px-4 py-3">
            <div>
              <p className="text-white text-sm font-medium">{plan.name} {plan.highlighted && <span className="text-[#E10600] text-xs ml-1">· Destaque</span>}</p>
              <p className="text-white/30 text-xs">R$ {Number(plan.price).toLocaleString('pt-BR')} / {plan.period}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(plan)} className="text-white/40 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-all">Editar</button>
              <button onClick={() => del(plan.id)} className="text-red-400/60 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30 transition-all">Deletar</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal === 'new' ? 'Novo Plano' : 'Editar Plano'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Nome"><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Starter" /></Field>
            <Field label="Descrição"><textarea className={inputCls} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
            <div className="flex gap-3">
              <Field label="Preço (R$)"><input type="number" className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="1997" /></Field>
              <Field label="Período"><input className={inputCls} value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} placeholder="projeto" /></Field>
            </div>
            <Field label="Recursos (um por linha)"><textarea className={inputCls} rows={5} value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder={"Landing page\nSEO básico\nEntrega em 7 dias"} /></Field>
            <div className="flex gap-4">
              <Field label="Ordem"><input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} /></Field>
              <Field label="Destaque">
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" checked={form.highlighted} onChange={e => setForm(f => ({ ...f, highlighted: e.target.checked }))} className="accent-[#E10600]" />
                  <span className="text-white/60 text-sm">Sim</span>
                </div>
              </Field>
            </div>
            <button onClick={save} className="w-full py-2.5 bg-[#E10600] text-white rounded-lg text-sm font-medium hover:bg-[#b00500] transition-colors mt-2">Salvar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Dashboard ───────────────────────────────────────────── */
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'portfolio', label: 'Portfólio', icon: '◈' },
  { id: 'blog', label: 'Blog', icon: '◷' },
];

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('portfolio');

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/sys-93kx');
  };

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/5 flex flex-col py-6 px-4 fixed h-full">
        <div className="flex items-center gap-2.5 mb-10 px-2">
          <div className="w-7 h-7 rounded-lg bg-[#E10600] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">O</span>
          </div>
          <span className="text-white text-sm font-semibold">Admin</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                tab === t.id
                  ? 'bg-[#E10600]/10 text-[#E10600]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/25 hover:text-white/60 transition-colors">
          <span>↗</span> Ver site
        </a>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/25 hover:text-white/60 transition-colors">
          <span>→</span> Sair
        </button>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-white text-xl font-semibold mb-1 capitalize">{tab}</h2>
          <p className="text-white/25 text-sm mb-8">Gerencie os dados de {TABS.find(t => t.id === tab)?.label.toLowerCase()}</p>
          {tab === 'portfolio' && <PortfolioTab />}
          {tab === 'testimonials' && <TestimonialsTab />}
          {tab === 'blog' && <BlogTab />}
          {tab === 'pricing' && <PricingTab />}
        </div>
      </main>
    </div>
  );
}
