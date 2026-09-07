import {
  ArrowRight,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  CircleHelp,
  Compass,
  Crosshair,
  FileText,
  Landmark,
  Layers3,
  LocateFixed,
  MapPin,
  MessageSquareWarning,
  Search,
  ShieldCheck,
  Sparkles,
  Users2,
} from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HeroMedia } from '../components/HeroMedia'
import { PublicFooter } from '../components/PublicFooter'
import { PublicHeader } from '../components/PublicHeader'
import { ScrollReveal } from '../components/ScrollReveal'
import { ParallaxSection } from '../components/ParallaxSection'

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
]

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
]

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
]

const sectionShell =
  'mx-auto w-[min(1500px,calc(100%-80px))] max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-32px)]'

const kicker =
  'text-[10px] font-extrabold uppercase tracking-[.17em] text-teal-700'

export function LandingPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()

    navigate(
      search.trim()
        ? `/map?q=${encodeURIComponent(search.trim())}`
        : '/map',
    )
  }

  return (
    <div className="min-h-screen bg-white font-['DM_Sans'] text-slate-950">
      <PublicHeader overlay />

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="relative min-h-[760px] overflow-hidden text-white sm:min-h-[820px] lg:h-screen lg:min-h-[760px]">
          <HeroMedia />

          <div
            className={`${sectionShell} relative z-10 flex h-full min-h-[760px] items-center pt-24 sm:min-h-[820px] lg:min-h-[760px] lg:-translate-y-10`}
          >
            <ScrollReveal
              direction="fade"
              className="max-w-4xl"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-teal-200">
                Spatio LGS
              </span>

              <h1 className="mt-6 font-['Manrope'] text-[clamp(58px,7vw,112px)] font-extrabold leading-[.88] tracking-[-.055em]">
                Location Meets Intelligence.
                <br />
                <em className="not-italic text-teal-300">
                  Governance Evolves.
                </em>
              </h1>

              <p className="mt-7 max-w-2xl text-[15px] leading-7 text-slate-200 sm:text-[17px]">
                Public Services. Local Requests. Municipal Action. One Connected Map. Spatio LGS is a geospatial decision-support platform built for Municipal and Urban Councils managing real complexity.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/map"
                  className="inline-flex min-h-[54px] min-w-[190px] items-center justify-center gap-2 rounded-md bg-white px-6 text-[11px] font-extrabold uppercase tracking-[.06em] !text-slate-950 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:bg-teal-200 hover:shadow-xl"
                >
                  <Compass size={17} />
                  Explore the map
                </Link>

                <Link
                  to="/login"
                  className="inline-flex min-h-[54px] min-w-[190px] items-center justify-center gap-2 rounded-md bg-white px-6 text-[11px] font-extrabold uppercase tracking-[.06em] !text-slate-950 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:bg-teal-200 hover:shadow-xl"
                >
                  Sign in
                  <ArrowRight size={16} />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-[9px] font-extrabold uppercase tracking-[.16em] text-white/60 lg:flex">
            <div className="flex animate-[scrollFloat_2s_ease-in-out_infinite] items-center gap-3">
              <i className="h-10 w-px bg-white/40" />
              <span>Scroll</span>
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
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-6 text-[11px] font-extrabold uppercase tracking-[.06em] text-white transition hover:bg-slate-800 max-sm:col-span-2"
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
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100/30 blur-3xl" />

          <div
            className={`${sectionShell} relative z-10 grid gap-5 md:grid-cols-3`}
          >
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
              [
                ShieldCheck,
                'One Platform. Every Council Function.',
                'Land and spatial intelligence, permits and licensing, revenue and citizen engagement come together in one connected system.',
                'from-violet-500/15 via-indigo-500/10 to-transparent',
                'group-hover:text-violet-600',
              ],
            ].map(
              (
                [
                  Icon,
                  title,
                  body,
                  gradient,
                  iconHover,
                ],
                index,
              ) => {
                const C = Icon as typeof LocateFixed

                return (
                  <ScrollReveal
                    key={String(title)}
                    delay={index * 120}
                  >
                    <article
                      className="
                        group relative min-h-[250px] overflow-hidden
                        rounded-3xl border border-slate-200/80
                        bg-white/90 p-7
                        shadow-[0_10px_40px_rgba(15,23,42,0.06)]
                        backdrop-blur-sm
                        transition-all duration-500
                        hover:-translate-y-2
                        hover:border-slate-300
                        hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]
                      "
                    >
                      {/* hover gradient */}
                      <div
                        className={`
                          pointer-events-none absolute inset-0
                          bg-gradient-to-br ${String(gradient)}
                          opacity-0 transition-opacity duration-500
                          group-hover:opacity-100
                        `}
                      />

                      {/* top accent line */}
                      <div
                        className="
                          absolute left-7 right-7 top-0 h-px
                          bg-gradient-to-r from-transparent
                          via-teal-400/60 to-transparent
                          opacity-0 transition-opacity duration-500
                          group-hover:opacity-100
                        "
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between">
                          <span
                            className={`
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
                            `}
                          >
                            <C size={24} strokeWidth={1.8} />
                          </span>
                        </div>

                        <div className="mt-10">
                          <h3
                            className="
                              font-['Manrope'] text-xl font-extrabold
                              tracking-[-.02em] text-slate-900
                            "
                          >
                            {String(title)}
                          </h3>

                          <p
                            className="
                              mt-3 max-w-sm text-[13px] leading-6
                              text-slate-500
                              transition-colors duration-300
                              group-hover:text-slate-600
                            "
                          >
                            {String(body)}
                          </p>
                        </div>

                        <div
                          className="
                            mt-8 flex items-center gap-2
                            text-[10px] font-extrabold uppercase
                            tracking-[.12em] text-teal-700
                            opacity-0 translate-y-2
                            transition-all duration-500
                            group-hover:translate-y-0
                            group-hover:opacity-100
                          "
                        >
                          Learn more
                          <ArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                )
              },
            )}
          </div>
        </section>

        {/* =====================================================
            SERVICES
        ====================================================== */}
        <section
          className="bg-[#f6f9fa] py-24 sm:py-28"
          id="services"
        >
          <div className={sectionShell}>
            <ScrollReveal>
              <div className="mb-12 max-w-4xl">
                <span className={kicker}>
                  One connected platform
                </span>

                <h2 className="mt-4 font-['Manrope'] text-[clamp(42px,5vw,72px)] font-extrabold leading-[.96] tracking-[-.045em]">
                  One Platform. Every Council Function.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">
                  Spatio LGS connects land and spatial intelligence, permits and licensing, tax and revenue, and citizen engagement through one verified geographic foundation.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {serviceCards.map(
                (
                  {
                    icon: Icon,
                    eyebrow,
                    title,
                    body,
                    tone,
                  },
                  index,
                ) => (
                  <ScrollReveal
                    key={title}
                    delay={index * 90}
                    className="h-full"
                  >
                    <article
                      className={`
                        group flex h-full min-h-[430px] cursor-pointer flex-col
                        rounded-2xl border border-slate-200 bg-white p-9
                        shadow-[0_10px_30px_rgba(15,23,42,0.05)]
                        transition-all duration-500 ease-out
                        hover:-translate-y-2
                        hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]
                        ${tone}
                      `}
                    >
                      <span
                        className="
                          grid h-16 w-16 place-items-center rounded-full
                          bg-teal-50 text-teal-700
                          transition-all duration-500 ease-out
                          group-hover:rotate-6
                          group-hover:scale-110
                          group-hover:bg-white
                          group-hover:shadow-md
                        "
                      >
                        <Icon
                          size={26}
                          className="
                            transition-transform duration-500
                            group-hover:rotate-6
                          "
                        />
                      </span>

                      <small className="mt-12 block text-[9px] font-extrabold uppercase tracking-[.15em] text-slate-400">
                        {eyebrow}
                      </small>

                      <h3 className="mt-3 font-['Manrope'] text-3xl font-extrabold uppercase tracking-[-.03em] text-slate-950 transition-colors duration-300">
                        {title}
                      </h3>

                      <p className="mt-4 text-[12px] leading-6 text-slate-500">
                        {body}
                      </p>

                      <Link
                        className="
                          mt-auto inline-flex items-center gap-2 pt-10
                          text-[10px] font-extrabold uppercase
                          tracking-[.08em] text-slate-800
                          transition-colors duration-300
                          group-hover:text-teal-700
                        "
                        to="/services"
                      >
                        View service

                        <ArrowRight
                          size={15}
                          className="
                            transition-transform duration-300 ease-out
                            group-hover:translate-x-2
                          "
                        />
                      </Link>
                    </article>
                  </ScrollReveal>
                ),
              )}
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
                  Strong geospatial foundation
                </span>

                <h2 className="mx-auto mt-4 max-w-4xl font-['Manrope'] text-[clamp(42px,5vw,72px)] font-extrabold leading-[.96] tracking-[-.045em]">
                  Every Layer of the City, Finally in One Place.
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid gap-6 lg:grid-cols-3">
              {featureCards.map((card, index) => (
                <ScrollReveal
                  key={card.title}
                  delay={index * 120}
                >
                  <article className="group">
                    <div className="h-[360px] overflow-hidden rounded-2xl">
                      <img
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        src={card.image}
                        alt=""
                      />
                    </div>

                    <small className="mt-6 block text-[9px] font-extrabold uppercase tracking-[.15em] text-teal-700">
                      {card.kicker}
                    </small>

                    <h3 className="mt-2 font-['Manrope'] text-2xl font-extrabold">
                      {card.title}
                    </h3>

                    <p className="mt-2 text-[12px] leading-6 text-slate-500">
                      {card.body}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SHARED FIXED BACKGROUND FOR 3 SECTIONS
        ====================================================== */}
        <div
          className="
            relative
            bg-[url('/lgs-media/BackgroundSole.png')]
            bg-cover
            bg-center
            bg-fixed
            bg-no-repeat
          "
        >
          {/* =====================================================
              WHY LGS
          ====================================================== */}
          <section className="relative overflow-hidden py-28 text-white sm:py-36">
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-slate-950/75" />

            <div
              className={`${sectionShell} relative z-10`}
            >
              <ScrollReveal>
                <span className="text-[10px] font-extrabold uppercase tracking-[.17em] text-teal-200">
                  Why Spatio LGS?
                </span>

                <h2 className="mt-4 font-['Manrope'] text-[clamp(50px,5.5vw,84px)] font-extrabold tracking-[-.045em]">
                  One Filing Cabinet Away From Chaos
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
                  const C = Icon as typeof MapPin

                  return (
                    <ScrollReveal
                      key={String(title)}
                      delay={index * 140}
                      direction="scale"
                      className="h-full"
                    >
                      <article
                        className="
                          group
                          h-full
                          cursor-pointer
                          border-t
                          border-white/20
                          pt-7
                          transition-all
                          duration-500
                          hover:border-teal-300
                        "
                      >
                        <span
                          className="
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
                          "
                        >
                          <C />
                        </span>

                        <h3
                          className="
                            mt-6
                            font-['Manrope']
                            text-2xl
                            font-extrabold
                            transition-colors
                            duration-300
                            group-hover:text-teal-200
                          "
                        >
                          {String(title)}
                        </h3>

                        <p className="mt-3 max-w-sm text-[12px] leading-6 text-slate-300">
                          {String(body)}
                        </p>
                      </article>
                    </ScrollReveal>
                  )
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
            <div className="absolute inset-0 bg-white/[0.93] backdrop-blur-[1px]" />

            <div className={`${sectionShell} relative z-10`}>
              <ScrollReveal>
                <div className="grid gap-7 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
                  <div>
                    <span className={kicker}>
                      How it works
                    </span>

                    <h2 className="mt-4 font-['Manrope'] text-[clamp(42px,5vw,72px)] font-extrabold leading-[.96] tracking-[-.045em] text-slate-950">
                      From a Location to a Decision
                      <br />
                      - in Four Steps.
                    </h2>
                  </div>

                  <p className="max-w-xl text-sm leading-7 text-slate-600">
                    Four steps. One system. A council that finally moves as fast as its city does.
                  </p>
                </div>
              </ScrollReveal>

              <div
                className="
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
                "
              >
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
                  const C = Icon as typeof Crosshair

                  const hoverColors = [
                    'hover:bg-cyan-50/90',
                    'hover:bg-blue-50/90',
                    'hover:bg-violet-50/90',
                    'hover:bg-emerald-50/90',
                  ]

                  const iconColors = [
                    'group-hover:bg-cyan-600',
                    'group-hover:bg-blue-600',
                    'group-hover:bg-violet-600',
                    'group-hover:bg-emerald-600',
                  ]

                  return (
                    <ScrollReveal
                      key={String(title)}
                      delay={index * 100}
                      className="h-full"
                    >
                      <article
                        className={`
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
                        `}
                      >
                        

                        <span
                          className={`
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
                          `}
                        >
                          <C size={21} />
                        </span>

                        <h3 className="mt-7 font-['Manrope'] text-2xl font-extrabold text-slate-950">
                          {String(title)}
                        </h3>

                        <p className="mt-3 text-[12px] leading-6 text-slate-500">
                          {String(body)}
                        </p>
                      </article>
                    </ScrollReveal>
                  )
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
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-slate-950/95
                via-slate-950/60
                to-slate-950/20
              "
            />

            <div
              className={`
                ${sectionShell}
                relative
                z-10
                flex
                min-h-[650px]
                items-center
              `}
            >
              <ScrollReveal
                direction="left"
                className="max-w-3xl"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-[.17em] text-teal-200">
                  Geospatial foundation
                </span>

                <h2 className="mt-5 font-['Manrope'] text-[clamp(52px,6vw,90px)] font-extrabold leading-[.9] tracking-[-.05em]">
                  Every Layer of the City,
                  <br />
                  Finally in One Place.
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
                  From what’s underground to what’s being planned next — captured, mapped and ready to use.
                </p>

                <Link
                  to="/map"
                  className="
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
                    font-extrabold
                    uppercase
                    tracking-[.05em]
                    !text-slate-950
                    shadow-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-teal-300
                  "
                >
                  Open the municipal map

                  <ArrowRight
                    size={16}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-2
                    "
                  />
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
                  Connected spatial intelligence
                </span>

                <h2 className="mx-auto mt-4 max-w-4xl font-['Manrope'] text-[clamp(42px,5vw,72px)] font-extrabold tracking-[-.045em]">
                  One Map. Every Department. Every Answer.
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid auto-rows-[240px] gap-3 md:grid-cols-2 lg:grid-cols-4">
              {[
                'map-west.jpg',
                'map-center.jpg',
                'map-east.jpg',
                'map-south.jpg',
                'map-full.jpg',
              ].map((src, index) => (
                <ScrollReveal
                  key={src}
                  delay={index * 60}
                  direction="scale"
                  className={
                    index === 0
                      ? 'lg:row-span-2'
                      : index === 4
                        ? 'lg:col-span-2'
                        : ''
                  }
                >
                  <div className="group h-full overflow-hidden rounded-2xl">
                    <img
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      src={`/lgs-media/${src}`}
                      alt="Mapped municipality view"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}
        <section className="relative overflow-hidden bg-[url('/lgs-media/map-center.jpg')] bg-cover bg-center py-24 text-white before:absolute before:inset-0 before:bg-[#071522]/85 sm:py-28">
          <div
            className={`${sectionShell} relative z-10 grid gap-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center`}
          >
            <ScrollReveal>
              <span className="text-[10px] font-extrabold uppercase tracking-[.17em] text-teal-200">
                Ready to transform your council?
              </span>

              <h2 className="mt-4 max-w-3xl font-['Manrope'] text-[clamp(48px,5vw,78px)] font-extrabold leading-[.95] tracking-[-.045em]">
                Request a demo and meet our team.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                See how Spatio LGS can bring land records, permits, revenue, assets and citizen services into one connected geospatial platform.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link
                  to="/map"
                  className="inline-flex min-h-[52px] items-center rounded-md bg-white px-6 text-[11px] font-extrabold uppercase tracking-[.05em] !text-slate-950"
                >
                  Explore map
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-b border-white/40 pb-2 text-[12px] font-extrabold"
                >
                  Request a demo
                  <ArrowRight size={16} />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal
              delay={140}
              direction="right"
            >
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
                  const C = Icon as typeof Landmark

                  return (
                    <div
                      className="flex items-center gap-4 border border-white/15 bg-white/[.06] p-4 backdrop-blur-sm"
                      key={String(label)}
                    >
                      <C className="text-teal-200" />

                      <span>
                        <small className="block text-[9px] uppercase tracking-[.13em] text-slate-400">
                          {String(label)}
                        </small>

                        <strong className="mt-1 block text-[12px]">
                          {String(value)}
                        </strong>
                      </span>
                    </div>
                  )
                })}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}