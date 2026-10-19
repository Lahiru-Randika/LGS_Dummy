import { useLanguage } from '../context/LanguageContext'
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PublicFooter } from '../components/PublicFooter';
import { PublicHeader } from '../components/PublicHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { publicService } from '../services/public.service';
type PublicNewsPost = {
    id: string;
    slug: string;
    category: string;
    title: string;
    summary: string;
    coverImageKey?: string | null;
    publishedAt?: string | null;
};
type Story = {
    kicker: string;
    title: string;
    body: string;
    image: string;
};
const fallbackStories: Story[] = [
    { kicker: 'Municipal services', title: 'Mapped service requests create a clearer field-work picture', body: 'Location-aware services help the municipality connect public reports, field action and local information in one spatial workflow.', image: '/lgs-media/map-west.jpg' },
    { kicker: 'Public access', title: 'A location-first way to discover buildings and facilities', body: 'Location-aware services help the municipality connect public reports, field action and local information in one spatial workflow.', image: '/lgs-media/map-center.jpg' },
    { kicker: 'Operations', title: 'Why assignment works better when geography and workload are visible together', body: 'Location-aware services help the municipality connect public reports, field action and local information in one spatial workflow.', image: '/lgs-media/map-east.jpg' },
    { kicker: 'Platform', title: 'Keeping public-safe and sensitive municipal information separate', body: 'Location-aware services help the municipality connect public reports, field action and local information in one spatial workflow.', image: '/lgs-media/map-south.jpg' },
];
const fallbackImages = ['/lgs-media/map-west.jpg', '/lgs-media/map-center.jpg', '/lgs-media/map-east.jpg', '/lgs-media/map-south.jpg'];
const sectionShell =
  'mx-auto w-[min(1500px,calc(100%-80px))] max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-28px)] max-[400px]:w-[calc(100%-20px)] 3xl:w-[min(1820px,calc(100%-120px))] 4k:w-[min(2360px,calc(100%-160px))]';

export function NewsPage() {
    const { t } = useLanguage();
    const [stories, setStories] = useState<Story[]>(fallbackStories);
    useEffect(() => {
        let active = true;
        publicService.news().then((posts: PublicNewsPost[]) => {
            if (!active || !posts.length)
                return;
            setStories(posts.map((post, index) => ({
                kicker: post.category,
                title: post.title,
                body: post.summary,
                image: post.coverImageKey || fallbackImages[index % fallbackImages.length],
            })));
        }).catch(error => {
            console.error('Public news API failed', error);
        });

        return () => { active = false; };
    }, []);
    return (
      <div className="min-h-screen bg-white font-['DM_Sans'] text-slate-950">
        <PublicHeader overlay />
        <main>
          <section className="relative flex h-[100dvh] min-h-[100dvh] w-full flex-col justify-start overflow-hidden text-white">
            <div className="absolute inset-0 h-full w-full overflow-hidden" aria-hidden="true">
              <img src="/lgs-media/map-west.jpg" alt="" className="h-full w-full object-cover object-center" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#061522]/95 via-[#061522]/62 to-[#061522]/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061522]/35 via-transparent to-black/10" />
            </div>
            <div className={`${sectionShell} relative z-10 flex h-full w-full items-center pt-20 pb-14 sm:pt-24 sm:pb-16`}>
              <ScrollReveal direction="fade" className="lgs-home-hero-copy max-w-4xl pl-4 sm:pl-8 md:pl-12 lg:pl-16 xl:pl-20 2xl:pl-24 3xl:max-w-5xl 3xl:pl-32 4k:max-w-6xl 4k:pl-40">
                <span className="editorial-kicker text-teal-300">{t("News & notices")}</span>
                <h1 className="lgs-home-hero-title mt-6 font-['Manrope'] text-[clamp(40px,5.8vw,88px)] font-semibold leading-[.95] tracking-[-.055em] text-white normal-case 3xl:text-[104px] 4k:text-[124px]">
                  {t("What is happening")}<br /><span className="not-italic text-teal-300">{t("across the municipality.")}</span>
                </h1>
                <p className="lgs-home-hero-description mt-6 max-w-2xl text-[14px] font-normal leading-relaxed text-slate-200 sm:text-[16px] sm:leading-7 3xl:max-w-3xl 3xl:text-[18px]">
                  {t("Public notices, service updates and stories from the LGS platform.")}
                </p>
              </ScrollReveal>
            </div>
            <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[.18em] text-white/50 3xl:bottom-10">
              <span>{t('Scroll')}</span>
            </div>
          </section>
          <section className="section-pad">
            <div className="section-shell news-list-grid">
              {stories.map((story, i) => (
                <ScrollReveal key={`${story.title}-${i}`} delay={i * 90}>
                  <article>
                    <img src={story.image} alt="" />
                    <div>
                      <small>{story.kicker}</small>
                      <h2>{story.title}</h2>
                      <p>{story.body}</p>
                      <button>{t("Read story")}<ArrowRight size={14} /></button>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </main>
        <PublicFooter />
      </div>
    );
}
