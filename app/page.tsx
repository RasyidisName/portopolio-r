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
    title: 'Moss & Mineral',
    category: 'Brand identity · 2024',
    description:
      'A calm, tactile identity for a botanical studio growing a new kind of urban ritual. Strategy, art direction, and digital experience.',
    image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=85',
    tags: ['Art direction', 'Brand system', 'Web design'],
  },
  {
    number: '02',
    title: 'Quiet Forms',
    category: 'Editorial design · 2023',
    description:
      'An editorial platform exploring the spaces between objects, people, and the stories we choose to keep.',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85',
    tags: ['Editorial', 'Photography', 'Digital'],
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
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85')

  return (
    <main className="portfolio-shell">
      <input ref={fileInput} type="file" accept="image/*" className="sr-only" onChange={handleImage} />
      <header className="topbar">
        <div className="brand-mark"><span className="brand-dot" /> <span>STUDIO / 24</span></div>
        <div className="topbar-actions">
          <button className={`tool-button ${editMode ? 'active' : ''}`} onClick={() => setEditMode(!editMode)} aria-pressed={editMode}><Edit3 size={15} /> {editMode ? 'Done editing' : 'Edit mode'}</button>
          {active >= 2 && active < total - 1 && <button className="tool-button danger" onClick={deleteCurrentPage} disabled={projects.length <= 1}><FileText size={15} /> Delete page</button>}
          <button className="tool-button" onClick={() => window.print()}><Download size={15} /> Export PDF</button>
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

      <button className="nav-arrow nav-prev" onClick={() => go(-1)} disabled={active === 0} aria-label="Previous slide"><ArrowLeft size={20} /></button>
      <button className="nav-arrow nav-next" onClick={() => go(1)} disabled={active === total - 1} aria-label="Next slide"><ArrowRight size={20} /></button>

      <footer className="bottom-bar">
        <span>Selected works / 2024—25</span>
        <button className="add-project" onClick={() => { setProjects((items) => [...items, { ...initialProjects[0], number: String(items.length + 1).padStart(2, '0'), title: 'New project', category: 'Project category · 2025' }]); setActive(projects.length + 2) }}><Plus size={15} /> Add project slide</button>
        <a className="vercel-badge" href="https://vercel.com/new" target="_blank" rel="noreferrer">Deploy to Vercel <ArrowUpRight size={13} /></a>
      </footer>
    </main>
  )
}

function SlideHeading({ eyebrow, title, editMode }: { eyebrow: string; title: string; editMode: boolean }) {
  return <div className="slide-heading"><div className="eyebrow"><span className="eyebrow-line" /> <Editable editMode={editMode}>{eyebrow}</Editable></div><h1><Editable editMode={editMode}>{title}</Editable></h1></div>
}

function AboutSlide({ editMode, image, onImage }: { editMode: boolean; image: string; onImage: () => void }) {
  return <div className="about-grid"><div className="about-copy"><SlideHeading eyebrow="About me" title={<>Designer with<br /><em>a point of view.</em></>} editMode={editMode} /><p className="lead"><Editable editMode={editMode}>I build brands, digital products, and visual stories for people doing meaningful work.</Editable></p><div className="meta-row"><span>Based in Copenhagen</span><span>Available worldwide</span></div><div className="about-note"><Sparkles size={17} /><Editable editMode={editMode}>Currently crafting identities that feel as good as they function.</Editable></div></div><div className="portrait-wrap"><button className={`image-button ${editMode ? 'editable-image' : ''}`} onClick={onImage} aria-label="Replace profile image"><img src={image} alt="Portrait of the designer" /></button>{editMode && <span className="image-hint"><Upload size={13} /> Click to replace</span>}<span className="portrait-caption">01 / 04 — Self portrait, Copenhagen</span></div></div>
}

function EducationSlide({ editMode }: { editMode: boolean }) {
  return <div className="education-slide"><SlideHeading eyebrow="A little context" title={<>The long way<br /><em>around.</em></>} editMode={editMode} /><div className="timeline"><div className="timeline-item"><span className="year">2018—20</span><div><h2><Editable editMode={editMode}>Royal Danish Academy</Editable></h2><p><Editable editMode={editMode}>MA, Visual Communication</Editable></p></div><Check className="timeline-check" size={17} /></div><div className="timeline-item"><span className="year">2015—18</span><div><h2><Editable editMode={editMode}>The Design School Kolding</Editable></h2><p><Editable editMode={editMode}>BA, Communication Design</Editable></p></div><Check className="timeline-check" size={17} /></div><div className="timeline-item"><span className="year">2012—15</span><div><h2><Editable editMode={editMode}>Roskilde Gymnasium</Editable></h2><p><Editable editMode={editMode}>Visual Arts &amp; Media</Editable></p></div><Check className="timeline-check" size={17} /></div></div><p className="side-quote"><Editable editMode={editMode}>“Good design is not decoration. It is a way of making things understood.”</Editable></p></div>
}

function ProjectSlide({ project, index, totalProjects, editMode, onImage }: { project: typeof initialProjects[number]; index: number; totalProjects: number; editMode: boolean; onImage: () => void }) {
  return <div className="project-slide"><div className="project-image-column"><button className={`project-image ${editMode ? 'editable-image' : ''}`} onClick={onImage} aria-label="Replace project image"><img src={project.image} alt={project.title} /></button>{editMode && <span className="image-hint"><Upload size={13} /> Click to replace</span>}<span className="portrait-caption">{project.number} / {String(totalProjects).padStart(2, '0')} — Selected work</span></div><div className="project-copy"><div className="eyebrow"><span className="eyebrow-line" /> <Editable editMode={editMode}>{project.category}</Editable></div><h1><Editable editMode={editMode}>{project.title}</Editable></h1><p className="lead"><Editable editMode={editMode}>{project.description}</Editable></p><div className="tag-list">{project.tags.map((tag) => <span key={tag}><Editable editMode={editMode}>{tag}</Editable></span>)}</div><a href="#contact" className="text-link">View case study <ArrowUpRight size={15} /></a></div></div>
}

function ContactSlide({ editMode, sent, onSend }: { editMode: boolean; sent: boolean; onSend: () => void }) {
  return <div className="contact-slide" id="contact"><div><SlideHeading eyebrow="Let&apos;s talk" title={<>Have a good<br /><em>one in mind?</em></>} editMode={editMode} /><div className="contact-details"><a href="mailto:hello@studio24.co"><Mail size={16} /> <Editable editMode={editMode}>hello@studio24.co</Editable></a><a href="tel:+4531124580"><Phone size={16} /> <Editable editMode={editMode}>+45 31 12 45 80</Editable></a><span><MapPin size={16} /> <Editable editMode={editMode}>Copenhagen, DK</Editable></span></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); onSend() }}><label>Name<input required placeholder="Your name" /></label><label>Email<input required type="email" placeholder="you@company.com" /></label><label>What are you working on?<textarea required placeholder="A few words about your project..." rows={3} /></label><button type="submit" className="submit-button">{sent ? <><Check size={16} /> Message sent</> : <><Send size={15} /> Send inquiry</>}</button><p className="form-note"><FileText size={13} /> No newsletters. Just a thoughtful reply.</p></form></div>
}
