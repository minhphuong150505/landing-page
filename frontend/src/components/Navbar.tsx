import { useState, useEffect } from 'react'
import { Menu, X, Zap } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Zap size={24} className="text-blue-600" />
            NexaTech
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm">
                {link.label}
              </a>
            ))}
            <a href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors">
              Get Started
            </a>
          </div>

          <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {navLinks.map(link => (
            <a key={link.href} href={link.href}
              onClick={() => setOpen(false)}
              className="block text-gray-700 font-medium py-2 hover:text-blue-600 transition-colors">
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}
            className="block bg-blue-600 text-white text-center py-2 rounded-full font-semibold">
            Get Started
          </a>
        </div>
      )}
    </nav>
  )
}
