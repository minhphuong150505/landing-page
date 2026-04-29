import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'UGC Challenge', href: '#ugc-challenge' },
  { label: 'Marathon', href: '#marathon' },
  { label: 'Trade-in', href: '#trade-in' },
  { label: 'Sản phẩm', href: '#about' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-10 h-16"
      style={{
        background: 'rgba(16,16,16,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(111,162,52,0.28)'
          : '1px solid rgba(111,162,52,0.18)',
      }}
    >
      <a href="#" className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
        <span className="text-white text-base font-black tracking-wide">
          BABÉ <em className="italic text-[var(--g700)]">Laboratorios</em>
        </span>
      </a>

      <div className="hidden md:flex gap-7 items-center">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[13.5px] font-semibold text-white/60 hover:text-[var(--g83)] transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#ugc-challenge"
          className="bg-[var(--g700)] text-white px-[22px] py-2 rounded-full text-[13px] font-extrabold tracking-wide transition-all duration-200 hover:bg-[var(--g641)] hover:scale-105"
        >
          Tham gia ngay
        </a>
      </div>

      <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-[#111] border-t border-white/5 px-5 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-white/70 font-semibold py-2 hover:text-[var(--g83)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#ugc-challenge"
            onClick={() => setOpen(false)}
            className="block bg-[var(--g700)] text-white text-center py-2 rounded-full font-extrabold text-sm"
          >
            Tham gia ngay
          </a>
        </div>
      )}
    </nav>
  )
}
