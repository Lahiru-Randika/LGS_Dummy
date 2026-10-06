import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Language = 'en' | 'si'
type LanguageValue = { language: Language; setLanguage: (language: Language) => void; toggleLanguage: () => void; t: (text: string) => string }

const STORAGE_KEY = 'lgs_language'

// Initial Sinhala catalogue. It intentionally lives in one file so wording can be
// corrected later without touching page components. Unknown text is left unchanged.
const si: Record<string, string> = {
  'Home':'මුල් පිටුව','About':'අප ගැන','Services':'සේවා','Contact':'සම්බන්ධ වන්න','Explore map':'සිතියම බලන්න','Sign in':'පිවිසෙන්න','Sign out':'පිටවන්න',
  'Overview':'සාරාංශය','Municipal map':'නගර සභා සිතියම','My requests':'මගේ ඉල්ලීම්','My bookings':'මගේ වෙන්කිරීම්','My tax payments':'මගේ බදු ගෙවීම්','Applications':'අයදුම්පත්',
  'Requests':'ඉල්ලීම්','Approvals':'අනුමැතිය','Analytics':'විශ්ලේෂණ','Tax':'බදු','Buildings':'ගොඩනැගිලි','Users':'පරිශීලකයින්','Notifications':'දැනුම්දීම්','Workspace':'වැඩ අවකාශය',
  'Citizen portal':'පුරවැසි ද්වාරය','Executive command':'විධායක පාලනය','Government workspace':'රාජ්‍ය වැඩ අවකාශය','Citizen':'පුරවැසියා','Field Officer':'ක්ෂේත්‍ර නිලධාරී','Government Admin':'රාජ්‍ය පරිපාලක','Approver':'අනුමත කරන්නා','Municipal Director':'නගර සභා අධ්‍යක්ෂ',
  'Municipal network':'නගර සභා ජාලය','All systems operational':'සියලු පද්ධති ක්‍රියාත්මකයි','Application navigation':'යෙදුම් සංචාලනය','Public navigation':'පොදු සංචාලනය','Toggle menu':'මෙනුව මාරු කරන්න','Open navigation':'සංචාලනය විවෘත කරන්න',
  'Welcome to LGS':'LGS වෙත සාදරයෙන් පිළිගනිමු','Welcome Back.':'නැවත සාදරයෙන් පිළිගනිමු.','Welcome':'සාදරයෙන් පිළිගනිමු','Back.':'නැවත.','Email address':'විද්‍යුත් තැපැල් ලිපිනය','Password':'මුරපදය','Continue securely':'ආරක්ෂිතව ඉදිරියට යන්න','Signing in...':'පිවිසෙමින්...','Back to Home':'මුල් පිටුවට','Return to the main website':'ප්‍රධාන වෙබ් අඩවියට ආපසු යන්න','Create account':'ගිණුමක් සාදන්න','Citizen registration':'පුරවැසි ලියාපදිංචිය','Already registered?':'දැනටමත් ලියාපදිංචිද?',
  'First name':'මුල් නම','Last name':'අවසන් නම','Register':'ලියාපදිංචි වන්න','Creating account...':'ගිණුම සාදමින්...','Use at least 12 characters.':'අවම වශයෙන් අක්ෂර 12ක් භාවිතා කරන්න.','Create your citizen account to report issues and track service requests.':'ගැටලු වාර්තා කිරීමට සහ සේවා ඉල්ලීම් නිරීක්ෂණය කිරීමට ඔබගේ පුරවැසි ගිණුම සාදන්න.',
  'New request':'නව ඉල්ලීම','Search':'සොයන්න','Filter':'පෙරහන්','Status':'තත්ත්වය','Type':'වර්ගය','Location':'ස්ථානය','Description':'විස්තරය','Submit':'ඉදිරිපත් කරන්න','Cancel':'අවලංගු කරන්න','Close':'වසන්න','Save':'සුරකින්න','Update':'යාවත්කාලීන කරන්න','Delete':'මකන්න','Edit':'සංස්කරණය කරන්න','View':'බලන්න','View request':'ඉල්ලීම බලන්න','Loading...':'පූරණය වෙමින්...','No results found':'ප්‍රතිඵල හමු නොවීය',
  'New':'නව','Review':'සමාලෝචනය','Assigned':'පවරා ඇත','Inspecting':'පරීක්ෂා කරමින්','For approval':'අනුමැතිය සඳහා','Resolved':'විසඳා ඇත','Closed':'වසා ඇත','All':'සියල්ල','Pending':'බලාපොරොත්තු','Approved':'අනුමතයි','Rejected':'ප්‍රතික්ෂේපයි','Completed':'සම්පූර්ණයි','In progress':'ක්‍රියාත්මකයි',
  'My Bookings':'මගේ වෙන්කිරීම්','My Tax Payments':'මගේ බදු ගෙවීම්','New booking':'නව වෙන්කිරීම','Make payment':'ගෙවීමක් කරන්න','New application':'නව අයදුම්පත','Payment history':'ගෙවීම් ඉතිහාසය','Outstanding balance':'හිඟ ශේෂය','Amount paid':'ගෙවූ මුදල','Booking history':'වෙන්කිරීම් ඉතිහාසය','Application history':'අයදුම්පත් ඉතිහාසය',
  'Profile':'පැතිකඩ','Name':'නම','Email':'විද්‍යුත් තැපෑල','Role':'භූමිකාව','Department':'දෙපාර්තමේන්තුව','Date':'දිනය','Time':'වේලාව','Amount':'මුදල','Reference':'යොමුව','Receipt':'රිසිට්පත','Action':'ක්‍රියාව','Actions':'ක්‍රියා',
  'Report an issue':'ගැටලුවක් වාර්තා කරන්න','Track requests':'ඉල්ලීම් නිරීක්ෂණය කරන්න','Learn more':'තවත් දැනගන්න','Get started':'ආරම්භ කරන්න','Request a demo':'නිරූපණයක් ඉල්ලන්න',
}

const replacements: Array<[RegExp,string]> = [
  [/\brequest(s)?\b/gi,'ඉල්ලීම්'],[/\bapplication(s)?\b/gi,'අයදුම්පත්'],[/\bbooking(s)?\b/gi,'වෙන්කිරීම්'],[/\bpayment(s)?\b/gi,'ගෙවීම්'],[/\bmunicipal\b/gi,'නගර සභා'],[/\bcitizen\b/gi,'පුරවැසි'],[/\bgovernment\b/gi,'රාජ්‍ය'],[/\bbuilding(s)?\b/gi,'ගොඩනැගිලි'],[/\bnotification(s)?\b/gi,'දැනුම්දීම්']
]

function translate(text: string) {
  const trimmed=text.trim(); if(!trimmed) return text
  const exact=si[trimmed]
  const translated=exact ?? replacements.reduce((v,[r,s])=>v.replace(r,s),trimmed)
  if(translated===trimmed) return text
  return text.replace(trimmed,translated)
}

const LanguageContext=createContext<LanguageValue|null>(null)

export function LanguageProvider({children}:{children:React.ReactNode}) {
  const [language,setLanguageState]=useState<Language>(()=>localStorage.getItem(STORAGE_KEY)==='si'?'si':'en')
  const setLanguage=useCallback((next:Language)=>{localStorage.setItem(STORAGE_KEY,next);setLanguageState(next)},[])
  const toggleLanguage=useCallback(()=>setLanguage(language==='en'?'si':'en'),[language,setLanguage])
  const t=useCallback((text:string)=>language==='si'?translate(text):text,[language])

  useEffect(()=>{
    document.documentElement.lang=language==='si'?'si':'en'
    document.documentElement.dataset.language=language
    // The current app contains a large amount of legacy hard-coded UI copy.
    // Translate rendered text/labels centrally now; strings can be migrated to t()
    // incrementally without changing the language-toggle contract.
    const originalText=new WeakMap<Text,string>()
    const lastApplied=new WeakMap<Text,string>()
    const originalAttrs=new WeakMap<Element,Map<string,string>>()
    const attrs=['placeholder','title','aria-label']
    const apply=(root:Node)=>{
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT)
      let n:Node|null=root.nodeType===Node.TEXT_NODE?root:walker.nextNode()
      while(n){const tx=n as Text; if(tx.parentElement && !['SCRIPT','STYLE'].includes(tx.parentElement.tagName)){const last=lastApplied.get(tx); if(!originalText.has(tx) || (last!==undefined && tx.data!==last)) originalText.set(tx,tx.data); const base=originalText.get(tx)!; const target=language==='si'?translate(base):base; if(tx.data!==target) tx.data=target; lastApplied.set(tx,target)} n=walker.nextNode()}
      const elements=root instanceof Element?[root,...Array.from(root.querySelectorAll('*'))]:root instanceof Document?[...Array.from(root.querySelectorAll('*'))]:[]
      for(const el of elements){let map=originalAttrs.get(el);if(!map){map=new Map();originalAttrs.set(el,map)}for(const a of attrs){const v=el.getAttribute(a);if(v!==null&&!map.has(a))map.set(a,v);const base=map.get(a);if(base!==undefined)el.setAttribute(a,language==='si'?translate(base):base)}}
    }
    apply(document)
    const observer=new MutationObserver(ms=>ms.forEach(m=>{if(m.type==='characterData')apply(m.target);m.addedNodes.forEach(apply)}))
    observer.observe(document.body,{subtree:true,childList:true,characterData:true})
    return()=>observer.disconnect()
  },[language])

  const value=useMemo(()=>({language,setLanguage,toggleLanguage,t}),[language,setLanguage,toggleLanguage,t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(){const c=useContext(LanguageContext);if(!c)throw new Error('useLanguage must be used inside LanguageProvider');return c}
