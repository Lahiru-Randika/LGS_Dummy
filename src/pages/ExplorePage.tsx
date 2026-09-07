import { ArrowRight, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { CivicMap } from '../components/CivicMap'

export function ExplorePage() {
  return <div className="explore-page"><header className="explore-topbar"><Brand/><div><span>Public map</span><Link className="ghost-btn" to="/"><span className="desktop-only">About LGS</span></Link><Link className="primary-btn" to="/login"><LogIn size={16}/>Sign in</Link></div></header><div className="explore-map"><CivicMap/></div><div className="public-map-prompt"><span>Want to report an issue here?</span><Link to="/login">Sign in to create a request <ArrowRight size={15}/></Link></div></div>
}
