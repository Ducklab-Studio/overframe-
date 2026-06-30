'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tab = 'portfolio' | 'team' | 'testimonials' | 'blog' | 'pricing';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  videoUrl: string | null;
  projectUrl: string;
  featured: boolean;
  order: number;
  technologies: string[];
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  featured: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  published: boolean;
  publishedAt: string | null;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  highlighted: boolean;
  order: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  github: string;
  linkedin: string;
  instagram: string;
  order: number;
}

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
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [modal, setModal] = useState<null | 'new' | PortfolioItem>(null);
  const [form, setForm] = useState({ title: '', category: '', description: '', imageUrl: '', videoUrl: '', projectUrl: '', featured: false, order: 0, technologies: [] as string[] });
  const [techInput, setTechInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      if (r.ok) {
        const { url } = await r.json();
        setForm(f => ({ ...f, imageUrl: url }));
        toast('Imagem enviada!');
      } else {
        toast('Erro no upload', 'err');
      }
    } finally {
      setUploading(false);
    }
  };

  const uploadVideo = async (file: File) => {
    setUploadingVideo(true);
    setVideoProgress(0);
    try {
      const sigRes = await fetch('/api/upload/signature', { method: 'POST' });
      if (!sigRes.ok) { toast('Erro ao iniciar upload', 'err'); return; }
      const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

      const fd = new FormData();
      fd.append('file', file);
      fd.append('signature', signature);
      fd.append('timestamp', String(timestamp));
      fd.append('api_key', apiKey);
      fd.append('folder', folder);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setVideoProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            setForm(f => ({ ...f, videoUrl: result.secure_url }));
            toast('Vídeo enviado!');
            resolve();
          } else {
            reject(new Error('Upload falhou'));
          }
        };
        xhr.onerror = () => reject(new Error('Erro de rede'));
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
        xhr.send(fd);
      });
    } catch {
      toast('Erro no upload do vídeo', 'err');
    } finally {
      setUploadingVideo(false);
      setVideoProgress(0);
    }
  };

  const load = useCallback(async () => {
    const r = await fetch('/api/portfolio'); setItems(await r.json());
  }, []);
  useEffect(() => { load(); }, [load]);

  const openEdit = (item: PortfolioItem) => { setForm({ ...item, technologies: item.technologies ?? [], videoUrl: item.videoUrl ?? '' }); setTechInput(''); setModal(item); };
  const openNew = () => { setForm({ title: '', category: '', description: '', imageUrl: '', videoUrl: '', projectUrl: '', featured: false, order: 0, technologies: [] }); setTechInput(''); setModal('new'); };

  const save = async () => {
    const isNew = modal === 'new';
    const url = isNew ? '/api/portfolio' : `/api/portfolio/${(modal as PortfolioItem).id}`;
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
            <Field label="Imagem do Projeto">
              <div className="space-y-2">
                <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-dashed border-white/10 cursor-pointer hover:border-[#E10600]/40 transition-colors text-sm text-white/40 hover:text-white/70 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  {uploading ? 'Enviando...' : 'Clique para enviar foto'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
                </label>
                {form.imageUrl && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/40">
                    <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    <button onClick={() => setForm(f => ({ ...f, imageUrl: '' }))} className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                  </div>
                )}
              </div>
            </Field>
            <Field label="Vídeo do Projeto">
              <div className="space-y-2">
                <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-dashed border-white/10 cursor-pointer hover:border-[#E10600]/40 transition-colors text-sm text-white/40 hover:text-white/70 ${uploadingVideo ? 'opacity-50 pointer-events-none' : ''}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                  {uploadingVideo ? `Enviando... ${videoProgress}%` : 'Clique para enviar vídeo'}
                  <input type="file" accept="video/mp4,video/webm,video/mov,video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadVideo(f); }} />
                </label>
                {uploadingVideo && (
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-[#E10600] rounded-full transition-all duration-200" style={{ width: `${videoProgress}%` }} />
                  </div>
                )}
                {form.videoUrl && (
                  <div className="relative w-full rounded-lg overflow-hidden bg-black/40">
                    <video src={form.videoUrl} controls className="w-full max-h-48 object-cover" />
                    <button onClick={() => setForm(f => ({ ...f, videoUrl: '' }))} className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                  </div>
                )}
              </div>
            </Field>
            <Field label="URL do Projeto"><input className={inputCls} value={form.projectUrl} onChange={e => setForm(f => ({ ...f, projectUrl: e.target.value }))} placeholder="https://..." /></Field>
            <Field label="Tecnologias">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    className={inputCls}
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => {
                      if ((e.key === 'Enter' || e.key === ',') && techInput.trim()) {
                        e.preventDefault();
                        const t = techInput.trim().replace(/,$/, '');
                        if (t && !form.technologies.includes(t)) setForm(f => ({ ...f, technologies: [...f.technologies, t] }));
                        setTechInput('');
                      }
                    }}
                    placeholder="Ex: React (Enter para adicionar)"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const t = techInput.trim().replace(/,$/, '');
                      if (t && !form.technologies.includes(t)) { setForm(f => ({ ...f, technologies: [...f.technologies, t] })); setTechInput(''); }
                    }}
                    className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors whitespace-nowrap"
                  >+ Add</button>
                </div>
                {form.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.technologies.map((t: string) => (
                      <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs">
                        {t}
                        <button onClick={() => setForm(f => ({ ...f, technologies: f.technologies.filter((x: string) => x !== t) }))} className="text-white/40 hover:text-white ml-0.5">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Field>
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
  const [items, setItems] = useState<Testimonial[]>([]);
  const [modal, setModal] = useState<null | 'new' | Testimonial>(null);
  const [form, setForm] = useState({ name: '', role: '', company: '', content: '', rating: 5, featured: false });

  const load = useCallback(async () => { const r = await fetch('/api/testimonials'); setItems(await r.json()); }, []);
  useEffect(() => { load(); }, [load]);

  const openEdit = (item: Testimonial) => { setForm(item); setModal(item); };
  const openNew = () => { setForm({ name: '', role: '', company: '', content: '', rating: 5, featured: false }); setModal('new'); };

  const save = async () => {
    const isNew = modal === 'new';
    const url = isNew ? '/api/testimonials' : `/api/testimonials/${(modal as Testimonial).id}`;
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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [modal, setModal] = useState<null | 'new' | BlogPost>(null);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', coverImage: '', author: 'Overframe', published: false });

  const load = useCallback(async () => { const r = await fetch('/api/blog?published=false'); setPosts(await r.json()); }, []);
  useEffect(() => { load(); }, [load]);

  const openEdit = (post: BlogPost) => { setForm(post); setModal(post); };
  const openNew = () => { setForm({ title: '', slug: '', excerpt: '', content: '', coverImage: '', author: 'Overframe', published: false }); setModal('new'); };

  const autoSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

  const save = async () => {
    const isNew = modal === 'new';
    const url = isNew ? '/api/blog' : `/api/blog/${(modal as BlogPost).slug}`;
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
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [modal, setModal] = useState<null | 'new' | PricingPlan>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', period: 'projeto', features: '', highlighted: false, order: 0 });

  const load = useCallback(async () => { const r = await fetch('/api/pricing'); setPlans(await r.json()); }, []);
  useEffect(() => { load(); }, [load]);

  const openEdit = (plan: PricingPlan) => {
    setForm({ ...plan, price: String(plan.price), features: Array.isArray(plan.features) ? plan.features.join('\n') : '' });
    setModal(plan);
  };
  const openNew = () => { setForm({ name: '', description: '', price: '', period: 'projeto', features: '', highlighted: false, order: 0 }); setModal('new'); };

  const save = async () => {
    const isNew = modal === 'new';
    const url = isNew ? '/api/pricing' : `/api/pricing/${(modal as PricingPlan).id}`;
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

/* ─── Team ─────────────────────────────────────────────────── */
function TeamTab() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [modal, setModal] = useState<null | 'new' | TeamMember>(null);
  const [form, setForm] = useState({ name: '', role: '', bio: '', avatarUrl: '', github: '', linkedin: '', instagram: '', order: 0 });
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch('/api/team'); setItems(await r.json());
  }, []);
  useEffect(() => { load(); }, [load]);

  const openEdit = (item: TeamMember) => { setForm(item); setModal(item); };
  const openNew = () => { setForm({ name: '', role: '', bio: '', avatarUrl: '', github: '', linkedin: '', instagram: '', order: 0 }); setModal('new'); };

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      if (r.ok) { const { url } = await r.json(); setForm(f => ({ ...f, avatarUrl: url })); toast('Foto enviada!'); }
      else toast('Erro no upload', 'err');
    } finally { setUploading(false); }
  };

  const save = async () => {
    const isNew = modal === 'new';
    const url = isNew ? '/api/team' : `/api/team/${(modal as TeamMember).id}`;
    const r = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (r.ok) { toast(isNew ? 'Membro adicionado!' : 'Atualizado!'); setModal(null); load(); }
    else toast('Erro ao salvar', 'err');
  };

  const del = async (id: string) => {
    if (!confirm('Remover este membro?')) return;
    const r = await fetch(`/api/team/${id}`, { method: 'DELETE' });
    if (r.ok) { toast('Removido!'); load(); } else toast('Erro ao remover', 'err');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-white/40 text-sm">{items.length} membro(s)</p>
        <button onClick={openNew} className="px-4 py-2 bg-[#E10600] text-white rounded-lg text-sm font-medium hover:bg-[#b00500] transition-colors">+ Novo membro</button>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-[#111] border border-white/5 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              {item.avatarUrl
                ? <img src={item.avatarUrl} alt={item.name} className="w-9 h-9 rounded-full object-cover" />
                : <div className="w-9 h-9 rounded-full bg-[#E10600]/20 flex items-center justify-center text-[#E10600] text-xs font-bold">{item.name.slice(0,2).toUpperCase()}</div>
              }
              <div>
                <p className="text-white text-sm font-medium">{item.name}</p>
                <p className="text-white/30 text-xs">{item.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="text-white/40 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-all">Editar</button>
              <button onClick={() => del(item.id)} className="text-red-400/60 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30 transition-all">Remover</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal === 'new' ? 'Novo Membro' : 'Editar Membro'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Foto do Membro">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#111] border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {form.avatarUrl
                    ? <img src={form.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-white/20 text-xs">Foto</span>
                  }
                </div>
                <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-white/10 cursor-pointer hover:border-[#E10600]/40 transition-colors text-sm text-white/40 hover:text-white/70 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  {uploading ? 'Enviando...' : 'Enviar foto'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); }} />
                </label>
              </div>
            </Field>
            <Field label="Nome"><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome completo" /></Field>
            <Field label="Cargo"><input className={inputCls} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Ex: CEO & Fundador" /></Field>
            <Field label="Bio"><textarea className={inputCls} rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Descrição curta" /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="GitHub"><input className={inputCls} value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} placeholder="https://..." /></Field>
              <Field label="LinkedIn"><input className={inputCls} value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} placeholder="https://..." /></Field>
              <Field label="Instagram"><input className={inputCls} value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="https://..." /></Field>
            </div>
            <Field label="Ordem"><input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} /></Field>
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
  { id: 'team', label: 'Equipe', icon: '◑' },
  { id: 'blog', label: 'Blog', icon: '◷' },
];

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('portfolio');

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/0V3R');
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col py-3 md:py-6 px-4 md:fixed md:h-full bg-[#080808] z-40 sticky top-0">
        <div className="hidden md:flex items-center gap-2.5 mb-10 px-2">
          <div className="w-7 h-7 rounded-lg bg-[#E10600] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">O</span>
          </div>
          <span className="text-white text-sm font-semibold">Admin</span>
        </div>
        <nav className="flex md:flex-col gap-2 md:gap-1 flex-1 overflow-x-auto no-scrollbar pb-1 md:pb-0 items-center md:items-stretch">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                tab === t.id
                  ? 'bg-[#E10600]/10 text-[#E10600]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
          <button onClick={logout} className="md:hidden flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400/50 hover:text-red-400 whitespace-nowrap ml-auto">
            <span>→</span> Sair
          </button>
        </nav>
        <div className="hidden md:flex flex-col gap-1 mt-auto">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/25 hover:text-white/60 transition-colors">
            <span>←</span> Ver site
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/25 hover:text-white/60 transition-colors text-left">
            <span>→</span> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="md:ml-56 flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-white text-xl font-semibold mb-1 capitalize">{tab}</h2>
          <p className="text-white/25 text-sm mb-6 md:mb-8">Gerencie os dados de {TABS.find(t => t.id === tab)?.label.toLowerCase()}</p>
          {tab === 'portfolio' && <PortfolioTab />}
          {tab === 'team' && <TeamTab />}
          {tab === 'testimonials' && <TestimonialsTab />}
          {tab === 'blog' && <BlogTab />}
          {tab === 'pricing' && <PricingTab />}
        </div>
      </main>
    </div>
  );
}
