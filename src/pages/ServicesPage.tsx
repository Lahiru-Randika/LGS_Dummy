import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  FileCheck2,
  Globe2,
  Landmark,
  MapPin,
  Network,
  Settings2,
  Smartphone,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicFooter } from '../components/PublicFooter';
import { PublicHeader } from '../components/PublicHeader';
import { ScrollReveal } from '../components/ScrollReveal';

const sectionShell =
  'mx-auto w-[min(1500px,calc(100%-80px))] max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-28px)] max-[400px]:w-[calc(100%-20px)] 3xl:w-[min(1820px,calc(100%-120px))] 4k:w-[min(2360px,calc(100%-160px))]';

const items = [
  [
    Network,
    'Common Digital Platform',
    'A single shared system connecting every department — replacing scattered logins, forms and spreadsheets with one login and one source of truth.',
  ],
  [
    Settings2,
    'Customizable Workflows',
    'Adapts to the council’s existing processes and department structure instead of forcing the council to rebuild its operations from scratch.',
  ],
  [
    Globe2,
    'Public Portal & Mobile Access',
    'Access council services from anywhere through a responsive web portal and installable mobile experience without being tied to a council counter.',
  ],
  [
    MapPin,
    'Geo-Spatial Dashboard',
    'Maps, land data, municipal assets and operational decisions are layered onto one interactive geographic view of the council area.',
  ],
  [
    Smartphone,
    'Field Data Collection',
    'Turns mobile devices into real-time GIS-based data capture tools for field officers, making field information available quickly and accurately.',
  ],
  [
    BarChart3,
    'Report & Analytics',
    'Converts raw operational information into reports, tracking, planning and forecasting that council leadership can use for decision-making.',
  ],
  [
    Landmark,
    'Tax Collection & Revenue',
    'Manages assessments, bills, collections and arrears, with every revenue record linked to a real mapped property.',
  ],
  [
    FileCheck2,
    'Acquisition of Certificates',
    'Verifies, approves and issues Street Line Certificates and similar municipal documents digitally with complete audit trails.',
  ],
  [
    ClipboardList,
    'Process & Document Management',
    'Manages internal documents, approval workflows and audit trails so information does not get lost while moving between departments and officers.',
  ],
];

export function ServicesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-['DM_Sans'] text-slate-950">
      <PublicHeader overlay />

      <main>
        {/* =========================
            HERO SECTION
        ========================= */}
        <section
          className="relative flex h-[100dvh] min-h-[100dvh] w-full flex-col justify-start overflow-hidden text-white"
        >
          {/* Full Screen Hero Background Image */}
          <div className="absolute inset-0 h-full w-full overflow-hidden" aria-hidden="true">
            <img
              src="/lgs-media/BackgroundSole.png"
              alt=""
              className="h-full w-full object-cover object-center"
              draggable={false}
            />
            {/* Dark left-side overlay for hero text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#061522]/95 via-[#061522]/62 to-[#061522]/20" />
            {/* Slight bottom depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061522]/35 via-transparent to-black/10" />
          </div>

          <div
            className={`${sectionShell} relative z-10 flex h-full w-full items-center pt-20 pb-14 sm:pt-24 sm:pb-16`}
          >
            <ScrollReveal
              direction="fade"
              className="lgs-home-hero-copy max-w-4xl pl-4 sm:pl-8 md:pl-12 lg:pl-16 xl:pl-20 2xl:pl-24 3xl:max-w-5xl 3xl:pl-32 4k:max-w-6xl 4k:pl-40"
            >
              <span className="editorial-kicker text-teal-300">
                {t('Services')}
              </span>

              <h1 className="lgs-home-hero-title mt-6 font-['Manrope'] text-[clamp(40px,5.8vw,88px)] font-semibold leading-[.95] tracking-[-.055em] text-white normal-case 3xl:text-[104px] 4k:text-[124px]">
                {t('One platform. Ten jobs.')}
                <br />
                <span className="not-italic text-teal-300">
                  {t('Zero filing cabinets.')}
                </span>
              </h1>

              <p className="lgs-home-hero-description mt-6 max-w-2xl text-[14px] font-normal leading-relaxed text-slate-200 sm:text-[16px] sm:leading-7 3xl:max-w-3xl 3xl:text-[18px]">
                {t(
                  'Every job a council runs today, reimagined as one connected digital system.'
                )}
              </p>
            </ScrollReveal>
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[.18em] text-white/50 3xl:bottom-10">
            <span>{t('Scroll')}</span>
          </div>
        </section>

        {/* =========================
            SERVICES GRID
        ========================= */}
        <section className="section-pad">
          <div className="section-shell service-long-grid">
            {items.map(([Icon, title, body], index) => {
              const C = Icon as typeof MapPin;
              return (
                <ScrollReveal key={String(title)} delay={index * 100}>
                  <article className="service-card group">
                    {/* Top Loading Bar Track */}
                    <div className="service-card__loader-track" aria-hidden="true">
                      <div className="service-card__loader-bar" />
                    </div>

                    {/* Luxury Ambient Top Illumination */}
                    <div className="service-card__glow" aria-hidden="true" />

                    <span>
                      <C />
                    </span>

                    <div>
                      <div className="service-card__header">
                        <small>{t('Platform capability')}</small>
                        <span className="service-card__status-dot" aria-hidden="true" />
                      </div>

                      <h2>{t(String(title))}</h2>

                      <p>{t(String(body))}</p>

                      <Link to="/map">
                        <span>{t('Explore from the map')}</span>
                        <ArrowRight size={15} className="service-card__arrow" />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* =========================
            MAP FEATURE BANNER
        ========================= */}
        <section className="map-feature-banner map-feature-banner--short">
          <img src="/lgs-media/FindCivicPlaces.png" alt="" />

          <div className="map-feature-banner__overlay" />

          <div className="section-shell map-feature-banner__content">
            <ScrollReveal>
              <span className="editorial-kicker">{t('GIS integration')}</span>

              <h2>{t('The map that ties it all together.')}</h2>

              <p>
                {t(
                  'Geographic Information System integration lets spatial data drive planning, permitting, revenue management and service delivery across the council instead of remaining disconnected between departments.'
                )}
              </p>

              <Link to="/map" className="editorial-btn editorial-btn--light">
                {t('Explore the map')}
                <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
