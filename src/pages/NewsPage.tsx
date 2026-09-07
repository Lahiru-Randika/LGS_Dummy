import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { PublicFooter } from '../components/PublicFooter'
import { PublicHeader } from '../components/PublicHeader'
import { ScrollReveal } from '../components/ScrollReveal'
import { publicService } from '../services/public.service'

type PublicNewsPost = {
  id: string
  slug: string
  category: string
  title: string
  summary: string
  coverImageKey?: string | null
  publishedAt?: string | null
}

type Story = {
  kicker: string
  title: string
  body: string
  image: string
}

const fallbackStories: Story[] = [
  { kicker: 'Municipal services', title: 'Mapped service requests create a clearer field-work picture', body: 'Location-aware services help the municipality connect public reports, field action and local information in one spatial workflow.', image: '/lgs-media/map-west.jpg' },
  { kicker: 'Public access', title: 'A location-first way to discover buildings and facilities', body: 'Location-aware services help the municipality connect public reports, field action and local information in one spatial workflow.', image: '/lgs-media/map-center.jpg' },
  { kicker: 'Operations', title: 'Why assignment works better when geography and workload are visible together', body: 'Location-aware services help the municipality connect public reports, field action and local information in one spatial workflow.', image: '/lgs-media/map-east.jpg' },
  { kicker: 'Platform', title: 'Keeping public-safe and sensitive municipal information separate', body: 'Location-aware services help the municipality connect public reports, field action and local information in one spatial workflow.', image: '/lgs-media/map-south.jpg' },
]

const fallbackImages = ['/lgs-media/map-west.jpg', '/lgs-media/map-center.jpg', '/lgs-media/map-east.jpg', '/lgs-media/map-south.jpg']

export function NewsPage(){
  const [stories,setStories]=useState<Story[]>(fallbackStories)

  useEffect(()=>{
    let active=true
    publicService.news().then((posts:PublicNewsPost[])=>{
      if(!active || !posts.length) return
      setStories(posts.map((post,index)=>({
        kicker:post.category,
        title:post.title,
        body:post.summary,
        image:post.coverImageKey || fallbackImages[index % fallbackImages.length],
      })))
    }).catch(error=>{
      console.error('Public news API failed',error)
    })
    return()=>{active=false}
  },[])

  return <div className="public-site public-inner-page"><PublicHeader/><main><section className="inner-hero inner-hero--news"><div className="section-shell"><ScrollReveal><span className="editorial-kicker">News & notices</span><h1>What is happening<br/>across the municipality.</h1><p>Public notices, service updates and stories from the LGS platform.</p></ScrollReveal></div></section><section className="section-pad"><div className="section-shell news-list-grid">{stories.map((story,i)=><ScrollReveal key={`${story.title}-${i}`} delay={i*90}><article><img src={story.image} alt=""/><div><small>{story.kicker}</small><h2>{story.title}</h2><p>{story.body}</p><button>Read story <ArrowRight size={14}/></button></div></article></ScrollReveal>)}</div></section></main><PublicFooter/></div>
}
