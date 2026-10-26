import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  Crosshair,
  Eye,
  FileCheck2,
  FileText,
  Landmark,
  Layers3,
  LocateFixed,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  Users2,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HeroMedia } from '../components/HeroMedia'
import { PublicFooter } from '../components/PublicFooter'
import { PublicHeader } from '../components/PublicHeader'
import { ScrollReveal } from '../components/ScrollReveal'
import { useLanguage } from '../context/LanguageContext'

const sectionShell =
  'mx-auto w-[min(1500px,calc(100%-80px))] max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-28px)] max-[400px]:w-[calc(100%-20px)] 3xl:w-[min(1820px,calc(100%-120px))] 4k:w-[min(2360px,calc(100%-160px))]'
const kicker = 'text-[10px] font-semibold uppercase tracking-[.17em] text-teal-700 3xl:text-xs'

const MAP_LAYERS = [
  {
    id: 'properties',
    label: 'Properties',
    badge: 'Cadastral & Parcel Boundaries',
    stat: 'Registered Cadastral Parcels',
    image: '/lgs-media/layer-properties.jpg',
    icon: Layers3,
  },
  {
    id: 'landuse',
    label: 'Land Use',
    badge: 'Zoning & Master Plan Classifications',
    stat: 'Validated Municipal Zoning',
    image: '/lgs-media/layer-landuse.jpg',
    icon: Compass,
  },
  {
    id: 'roads',
    label: 'Roads',
    badge: 'Street Network & Ward Infrastructure',
    stat: 'Complete Council Road Grid',
    image: '/lgs-media/layer-roads.jpg',
    icon: Route,
  },
  {
    id: 'utilities',
    label: 'Utilities',
    badge: 'Underground & Surface Networks',
    stat: 'Subterranean Utility GIS',
    image: '/lgs-media/layer-utilities.jpg',
    icon: Zap,
  },
  {
    id: 'public_assets',
    label: 'Public Assets',
    badge: 'Civic Facilities & Council Properties',
    stat: 'Live Council Asset Register',
    image: '/lgs-media/layer-public-assets.jpg',
    icon: Landmark,
  },
]

export function LandingPage() {
  const { t } = useLanguage()
  const [activeLayerId, setActiveLayerId] = useState('properties')

  const activeLayer =
    MAP_LAYERS.find((layer) => layer.id === activeLayerId) || MAP_LAYERS[0]
  const ActiveIcon = activeLayer.icon

  return (
    <div className="min-h-screen bg-white font-['DM_Sans'] text-slate-950">
      <PublicHeader overlay />

      <main>
        {/* =====================================================
            SECTION 1 — HERO
        ====================================================== */}
        <section
          data-no-translate
          translate="no"
          className="relative flex h-[100dvh] min-h-[100dvh] w-full flex-col justify-start overflow-hidden text-white"
        >
          <HeroMedia />

          <div
            className={`${sectionShell} relative z-10 flex h-full w-full items-center pt-20 pb-14 sm:pt-24 sm:pb-16`}
          >
            <ScrollReveal
              direction="fade"
              className="lgs-home-hero-copy max-w-4xl pl-4 sm:pl-8 md:pl-12 lg:pl-16 xl:pl-20 2xl:pl-24 3xl:max-w-5xl 3xl:pl-32 4k:max-w-6xl 4k:pl-40"
            >
              <h1 className="lgs-home-hero-title mt-6 font-['Manrope'] text-[clamp(40px,5.8vw,88px)] font-semibold leading-[.95] tracking-[-.055em] 3xl:text-[104px] 4k:text-[124px]">
                {t('Location Drives Insight')}
                <br />
                <span className="not-italic text-teal-300">
                  {t('Governance Evolves')}
                </span>
              </h1>

              <p className="lgs-home-hero-description mt-6 max-w-2xl text-[14px] font-normal leading-relaxed text-slate-200 sm:text-[16px] sm:leading-7 3xl:max-w-3xl 3xl:text-[18px]">
                {t(
                  'Spatio LGS brings location intelligence into everyday council operations — helping local authorities manage services, respond to communities, and make informed decisions.'
                )}
              </p>

            </ScrollReveal>
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[.18em] text-white/50 3xl:bottom-10">
            <span>{t('Scroll')}</span>
          </div>
        </section>

        {/* =====================================================
            SECTION 2 — OUR VISION
        ====================================================== */}
        <section className="bg-slate-50/50 py-20 sm:py-28">
          <div className={`${sectionShell} relative z-10`}>
            <ScrollReveal className="mb-14 text-center">
              <span className={kicker}>{t("WHERE WE'RE HEADED")}</span>

              <h2 className="lgs-section-title mx-auto mt-4 max-w-4xl font-['Manrope'] text-[clamp(40px,4.8vw,68px)] font-semibold leading-[1.02] tracking-[-.045em] text-slate-950">
                {t('One Direction. Two Ways to Make It Happen.')}
              </h2>
            </ScrollReveal>

            <div className="grid gap-6 md:grid-cols-2">
              <ScrollReveal delay={100} className="h-full">
                <article className="group flex h-full min-h-[280px] flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-8 shadow-[0_1px_3px_rgba(15,23,42,0.03)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-teal-600/35 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)] sm:p-10">
                  <div>
                    <span className="grid h-12 w-12 place-items-center rounded-xl border border-teal-600/10 bg-teal-50 text-teal-700 transition-all duration-300 group-hover:border-teal-600/30 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-sm">
                      <Users2 size={24} strokeWidth={1.8} />
                    </span>

                    <h3 className="mt-6 font-['Manrope'] text-2xl font-semibold tracking-[-.025em] text-slate-900 transition-colors duration-200 group-hover:text-slate-950 sm:text-3xl">
                      {t('A Council That Works Together')}
                    </h3>

                    <p className="mt-4 text-[13px] leading-relaxed text-slate-600 sm:text-[14px] sm:leading-7">
                      {t(
                        'Bring departments, staff, and services into a more coordinated way of working — with clearer responsibilities and fewer disconnected processes.'
                      )}
                    </p>
                  </div>

                  <div className="mt-8 pt-4">
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.1em] text-teal-700 transition-colors duration-200 group-hover:text-teal-900"
                    >
                      <span>{t('Learn more')}</span>
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={200} className="h-full">
                <article className="group flex h-full min-h-[280px] flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-8 shadow-[0_1px_3px_rgba(15,23,42,0.03)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-teal-600/35 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)] sm:p-10">
                  <div>
                    <span className="grid h-12 w-12 place-items-center rounded-xl border border-teal-600/10 bg-teal-50 text-teal-700 transition-all duration-300 group-hover:border-teal-600/30 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-sm">
                      <MapPin size={24} strokeWidth={1.8} />
                    </span>

                    <h3 className="mt-6 font-['Manrope'] text-2xl font-semibold tracking-[-.025em] text-slate-900 transition-colors duration-200 group-hover:text-slate-950 sm:text-3xl">
                      {t('A City That Makes Sense on the Map')}
                    </h3>

                    <p className="mt-4 text-[13px] leading-relaxed text-slate-600 sm:text-[14px] sm:leading-7">
                      {t(
                        'Understand properties, infrastructure, and local needs through accurate spatial information that supports planning and service delivery.'
                      )}
                    </p>
                  </div>

                  <div className="mt-8 pt-4">
                    <Link
                      to="/map"
                      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.1em] text-teal-700 transition-colors duration-200 group-hover:text-teal-900"
                    >
                      <span>{t('Learn more')}</span>
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION 3 — PLATFORM CAPABILITIES
        ====================================================== */}
        <section className="bg-[#f7fafb] py-20 sm:py-28" id="capabilities">
          <div className={sectionShell}>
            <ScrollReveal className="mb-14 max-w-4xl">
              <span className={kicker}>{t('BUILT FOR LOCAL GOVERNMENT')}</span>

              <h2 className="lgs-section-title mt-4 font-['Manrope'] text-[clamp(38px,4.5vw,64px)] font-semibold leading-[1.02] tracking-[-.045em] text-slate-950">
                {t('The Tools Behind Better Council Services.')}
              </h2>

              <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-slate-600 sm:text-[15px]">
                {t(
                  'From property administration to public requests, Spatio LGS supports the essential work of local authorities through practical digital tools.'
                )}
              </p>
            </ScrollReveal>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: Landmark,
                  title: 'Land & Property',
                  body: 'Organize parcels, ownership records, boundaries, and zoning information for more reliable land administration.',
                  link: '/services',
                },
                {
                  icon: FileCheck2,
                  title: 'Permits & Licensing',
                  body: 'Manage applications, reviews, approvals, and certificates with clear progress tracking.',
                  link: '/services',
                },
                {
                  icon: ShieldCheck,
                  title: 'Revenue & Payments',
                  body: 'Keep assessments, billing, collections, and outstanding payments organized around property records.',
                  link: '/services',
                },
                {
                  icon: Users2,
                  title: 'Citizen Services',
                  body: 'Give residents a clearer way to submit requests, report issues, and follow the progress of council services.',
                  link: '/services',
                },
              ].map(({ icon: Icon, title, body, link }, index) => (
                <ScrollReveal
                  key={title}
                  delay={index * 80}
                  className="h-full"
                >
                  <article className="group flex h-full min-h-[320px] flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-7 shadow-[0_1px_3px_rgba(15,23,42,0.03)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-teal-600/35 hover:shadow-[0_20px_35px_-12px_rgba(15,23,42,0.08)]">
                    <div>
                      <span className="grid h-12 w-12 place-items-center rounded-xl border border-teal-600/10 bg-teal-50 text-teal-700 transition-all duration-300 group-hover:border-teal-600/30 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-sm">
                        <Icon size={22} strokeWidth={1.8} />
                      </span>

                      <h3 className="mt-6 font-['Manrope'] text-xl font-semibold tracking-[-.02em] text-slate-950 transition-colors duration-200 group-hover:text-teal-950 sm:text-2xl">
                        {t(title)}
                      </h3>

                      <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
                        {t(body)}
                      </p>
                    </div>

                    <div className="mt-6 pt-2">
                      <Link
                        to={link}
                        className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.08em] text-slate-900 transition-colors duration-200 group-hover:text-teal-700"
                      >
                        <span>{t('Explore Service')}</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION 4 — GEOSPATIAL INTELLIGENCE
        ====================================================== */}
        <section className="py-20 sm:py-28">
          <div className={sectionShell}>
            <ScrollReveal className="mb-14 text-center">
              <span className={kicker}>{t('THE GEOSPATIAL ADVANTAGE')}</span>

              <h2 className="lgs-section-title mx-auto mt-4 max-w-4xl font-['Manrope'] text-[clamp(38px,4.5vw,64px)] font-semibold leading-[1.02] tracking-[-.045em] text-slate-950">
                {t("See What Traditional Records Can't Show.")}
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-slate-600 sm:text-[15px]">
                {t(
                  'A map reveals relationships that spreadsheets and filing systems often miss. Spatio LGS helps councils understand where assets are located, how infrastructure connects, and what changes across their areas.'
                )}
              </p>
            </ScrollReveal>

            <div className="grid gap-7 lg:grid-cols-3">
              {[
                {
                  title: 'Land Information System',
                  body: 'Build a clearer picture of properties, parcels, boundaries, and their associated records.',
                  image: '/lgs-media/ExploreYourArea.png',
                },
                {
                  title: 'Urban Planning',
                  body: 'Use land-use patterns, zoning, and development information to support informed planning decisions.',
                  image: '/lgs-media/FindCivicPlaces.png',
                },
                {
                  title: 'Utility Network Management',
                  body: 'Locate and understand underground water, sewerage, electricity, and telecommunications networks.',
                  image: '/lgs-media/FollowLocalAction.png',
                },
              ].map((card, index) => (
                <ScrollReveal key={card.title} delay={index * 120}>
                  <article className="group h-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-teal-600/35 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)]">
                    <div className="relative h-64 overflow-hidden bg-slate-100 sm:h-72">
                      <img
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        src={card.image}
                        alt={t(card.title)}
                        loading="lazy"
                      />
                    </div>

                    <div className="p-7">
                      <h3 className="font-['Manrope'] text-xl font-semibold text-slate-950 transition-colors duration-200 group-hover:text-teal-950 sm:text-2xl">
                        {t(card.title)}
                      </h3>

                      <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
                        {t(card.body)}
                      </p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION 5 — WHY SPATIO LGS
        ====================================================== */}
        <section className="bg-[#071522] py-20 text-white sm:py-28">
          <div className={`${sectionShell} relative z-10`}>
            <ScrollReveal className="mb-14">
              <span className="text-[10px] font-semibold uppercase tracking-[.17em] text-teal-300">
                {t('WHY SPATIO LGS?')}
              </span>

              <h2 className="lgs-section-title mt-4 font-['Manrope'] text-[clamp(40px,4.8vw,68px)] font-semibold leading-[1.02] tracking-[-.045em] text-white">
                {t('Less Friction. More Progress.')}
              </h2>
            </ScrollReveal>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: 'Move Work Forward',
                  body: 'Reduce repetitive administration and help applications move through each stage with clearer ownership and fewer delays.',
                },
                {
                  icon: Eye,
                  title: 'Make Progress Visible',
                  body: 'Give staff and residents a clearer understanding of request status, pending actions, and next steps.',
                },
                {
                  icon: Compass,
                  title: 'Plan With Confidence',
                  body: 'Identify service gaps, review local trends, and prioritize work using recorded information and geographic context.',
                },
              ].map(({ icon: Icon, title, body }, index) => (
                <ScrollReveal
                  key={title}
                  delay={index * 120}
                  className="h-full"
                >
                  <article className="group flex h-full min-h-[260px] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.025] p-8 sm:p-9 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-teal-400/40 hover:bg-white/[0.05] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                    <div>
                      <div>
                        <span className="grid h-12 w-12 place-items-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-300 transition-all duration-300 group-hover:border-teal-400/50 group-hover:bg-teal-400/20 group-hover:text-teal-200">
                          <Icon size={22} strokeWidth={1.8} />
                        </span>
                      </div>

                      <h3 className="mt-7 font-['Manrope'] text-2xl font-semibold text-white transition-colors duration-200 group-hover:text-teal-100">
                        {t(title)}
                      </h3>

                      <p className="mt-3.5 text-[13px] leading-relaxed text-slate-300">
                        {t(body)}
                      </p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION 6 — HOW IT WORKS
        ====================================================== */}
        <section className="bg-slate-50/70 py-20 sm:py-28">
          <div className={sectionShell}>
            <ScrollReveal className="mb-14">
              <span className={kicker}>{t('HOW IT WORKS')}</span>

              <h2 className="lgs-section-title mt-4 font-['Manrope'] text-[clamp(38px,4.5vw,64px)] font-semibold leading-[1.02] tracking-[-.045em] text-slate-950">
                {t('From Local Information to Meaningful Action.')}
              </h2>

              <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-slate-600 sm:text-[15px]">
                {t(
                  'A simple process that turns geographic information and everyday council activity into coordinated work.'
                )}
              </p>
            </ScrollReveal>

            {/* Horizontal timeline on desktop / Vertical on mobile */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Crosshair,
                  title: 'Map the Area',
                  body: 'Capture properties, roads, buildings, and infrastructure in a geographic information system.',
                },
                {
                  icon: Building2,
                  title: 'Link the Records',
                  body: 'Associate council records and service information with their relevant locations.',
                },
                {
                  icon: FileText,
                  title: 'Deliver the Service',
                  body: 'Process applications, respond to requests, and coordinate tasks across the responsible teams.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Review the Results',
                  body: 'Monitor progress, identify outstanding work, and use reports to guide the next decision.',
                },
              ].map(({ icon: Icon, title, body }, index) => (
                <ScrollReveal key={title} delay={index * 100} className="h-full">
                  <div className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-7 shadow-[0_1px_3px_rgba(15,23,42,0.03)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-teal-600/35 hover:shadow-[0_18px_32px_-12px_rgba(15,23,42,0.07)]">
                    <div>
                      <div>
                        <span className="grid h-11 w-11 place-items-center rounded-xl border border-teal-600/10 bg-teal-50 text-teal-700 transition-all duration-300 group-hover:border-teal-600/30 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-sm">
                          <Icon size={20} strokeWidth={1.8} />
                        </span>
                      </div>

                      <h3 className="mt-6 font-['Manrope'] text-lg font-bold text-slate-950 transition-colors duration-200 group-hover:text-teal-950 sm:text-xl">
                        {t(title)}
                      </h3>

                      <p className="mt-3 text-[12.5px] leading-relaxed text-slate-600">
                        {t(body)}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION 7 — INTERACTIVE MAP PREVIEW
        ====================================================== */}
        <section className="py-20 sm:py-28" id="map-preview">
          <div className={sectionShell}>
            <ScrollReveal className="mb-12">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
                <div>
                  <span className={kicker}>{t('EXPLORE SPATIO LGS')}</span>

                  <h2 className="lgs-section-title mt-4 font-['Manrope'] text-[clamp(38px,4.5vw,64px)] font-semibold leading-[1.02] tracking-[-.045em] text-slate-950">
                    {t('Your Council Area, From a New Perspective.')}
                  </h2>
                </div>

                <p className="text-[14px] leading-relaxed text-slate-600 sm:text-[15px]">
                  {t(
                    'Explore how geographic information can bring properties, infrastructure, and council activities into a clearer view.'
                  )}
                </p>
              </div>
            </ScrollReveal>

            {/* Interactive Layer Chips with Symbols */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-slate-400">
                <Layers3 size={13} className="text-teal-600" />
                {t('Layers')}:
              </span>
              {MAP_LAYERS.map((layer) => {
                const isSelected = layer.id === activeLayerId
                const Icon = layer.icon
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12px] font-semibold transition-all duration-200 hover:-translate-y-0.5 ${isSelected
                      ? 'bg-slate-950 text-white shadow-md shadow-slate-950/20 ring-1 ring-slate-800'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-teal-500/40 hover:bg-slate-50 hover:text-slate-950 hover:shadow-sm'
                      }`}
                  >
                    <Icon
                      size={14}
                      className={isSelected ? 'text-teal-400' : 'text-slate-400'}
                    />
                    <span>{t(layer.label)}</span>
                  </button>
                )
              })}
            </div>

            {/* Map Frame Card */}
            <div className="group/map relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition-all duration-500 hover:border-slate-300 hover:shadow-[0_20px_45px_-12px_rgba(15,23,42,0.14)]">
              <div className="relative min-h-[460px] w-full sm:min-h-[520px]">
                {/* Real Generated Municipal Map Assets with smooth crossfade */}
                {MAP_LAYERS.map((layer) => {
                  const isVisible = layer.id === activeLayerId
                  return (
                    <img
                      key={layer.id}
                      src={layer.image}
                      alt={t(layer.label)}
                      className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover/map:scale-[1.015] ${isVisible ? 'opacity-90 z-0' : 'opacity-0 pointer-events-none'
                        }`}
                    />
                  )
                })}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/40" />

                {/* Top Status Badges */}
                <div className="absolute left-6 right-6 top-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/80 px-4 py-1.5 text-[11px] font-semibold text-white">
                    <LocateFixed size={14} className="text-teal-400" />
                    <span>{t('Municipal Spatial Grid · Colombo GIS')}</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-950/80 px-4 py-1.5 text-[11px] font-bold text-teal-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                    <span>{t(activeLayer.stat)}</span>
                  </div>
                </div>

                {/* Active Layer Compact Floating HUD Dock */}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col justify-between gap-4 rounded-2xl border border-white/15 bg-slate-950/80 px-5 py-3.5 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3.5">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-teal-400/30 bg-teal-500/15 text-teal-300">
                      <ActiveIcon size={20} strokeWidth={2} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white tracking-tight sm:text-lg">
                          {t(activeLayer.label)}
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                          <CheckCircle2 size={11} className="text-teal-400" />
                          <span>{t(activeLayer.badge)}</span>
                        </span>
                      </div>

                      <div className="mt-0.5 flex items-center gap-2 text-[11px] font-medium text-teal-300/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                        <span>{t(activeLayer.stat)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link
                      to="/map"
                      className="group/mapbtn inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 text-[12px] font-bold uppercase tracking-[.05em] !text-slate-950 shadow-[0_2px_12px_rgba(20,184,166,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-400 hover:shadow-[0_6px_20px_rgba(20,184,166,0.35)]"
                    >
                      <MapPin size={15} />
                      <span>{t('Explore Map')}</span>
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover/mapbtn:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION 8 — FINAL CALL TO ACTION
        ====================================================== */}
        <section className="relative overflow-hidden bg-[url('/lgs-media/Misty%20Tea%20Hills%20at%20Golden%20Sunrise.png')] bg-cover bg-center py-20 text-white before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#061420]/95 before:via-[#061420]/80 before:to-[#061420]/55 sm:py-28">
          <div className={`${sectionShell} relative z-10`}>
            <ScrollReveal className="max-w-3xl">
              <span className="text-[10px] font-semibold uppercase tracking-[.17em] text-teal-300">
                {t('TAKE THE NEXT STEP')}
              </span>

              <h2 className="lgs-section-title mt-4 font-['Manrope'] text-[clamp(40px,4.8vw,68px)] font-semibold leading-[1.02] tracking-[-.045em] text-white">
                {t('Ready to Rethink How Your Council Works?')}
              </h2>

              <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-slate-200 sm:text-[16px] sm:leading-7">
                {t(
                  "Discover how Spatio LGS can support your council's day-to-day operations and long-term planning."
                )}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-teal-500 px-8 text-[12px] font-bold uppercase tracking-[.08em] !text-slate-950 shadow-[0_4px_20px_rgba(20,184,166,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-400 hover:shadow-[0_8px_28px_rgba(20,184,166,0.35)]"
                >
                  <span>{t('Request a Demo')}</span>
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-8 text-[12px] font-bold uppercase tracking-[.08em] !text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
                >
                  <span>{t('Contact Our Team')}</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
