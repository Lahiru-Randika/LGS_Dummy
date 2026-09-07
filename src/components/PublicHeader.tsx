import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Brand } from './Brand'

export function PublicHeader({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`public-header ${overlay ? 'public-header--overlay' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="public-header__inner">
        <Brand light={overlay && !scrolled} />
        <nav className={`public-site-nav ${open ? 'is-open' : ''}`} aria-label="Public navigation">
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/about" onClick={close}>About</NavLink>
          <NavLink to="/services" onClick={close}>Services</NavLink>
          <NavLink to="/news" onClick={close}>News</NavLink>
          <NavLink to="/contact" onClick={close}>Contact</NavLink>
        </nav>
        <div className="public-header__actions">
          <Link className="public-header__map" to="/map">Explore map</Link>
          <Link className="public-header__signin" to="/login">Sign in</Link>
          <button className="public-header__menu" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}
