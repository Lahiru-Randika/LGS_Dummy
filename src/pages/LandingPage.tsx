import { ArrowRight, Building2, CalendarCheck2, CheckCircle2, CircleHelp, Compass, Crosshair, FileText, Landmark, Layers3, LocateFixed, MapPin, MessageSquareWarning, Search, ShieldCheck, Sparkles, Users2, } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeroMedia } from '../components/HeroMedia';
import { PublicFooter } from '../components/PublicFooter';
import { PublicHeader } from '../components/PublicHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { ParallaxSection } from '../components/ParallaxSection';
import { useLanguage } from '../context/LanguageContext';
const serviceCards = [
    {
        icon: MessageSquareWarning,
        eyebrow: 'Land',
        title: 'Land & Spatial Intelligence',
        body: 'Connect property and parcel records, boundaries, zoning and spatial intelligence to one verified map.',
        tone: 'hover:border-rose-200 hover:bg-rose-50/40',
    },
    {
        icon: Sparkles,
        eyebrow: 'Permits',
        title: 'Permits, Certificates & Licensing',
        body: 'Track applications, approvals, certificates and licensing workflows from submission to final decision.',
        tone: 'hover:border-emerald-200 hover:bg-emerald-50/40',
    },
    {
        icon: CircleHelp,
        eyebrow: 'Revenue',
        title: 'Tax, Revenue & Payments',
        body: 'Manage assessments, bills, collections and arrears with every record tied to a real, mapped property.',
        tone: 'hover:border-blue-200 hover:bg-blue-50/40',
    },
    {
        icon: CalendarCheck2,
        eyebrow: 'Engage',
        title: 'Citizen Engagement & Command Center',
        body: 'Bring citizen services, complaints, public participation and executive visibility into one connected system.',
        tone: 'hover:border-violet-200 hover:bg-violet-50/40',
    },
];
const featureCards = [
    {
        image: '/lgs-media/ExploreYourArea.png',
        kicker: 'Spatial foundation',
        title: 'Land Information System (LIS)',
        body: 'Manage municipal assets and infrastructure with real location intelligence instead of guesswork.',
    },
    {
        image: '/lgs-media/FindCivicPlaces.png',
        kicker: 'Planning intelligence',
        title: 'City Planning',
        body: 'Bring land records, ownership and boundaries together clearly so planning starts from facts, not files.',
    },
    {
        image: '/lgs-media/FollowLocalAction.png',
        kicker: 'Infrastructure intelligence',
        title: 'Underground Utility Management',
        body: 'Map and manage water, sewerage, electricity and telecom networks before anyone breaks ground.',
    },
];
const news = [
    [
        'Spatial intelligence',
        'Every layer of the city, finally in one place',
        'From what is underground to what is being planned next, council information can be captured, mapped and ready to use.',
    ],
    [
        'Connected operations',
        'One map. Every department. Every answer.',
        'Land records, permits, tax data, certificates and citizen services connect back to the same verified council map.',
    ],
    [
        'Decision support',
        'A stronger, smarter path to local governance',
        'Live spatial data, connected workflows and executive dashboards help councils act from one shared picture.',
    ],
];
const sectionShell = 'mx-auto w-[min(1500px,calc(100%-80px))] max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-28px)] max-[400px]:w-[calc(100%-20px)] 3xl:w-[min(1820px,calc(100%-120px))] 4k:w-[min(2360px,calc(100%-160px))]';
const kicker = 'text-[10px] font-semibold uppercase tracking-[.17em] text-teal-700 3xl:text-xs';
export function LandingPage() {
    const {  t  } = useLanguage();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        navigate(search.trim()
            ? `/map?q=${encodeURIComponent(search.trim())}`
            : '/map');
    };
    return (<div className="min-h-screen bg-white font-['DM_Sans'] text-slate-950">
      <PublicHeader overlay/>

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}
        <section
          data-no-translate
          translate="no"
          className="relative h-screen h-[100dvh] min-h-[100dvh] w-full overflow-hidden text-white flex flex-col justify-start"
        >
          <HeroMedia />

          <div className={`${sectionShell} relative z-10 flex h-full w-full items-center pt-20 pb-14 sm:pt-24 sm:pb-16`}>
            <ScrollReveal direction="fade" className="max-w-4xl 3xl:max-w-5xl 4k:max-w-6xl lgs-home-hero-copy pl-4 sm:pl-8 md:pl-12 lg:pl-16 xl:pl-20 2xl:pl-24 3xl:pl-32 4k:pl-40">
              <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-teal-200 3xl:text-xs">{t("Spatio LGS")}</span>

              <h1 className="lgs-home-hero-title mt-6 font-['Manrope'] text-[clamp(40px,5.8vw,88px)] 3xl:text-[104px] 4k:text-[124px] font-semibold leading-[.95] tracking-[-.055em]">{t("Location Drives Insight")}<br />

                <em className="not-italic text-teal-300">{t("Governance Evolves")}</em>
              </h1>

              <p className="lgs-home-hero-description mt-6 max-w-2xl 3xl:max-w-3xl text-[13px] font-normal leading-6 text-slate-200 sm:text-[15px] sm:leading-7 3xl:text-[17px] 3xl:leading-8">{t("Public Services. Local Requests. Municipal Action. One Connected Map.\n                Spatio LGS is a geospatial decision-support platform built for Municipal\n                and Urban Councils managing real complexity.")}</p>
            </ScrollReveal>
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center text-[9px] font-semibold uppercase tracking-[.16em] text-white/60 3xl:bottom-10">
            <div className="flex animate-[scrollFloat_2s_ease-in-out_infinite] items-center gap-3">
              <i className="h-10 w-px bg-white/40 3xl:h-14"/>
              <span>{t("Scroll")}</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH
        ====================================================== */}
        {/* <section className="relative h-24 bg-white sm:h-28">
          <ScrollReveal
            className={`${sectionShell} absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2`}
            direction="up"
          >
            <form
              onSubmit={submitSearch}
              className="grid min-h-[118px] grid-cols-[auto_1fr_auto] items-center gap-4 border border-slate-200 bg-white px-6 py-5 shadow-[0_25px_70px_rgba(11,19,35,.15)] max-sm:grid-cols-[auto_1fr] max-sm:gap-3 max-sm:px-4"
            >
              <Search
                size={22}
                className="text-slate-400"
              />

              <input
                className="min-w-0 bg-transparent text-[14px] outline-none placeholder:text-slate-400"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search an address, building or place"
              />

              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-6 text-[11px] font-semibold uppercase tracking-[.06em] text-white transition hover:bg-slate-800 max-sm:col-span-2"
              >
                Search map
                <ArrowRight size={16} />
              </button>
            </form>
          </ScrollReveal>
        </section> */}

        {/* =====================================================
            THREE BENEFITS
        ====================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-white py-20 sm:py-24">
          {/* subtle decorative glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100/30 blur-3xl"/>

          <div className="mb-12 text-center">
            <span className={kicker}>
              {t('WHERE WE’RE HEADED')}
            </span>

            <h2 className="mx-auto mt-4 max-w-4xl font-['Manrope'] text-[clamp(42px,5vw,72px)] font-semibold leading-[.96] tracking-[-.045em]">
              {t('One Direction')}
              <br />
              {t('Two Ways to Say It')}
            </h2>
          </div>

          <div className={`${sectionShell} relative z-10 grid gap-5 md:grid-cols-2`}>
            {[
            [
                LocateFixed,
                'One Connected Council',
                'A spatially accurate digital foundation where requests, records and revenue do not get lost between departments.',
                'from-cyan-500/15 via-teal-500/10 to-transparent',
                'group-hover:text-cyan-600',
            ],
            [
                Layers3,
                'One Map. Every Department.',
                'Land records, permits, tax and revenue, certificates and citizen services work from the same verified geographic picture.',
                'from-emerald-500/15 via-teal-500/10 to-transparent',
                'group-hover:text-emerald-600',
            ],
        ].map(([Icon, title, body, gradient, iconHover,], index) => {
            const C = Icon as typeof LocateFixed;
            return (<ScrollReveal key={String(title)} delay={index * 120}>
                    <article className="
                        group relative min-h-[250px] overflow-hidden
                        rounded-3xl border border-slate-200/80
                        bg-white/90 p-7
                        shadow-[0_10px_40px_rgba(15,23,42,0.06)]
                        backdrop-blur-sm
                        transition-all duration-500
                        hover:-translate-y-2
                        hover:border-slate-300
                        hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]
                      ">
                      {/* hover gradient */}
                      <div className={`
                          pointer-events-none absolute inset-0
                          bg-gradient-to-br ${String(gradient)}
                          opacity-0 transition-opacity duration-500
                          group-hover:opacity-100
                        `}/>

                      {/* top accent line */}
                      <div className="
                          absolute left-7 right-7 top-0 h-px
                          bg-gradient-to-r from-transparent
                          via-teal-400/60 to-transparent
                          opacity-0 transition-opacity duration-500
                          group-hover:opacity-100
                        "/>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between">
                          <span className={`
                              grid h-14 w-14 place-items-center
                              rounded-2xl border border-slate-200
                              bg-slate-50 text-slate-700
                              shadow-sm
                              transition-all duration-500
                              group-hover:scale-110
                              group-hover:rotate-3
                              group-hover:border-transparent
                              group-hover:bg-white
                              ${String(iconHover)}
                            `}>
                            <C size={24} strokeWidth={1.8}/>
                          </span>
                        </div>

                        <div className="mt-10">
                          <h3 className="
                              font-['Manrope'] text-xl font-semibold
                              tracking-[-.02em] text-slate-900
                            ">
                            {t(String(title))}
                          </h3>

                          <p className="
                              mt-3 max-w-sm text-[13px] leading-6
                              text-slate-500
                              transition-colors duration-300
                              group-hover:text-slate-600
                            ">
                            {t(String(body))}
                          </p>
                        </div>

                        <div className="
                            mt-8 flex items-center gap-2
                            text-[10px] font-semibold uppercase
                            tracking-[.12em] text-teal-700
                            opacity-0 translate-y-2
                            transition-all duration-500
                            group-hover:translate-y-0
                            group-hover:opacity-100
                          ">
                          {t('Learn more')}
                          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1"/>
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>);
        })}
          </div>
        </section>

        {/* =====================================================
            SERVICES
        ====================================================== */}
        <section className="bg-[#f6f9fa] py-24 sm:py-28" id="services">
          <div className={sectionShell}>
            <ScrollReveal>
              <div className="mb-12 max-w-4xl">
                <span className={kicker}>
                  {t('One connected platform')}
                </span>

                <h2 className="mt-4 font-['Manrope'] text-[clamp(42px,5vw,72px)] font-semibold leading-[.96] tracking-[-.045em]">
                  {t('One Platform. Every Council Function.')}
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">
                  {t('Spatio LGS connects land and spatial intelligence, permits and licensing, tax and revenue, and citizen engagement through one verified geographic foundation.')}
                </p>
              </div>
            </ScrollReveal>

            <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {serviceCards.map(({ icon: Icon, eyebrow, title, body, tone, }, index) => (<ScrollReveal key={title} delay={index * 90} className="h-full">
                    <article className={`
                        group flex h-full min-h-[430px] cursor-pointer flex-col
                        rounded-2xl border border-slate-200 bg-white p-9
                        shadow-[0_10px_30px_rgba(15,23,42,0.05)]
                        transition-all duration-500 ease-out
                        hover:-translate-y-2
                        hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]
                        ${tone}
                      `}>
                      <span className="
                          grid h-16 w-16 place-items-center rounded-full
                          bg-teal-50 text-teal-700
                          transition-all duration-500 ease-out
                          group-hover:rotate-6
                          group-hover:scale-110
                          group-hover:bg-white
                          group-hover:shadow-md
                        ">
                        <Icon size={26} className="
                            transition-transform duration-500
                            group-hover:rotate-6
                          "/>
                      </span>

                      <small className="mt-12 block text-[9px] font-semibold uppercase tracking-[.15em] text-slate-400">
                        {t(eyebrow)}
                      </small>

                      <h3 className="mt-3 font-['Manrope'] text-3xl font-semibold uppercase tracking-[-.03em] text-slate-950 transition-colors duration-300">
                        {t(title)}
                      </h3>

                      <p className="mt-4 text-[12px] leading-6 text-slate-500">
                        {t(body)}
                      </p>

                      <Link className="
                          mt-auto inline-flex items-center gap-2 pt-10
                          text-[10px] font-semibold uppercase
                          tracking-[.08em] text-slate-800
                          transition-colors duration-300
                          group-hover:text-teal-700
                        " to="/services">
                        {t('View service')}

                        <ArrowRight size={15} className="
                            transition-transform duration-300 ease-out
                            group-hover:translate-x-2
                          "/>
                      </Link>
                    </article>
                  </ScrollReveal>))}
            </div>
          </div>
        </section>

        {/* =====================================================
            EXPLORE MUNICIPALITY
        ====================================================== */}
        <section className="py-24 sm:py-28">
          <div className={sectionShell}>
            <ScrollReveal>
              <div className="mb-12 text-center">
                <span className={kicker}>
                  {t('Strong geospatial foundation')}
                </span>

                <h2 className="mx-auto mt-4 max-w-4xl font-['Manrope'] text-[clamp(42px,5vw,72px)] font-semibold leading-[.96] tracking-[-.045em]">
                  {t('Every Layer of the City, Finally in One Place.')}
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid gap-6 lg:grid-cols-3">
              {featureCards.map((card, index) => (<ScrollReveal key={card.title} delay={index * 120}>
                  <article className="group">
                    <div className="h-[360px] overflow-hidden rounded-2xl">
                      <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={card.image} alt=""/>
                    </div>

                    <small className="mt-6 block text-[9px] font-semibold uppercase tracking-[.15em] text-teal-700">
                      {t(card.kicker)}
                    </small>

                    <h3 className="mt-2 font-['Manrope'] text-2xl font-semibold">
                      {t(card.title)}
                    </h3>

                    <p className="mt-2 text-[12px] leading-6 text-slate-500">
                      {t(card.body)}
                    </p>
                  </article>
                </ScrollReveal>))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SHARED FIXED BACKGROUND FOR 3 SECTIONS
        ====================================================== */}
        <div className="
            relative
            bg-[url('/lgs-media/BackgroundSole.png')]
            bg-cover
            bg-center
            bg-fixed
            bg-no-repeat
          ">
          {/* =====================================================
            WHY LGS
        ====================================================== */}
          <section className="relative overflow-hidden py-28 text-white sm:py-36">
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-slate-950/75"/>

            <div className={`${sectionShell} relative z-10`}>
              <ScrollReveal>
                <span className="text-[10px] font-semibold uppercase tracking-[.17em] text-teal-200">
                  {t('Why Spatio LGS?')}
                </span>

                <h2 className="mt-4 font-['Manrope'] text-[clamp(50px,5.5vw,84px)] font-semibold tracking-[-.045em]">
                  {t('One Filing Cabinet Away From Chaos')}
                </h2>
              </ScrollReveal>

              <div className="mt-16 grid gap-10 md:grid-cols-3">
                {[
            [
                MapPin,
                'From Filing to Finishing',
                'Real-time spatial data and automated workflows can turn long approval chains into faster, more accountable decisions.',
            ],
            [
                Users2,
                'Nothing Hidden, Nothing Lost',
                'Every department sees the same data, while citizens can follow their own request instead of wondering where it went.',
            ],
            [
                CheckCircle2,
                'Decisions Grounded in Reality',
                'Dashboards built on live field data help councils plan from what is actually there, not from assumptions.',
            ],
        ].map(([Icon, title, body], index) => {
            const C = Icon as typeof MapPin;
            return (<ScrollReveal key={String(title)} delay={index * 140} direction="scale" className="h-full">
                      <article className="
                          group
                          h-full
                          cursor-pointer
                          border-t
                          border-white/20
                          pt-7
                          transition-all
                          duration-500
                          hover:border-teal-300
                        ">
                        <span className="
                            grid
                            h-14
                            w-14
                            place-items-center
                            rounded-full
                            bg-white
                            text-slate-950
                            shadow-lg
                            transition-all
                            duration-500
                            group-hover:-translate-y-1
                            group-hover:rotate-6
                            group-hover:scale-110
                            group-hover:bg-teal-300
                          ">
                          <C />
                        </span>

                        <h3 className="
                            mt-6
                            font-['Manrope']
                            text-2xl
                            font-semibold
                            transition-colors
                            duration-300
                            group-hover:text-teal-200
                          ">
                          {t(String(title))}
                        </h3>

                        <p className="mt-3 max-w-sm text-[12px] leading-6 text-slate-300">
                          {t(String(body))}
                        </p>
                      </article>
                    </ScrollReveal>);
        })}
              </div>
            </div>
          </section>

          {/* =====================================================
            HOW IT WORKS
            Same background image stays behind this section too
        ====================================================== */}
          <section className="relative overflow-hidden py-24 sm:py-28">
            {/* Light translucent surface so the same image is visible */}
            <div className="absolute inset-0 bg-white/[0.93] backdrop-blur-[1px]"/>

            <div className={`${sectionShell} relative z-10`}>
              <ScrollReveal>
                <div className="grid gap-7 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
                  <div>
                    <span className={kicker}>
                      {t('How it works')}
                    </span>

                    <h2 className="mt-4 font-['Manrope'] text-[clamp(42px,5vw,72px)] font-semibold leading-[.96] tracking-[-.045em] text-slate-950">
                      {t('From a Location to a Decision')}
                      <br />
                      {t('- in Four Steps.')}
                    </h2>
                  </div>

                  <p className="max-w-xl text-sm leading-7 text-slate-600">
                    {t('Four steps. One system. A council that finally moves as fast as its city does.')}
                  </p>
                </div>
              </ScrollReveal>

              <div className="
                  mt-14
                  grid
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/70
                  bg-white/75
                  shadow-[0_25px_70px_rgba(15,23,42,.12)]
                  backdrop-blur-md
                  md:grid-cols-4
                ">
                {[
            [
                Crosshair,
                'Map It',
                'Every parcel, road, building and utility line becomes part of one accurate digital map of the council area.',
            ],
            [
                Building2,
                'Connect It',
                'Land records, permits, tax data and citizen services all link back to the same map.',
            ],
            [
                FileText,
                'Act On It',
                'Citizens access properties, applications, permits, tax dues, complaints, certificates and notifications from one dashboard.',
            ],
            [
                ShieldCheck,
                'Track It',
                'Commissioners and division heads can watch revenue, complaints and projects unfold in real time from one dashboard.',
            ],
        ].map(([Icon, title, body], index) => {
            const C = Icon as typeof Crosshair;
            const hoverColors = [
                'hover:bg-cyan-50/90',
                'hover:bg-blue-50/90',
                'hover:bg-violet-50/90',
                'hover:bg-emerald-50/90',
            ];
            const iconColors = [
                'group-hover:bg-cyan-600',
                'group-hover:bg-blue-600',
                'group-hover:bg-violet-600',
                'group-hover:bg-emerald-600',
            ];
            return (<ScrollReveal key={String(title)} delay={index * 100} className="h-full">
                      <article className={`
                          group
                          flex
                          h-full
                          min-h-[300px]
                          cursor-pointer
                          flex-col
                          border-b
                          border-slate-200/70
                          p-8
                          transition-all
                          duration-500
                          hover:-translate-y-1
                          ${hoverColors[index]}
                          md:border-b-0
                          md:border-r
                          md:last:border-r-0
                        `}>
                        

                        <span className={`
                            mt-10
                            grid
                            h-13
                            w-13
                            place-items-center
                            rounded-full
                            bg-slate-100
                            text-slate-700
                            transition-all
                            duration-500
                            group-hover:rotate-6
                            group-hover:scale-110
                            group-hover:text-white
                            ${iconColors[index]}
                          `}>
                          <C size={21}/>
                        </span>

                        <h3 className="mt-7 font-['Manrope'] text-2xl font-semibold text-slate-950">
                          {t(String(title))}
                        </h3>

                        <p className="mt-3 text-[12px] leading-6 text-slate-500">
                          {t(String(body))}
                        </p>
                      </article>
                    </ScrollReveal>);
        })}
              </div>
            </div>
          </section>

          {/* =====================================================
            GEOGRAPHIC INTELLIGENCE
            SAME EXACT BACKGROUND CONTINUES
        ====================================================== */}
          <section className="relative min-h-[650px] overflow-hidden text-white">
            {/* Gradient overlay only - background is still same parent image */}
            <div className="
                absolute
                inset-0
                bg-gradient-to-r
                from-slate-950/95
                via-slate-950/60
                to-slate-950/20
              "/>

            <div className={`
                ${sectionShell}
                relative
                z-10
                flex
                min-h-[650px]
                items-center
              `}>
              <ScrollReveal direction="left" className="max-w-3xl">
                <span className="text-[10px] font-semibold uppercase tracking-[.17em] text-teal-200">
                  {t('Geospatial foundation')}
                </span>

                <h2 className="mt-5 font-['Manrope'] text-[clamp(52px,6vw,90px)] font-semibold leading-[.9] tracking-[-.05em]">
                  {t('Every Layer of the City,')}
                  <br />
                  {t('Finally in One Place.')}
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
                  {t('From what’s underground to what’s being planned next — captured, mapped and ready to use.')}
                </p>

                <Link to="/map" className="
                    group
                    mt-8
                    inline-flex
                    min-h-[52px]
                    items-center
                    gap-3
                    rounded-md
                    bg-white
                    px-6
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[.05em]
                    !text-slate-950
                    shadow-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-teal-300
                  ">
                  {t('Open the municipal map')}

                  <ArrowRight size={16} className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-2
                    "/>
                </Link>
              </ScrollReveal>
            </div>
          </section>
        </div>

        {/* =====================================================
            IMAGE GRID
        ====================================================== */}
        <section className="py-24 sm:py-28">
          <div className={sectionShell}>
            <ScrollReveal>
              <div className="mb-12 text-center">
                <span className={kicker}>
                  {t('Connected spatial intelligence')}
                </span>

                <h2 className="mx-auto mt-4 max-w-4xl font-['Manrope'] text-[clamp(42px,5vw,72px)] font-semibold tracking-[-.045em]">
                  {t('One Map. Every Department. Every Answer.')}
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid auto-rows-[240px] gap-3 md:grid-cols-2 lg:grid-cols-4">
              {[
            'BackgroundSole.png',
            'ExploreYourArea.png',
            'FindCivicPlaces.png',
            'golden-hour-valley-town-aerial.png',
            'FollowLocalAction.png',
        ].map((src, index) => (<ScrollReveal key={src} delay={index * 60} direction="scale" className={index === 0
                ? 'lg:row-span-2'
                : index === 4
                    ? 'lg:col-span-2'
                    : ''}>
                  <div className="group h-full overflow-hidden rounded-2xl">
                    <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={`/lgs-media/${src}`} alt={t("Mapped municipality view")}/>
                  </div>
                </ScrollReveal>))}
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}
        <section className="
            relative overflow-hidden
            bg-[url('/lgs-media/Misty%20Tea%20Hills%20at%20Golden%20Sunrise.png')]
            bg-cover bg-center
            py-24 text-white
            before:absolute before:inset-0
            before:bg-gradient-to-r
            before:from-[#071522]/95
            before:via-[#071522]/78
            before:to-[#071522]/45
            sm:py-28
          ">
          <div className={`
              ${sectionShell}
              relative z-10 grid gap-16
              lg:grid-cols-[1.1fr_.9fr]
              lg:items-center
            `}>
            {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

            <ScrollReveal>
              <span className="
                  text-[10px] font-semibold uppercase
                  tracking-[.17em] text-teal-200
                ">
                {t('Ready to transform your council?')}
              </span>

              <h2 className="
                  mt-4 max-w-3xl
                  font-['Manrope']
                  text-[clamp(48px,5vw,78px)]
                  font-semibold
                  leading-[.95]
                  tracking-[-.045em]
                ">
                {t('Request a demo and meet our team.')}
              </h2>

              <p className="
                  mt-5 max-w-xl
                  text-sm leading-7
                  text-slate-300
                ">
                {t('See how Spatio LGS can bring land records, permits, revenue, assets and citizen services into one connected geospatial platform.')}
              </p>

              {/* ===================================================
            ACTION BUTTONS
        =================================================== */}

              <div className="mt-8 flex flex-wrap items-center gap-3">

                {/* Explore map */}

                <Link to="/map" className="
                    group
                    inline-flex min-h-[52px]
                    items-center justify-center gap-3
                    rounded-lg
                    bg-teal-500
                    px-6
                    text-[11px] font-bold uppercase
                    tracking-[.07em]
                    !text-white
                    shadow-[0_10px_30px_rgba(20,184,166,.20)]
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:bg-teal-400
                    hover:shadow-[0_14px_35px_rgba(20,184,166,.28)]
                  ">
                  <MapPin size={16} strokeWidth={1.8}/>

                  <span>
                    {t('Explore map')}
                  </span>

                  <ArrowRight size={16} className="
                      transition-transform duration-200
                      group-hover:translate-x-1
                    "/>
                </Link>

                {/* Request demo */}

                <Link to="/contact" className="
                    group
                    inline-flex min-h-[52px]
                    items-center justify-center gap-3
                    rounded-lg
                    border border-white/25
                    bg-white/[.07]
                    px-6
                    text-[11px] font-bold uppercase
                    tracking-[.07em]
                    !text-white
                    backdrop-blur-md
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:border-white/40
                    hover:bg-white/[.12]
                  ">
                  <span>
                    {t('Request a demo')}
                  </span>

                  <ArrowRight size={16} className="
                      transition-transform duration-200
                      group-hover:translate-x-1
                    "/>
                </Link>
              </div>
            </ScrollReveal>

            {/* =====================================================
            RIGHT INFORMATION CARDS
        ===================================================== */}

            <ScrollReveal delay={140} direction="right">
              <div className="grid gap-3">
                {[
            [
                Landmark,
                'Platform',
                'Spatio LGS',
            ],
            [
                MapPin,
                'Designed for',
                'Municipal & Urban Councils',
            ],
            [
                ShieldCheck,
                'Purpose',
                'Geospatial decision support',
            ],
        ].map(([Icon, label, value]) => {
            const C = Icon as typeof Landmark;
            return (<div key={String(label)} className="
                          flex items-center gap-4
                          rounded-xl
                          border border-white/15
                          bg-[#071522]/45
                          p-4
                          shadow-[0_12px_30px_rgba(0,0,0,.08)]
                          backdrop-blur-md
                          transition-all duration-200
                          hover:border-white/25
                          hover:bg-[#071522]/55
                        ">
                        <div className="
                            grid h-10 w-10
                            shrink-0 place-items-center
                            rounded-lg
                            border border-teal-300/15
                            bg-teal-400/10
                          ">
                          <C size={19} strokeWidth={1.7} className="text-teal-200"/>
                        </div>

                        <span>
                          <small className="
                              block
                              text-[9px]
                              uppercase
                              tracking-[.13em]
                              text-slate-400
                            ">
                            {t(String(label))}
                          </small>

                          <strong className="
                              mt-1 block
                              text-[12px]
                              font-semibold
                              text-white
                            ">
                            {t(String(value))}
                          </strong>
                        </span>
                      </div>);
        })}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>);
}
