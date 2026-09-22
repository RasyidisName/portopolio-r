'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  Edit3,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Send,
  Sparkles,
  Upload,
} from 'lucide-react'

const initialProjects = [
  {
    number: '01',
    title: 'Personal Web Portfolio',
    category: 'Web Development · April 2026',
    description:
      'Pengembangan dan penerapan (deployment) situs portofolio pribadi secara live menggunakan platform Vercel, dibangun dengan arsitektur web modern (React, Tailwind CSS, Vite).',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=85',
    tags: ['React', 'Tailwind CSS', 'Vercel Deployment'],
  },
  {
    number: '02',
    title: 'Sistem Informasi Manajemen',
    category: 'Backend Architecture · 2025',
    description:
      'Pengembangan aplikasi web berbasis Laravel dan Filament untuk manajemen data internal, lengkap dengan migrasi basis data dan komponen antarmuka dinamis.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85',
    tags: ['Laravel', 'Filament', 'Database Migration'],
  },
]

function Editable({ children, editMode, className = '' }: { children: React.ReactNode; editMode: boolean; className?: string }) {
  return <span className={className} contentEditable={editMode} suppressContentEditableWarning={editMode}>{children}</span>
}

export default function Page() {
  const [active, setActive] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [projects, setProjects] = useState(initialProjects)
  const fileInput = useRef<HTMLInputElement>(null)
  const [imageTarget, setImageTarget] = useState<'profile' | number | null>(null)
  const [sent, setSent] = useState(false)
  const total = projects.length + 3

  const go = (direction: number) => setActive((current) => Math.min(Math.max(current + direction, 0), total - 1))
  const deleteCurrentPage = () => {
    if (active < 2 || active >= total - 1 || projects.length <= 1) return
    const projectIndex = active - 2
    setProjects((items) => items.filter((_, index) => index !== projectIndex))
    setActive((current) => Math.max(0, Math.min(current, total - 2)))
  }
  const pickImage = (target: 'profile' | number) => {
    if (!editMode) return
    setImageTarget(target)
    fileInput.current?.click()
  }
  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (imageTarget === 'profile') setProfileImage(String(reader.result))
      if (typeof imageTarget === 'number') setProjects((items) => items.map((item, index) => index === imageTarget ? { ...item, image: String(reader.result) } : item))
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }
  const [profileImage, setProfileImage] = useState('https://6ab0b438380f009d8903787f.imgix.net/sandbox/Gemini_Generated_Image_-clean.png')

  return (
    <main className="portfolio-shell">
      <input ref={fileInput} type="file" accept="image/*" className="sr-only" onChange={handleImage} />
      <header className="topbar">
        <div className="brand-mark"><span className="brand-dot" /> <span>Portofolio / 26</span></div>
        <div className="topbar-actions">
          <button 
            className="tool-button" 
            onClick={() => {
              const newProject = {
                number: String(projects.length + 1).padStart(2, '0'),
                title: 'Proyek Baru',
                category: 'Kategori · Tahun',
                description: 'Deskripsi proyek baru Anda...',
                image: 'https://images.unsplash.com/photo-1618477388954-7852f32655cb?auto=format&fit=crop&w=1200&q=85',
                tags: ['Tag 1', 'Tag 2']
              }
              setProjects([...projects, newProject])
              setActive(projects.length + 2)
            }}
          >
            <Plus size={15} /> Add Project
          </button>
          <button className={`tool-button ${editMode ? 'active' : ''}`} onClick={() => setEditMode(!editMode)} aria-pressed={editMode}><Edit3 size={15} /> {editMode ? 'Done' : 'Edit'}</button>
          {active >= 2 && active < total - 1 && <button className="tool-button danger" onClick={deleteCurrentPage} disabled={projects.length <= 1}><FileText size={15} /> Delete</button>}
          <button className="tool-button" onClick={() => window.print()}><Download size={15} /> PDF</button>
        </div>
      </header>

      <div className="deck-progress" aria-label={`Slide ${active + 1} of ${total}`}><span style={{ width: `${((active + 1) / total) * 100}%` }} /></div>
      <div className="slide-counter"><span>{String(active + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}</div>

      <section className="deck" aria-live="polite">
        <AnimatePresence initial={false} mode="wait">
          <motion.div key={active} className="slide" initial={{ opacity: 0, x: 70 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -70 }} transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }}>
            {active === 0 && <AboutSlide editMode={editMode} image={profileImage} onImage={() => pickImage('profile')} />}
            {active === 1 && <EducationSlide editMode={editMode} />}
            {active >= 2 && active < total - 1 && <ProjectSlide project={projects[active - 2]} index={active - 2} totalProjects={projects.length} editMode={editMode} onImage={() => pickImage(active - 2)} />}
            {active === total - 1 && <ContactSlide editMode={editMode} sent={sent} onSend={() => setSent(true)} />}
          </motion.div>
        </AnimatePresence>
      </section>
      
      <section className="print-deck" aria-hidden="true">
        <div className="slide"><AboutSlide editMode={false} image={profileImage} onImage={() => {}} /></div>
        <div className="slide"><EducationSlide editMode={false} /></div>
        {projects.map((project, index) => <div className="slide" key={`print-${project.number}-${index}`}><ProjectSlide project={project} index={index} totalProjects={projects.length} editMode={false} onImage={() => {}} /></div>)}
        <div className="slide"><ContactSlide editMode={false} sent={sent} onSend={() => {}} /></div>
      </section>

      <button className="nav-arrow nav-prev" onClick={() => go(-1)} disabled={active === 0} aria-label="Previous slide"><ArrowLeft size={20} /></button>
      <button className="nav-arrow nav-next" onClick={() => go(1)} disabled={active === total - 1} aria-label="Next slide"><ArrowRight size={20} /></button>
    </main>
  )
}

function SlideHeading({ eyebrow, title, editMode }: { eyebrow: string; title: string; editMode: boolean }) {
  return <div className="slide-heading"><div className="eyebrow"><span className="eyebrow-line" /> <Editable editMode={editMode}>{eyebrow}</Editable></div><h1><Editable editMode={editMode}>{title}</Editable></h1></div>
}

function AboutSlide({ editMode, image, onImage }: { editMode: boolean; image: string; onImage: () => void }) {
  return (
    <div className="about-grid">
      <div className="about-copy">
        <SlideHeading eyebrow="Tentang Saya" title={<>Abdul Rasyid<br /><em>Web Developer &amp; IT Specialist.</em></>} editMode={editMode} />
        <p className="lead">
          <Editable editMode={editMode}>Lulusan S1 Teknik Informatika yang berfokus pada pengembangan web modern, sistem informasi, dan solusi teknologi digital.</Editable>
        </p>
        <div className="meta-row">
          <span><Editable editMode={editMode}>TTL: 24 Januari 2003</Editable></span>
          <span><Editable editMode={editMode}>Banjarmasin, Kalimantan Selatan</Editable></span>
        </div>
        <div className="about-note">
          <Sparkles size={17} />
          <Editable editMode={editMode}>Terbuka untuk peluang karir, proyek lepas, dan kolaborasi teknologi.</Editable>
        </div>
      </div>
      <div className="portrait-wrap">
        <button className={`image-button ${editMode ? 'editable-image' : ''}`} onClick={onImage} aria-label="Ganti foto profil">
          <img src={image} alt="Foto Profil Abdul Rasyid" />
        </button>
        {editMode && <span className="image-hint"><Upload size={13} /> Klik untuk mengganti</span>}
        <span className="portrait-caption">01 / 04 — Foto Profil, Banjarmasin</span>
      </div>
    </div>
  )
}

function EducationSlide({ editMode }: { editMode: boolean }) {
  return (
    <div className="education-slide">
      <SlideHeading eyebrow="Latar Belakang" title={<>Perjalanan<br /><em>Pendidikan & Fokus.</em></>} editMode={editMode} />
      <div className="timeline">
        <div className="timeline-item">
          <span className="year">Terbaru</span>
          <div>
            <h2><Editable editMode={editMode}>S1 Teknik Informatika</Editable></h2>
            <p><Editable editMode={editMode}>Fokus pada pengembangan aplikasi web modern (Laravel, React, Vite, dan Tailwind CSS).</Editable></p>
          </div>
          <Check className="timeline-check" size={17} />
        </div>
        <div className="timeline-item">
          <span className="year">Mei—Jul 2026</span>
          <div>
            <h2><Editable editMode={editMode}>Pelatihan Digital Marketing</Editable></h2>
            <p><Editable editMode={editMode}>Eksplorasi strategi SEO, SEM, serta metodologi pengolahan data analitik (Google Colab & Orange).</Editable></p>
          </div>
          <Check className="timeline-check" size={17} />
        </div>
        <div className="timeline-item">
          <span className="year">Berkelanjutan</span>
          <div>
            <h2><Editable editMode={editMode}>Eksplorasi Sistem & Perangkat Keras</Editable></h2>
            <p><Editable editMode={editMode}>Administrasi sistem Linux (Parrot OS, MATE/KDE), perawatan hardware, dan modifikasi OS.</Editable></p>
          </div>
          <Check className="timeline-check" size={17} />
        </div>
      </div>
      <p className="side-quote">
        <Editable editMode={editMode}>“Memecahkan masalah melalui baris kode dan merakit efisiensi dalam setiap sistem.”</Editable>
      </p>
    </div>
  )
}

function ProjectSlide({ project, index, totalProjects, editMode, onImage }: { project: typeof initialProjects[number]; index: number; totalProjects: number; editMode: boolean; onImage: () => void }) {
  return (
    <div className="project-slide">
      <div className="project-image-column">
        <button className={`project-image ${editMode ? 'editable-image' : ''}`} onClick={onImage} aria-label="Replace project image">
          <img src={project.image} alt={project.title} />
        </button>
        {editMode && <span className="image-hint"><Upload size={13} /> Click to replace</span>}
        <span className="portrait-caption">{project.number} / {String(totalProjects).padStart(2, '0')} — Selected work</span>
      </div>
      <div className="project-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> <Editable editMode={editMode}>{project.category}</Editable></div>
        <h1><Editable editMode={editMode}>{project.title}</Editable></h1>
        <p className="lead"><Editable editMode={editMode}>{project.description}</Editable></p>
        <div className="tag-list">{project.tags.map((tag) => <span key={tag}><Editable editMode={editMode}>{tag}</Editable></span>)}</div>
        <a href="#contact" className="text-link">View case study <ArrowUpRight size={15} /></a>
      </div>
    </div>
  )
}

function ContactSlide({ editMode, sent, onSend }: { editMode: boolean; sent: boolean; onSend: () => void }) {
  return (
    <div className="contact-slide" id="contact">
      <div className="contact-info-col">
        <SlideHeading eyebrow="Let's talk" title="Get in touch." editMode={editMode} />
        <blockquote className="quote-card" style={{ marginTop: '20px', marginBottom: '30px', paddingLeft: '15px', borderLeft: '2px solid var(--green)', fontStyle: 'italic', color: 'var(--muted)' }}>
          <p className="quote-text">
            &ldquo;Bekerjalah seperti kalian mendapatkan Surga dan Dunia hingga hati kalian damai dalam menjalaninya.&rdquo;
          </p>
        </blockquote>
        <div className="contact-details">
          <a href="mailto:hello@studio24.co"><Mail size={16} /> <Editable editMode={editMode}>hello@studio24.co</Editable></a>
          <a href="tel:+4531124580"><Phone size={16} /> <Editable editMode={editMode}>+45 31 12 45 80</Editable></a>
          <span><MapPin size={16} /> <Editable editMode={editMode}>Banjarmasin, ID</Editable></span>
        </div>
      </div>

      <form className="contact-form" onSubmit={(event) => { event.preventDefault(); onSend(); }}>
        <label>Name<input required placeholder="Your name" /></label>
        <label>Email<input required type="email" placeholder="you@company.com" /></label>
        <label>What are you working on?<textarea required placeholder="A few words about your project..." rows={3} /></label>
        <button type="submit" className="submit-button">
          {sent ? <><Check size={16} /> Message sent</> : <><Send size={15} /> Send inquiry</>}
        </button>
        <p className="form-note"><FileText size={13} /> No newsletters. Just a thoughtful reply.</p>
      </form>
    </div>
  );
}