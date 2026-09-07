import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { authService } from '../services/auth.service'
import { ApiError } from '../services/http'

export function RegisterPage(){
  const [firstName,setFirstName]=useState('')
  const [lastName,setLastName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [submitting,setSubmitting]=useState(false)
  const navigate=useNavigate()

  async function submit(event:FormEvent){
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try{
      await authService.register({firstName,lastName,email,password})
      navigate('/login')
    }catch(cause){
      setError(cause instanceof ApiError?cause.message:'Unable to create the account.')
    }finally{setSubmitting(false)}
  }

  return <div className="simple-auth"><div className="simple-auth__brand"><Brand/></div><div className="simple-auth__card"><Link className="back-link" to="/"><ArrowLeft size={15}/>Back</Link><span className="eyebrow">Citizen account</span><h1>Create your LGS account</h1><p>Register to report issues, track requests and book eligible public facilities.</p><form onSubmit={submit}><div className="form-grid"><label className="form-field"><span>First name</span><input placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} required/></label><label className="form-field"><span>Last name</span><input placeholder="Last name" value={lastName} onChange={e=>setLastName(e.target.value)} required/></label><label className="form-field form-field--full"><span>Email</span><input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label className="form-field form-field--full"><span>Password</span><input type="password" placeholder="Create a secure password" value={password} onChange={e=>setPassword(e.target.value)} minLength={12} required/></label></div>{error&&<div className="auth-note"><ShieldCheck size={15}/><span>{error}</span></div>}<button className="primary-btn primary-btn--large full" disabled={submitting}>{submitting?'Creating account…':'Create citizen account'} <ArrowRight size={16}/></button></form><div className="auth-note"><ShieldCheck size={15}/><span>Government roles are not available through public registration.</span></div><small className="login-switch">Already registered? <Link to="/login">Sign in</Link></small></div></div>
}
