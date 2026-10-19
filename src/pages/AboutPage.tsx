
import { useLanguage } from '../context/LanguageContext';
import {
  CheckCircle2,
  Layers3,
  ShieldCheck,
  Users2,
} from 'lucide-react';

import { PublicFooter } from '../components/PublicFooter';
import { PublicHeader } from '../components/PublicHeader';
import { ScrollReveal } from '../components/ScrollReveal';

const sectionShell =
  'mx-auto w-[min(1500px,calc(100%-80px))] max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-28px)] max-[400px]:w-[calc(100%-20px)] 3xl:w-[min(1820px,calc(100%-120px))] 4k:w-[min(2360px,calc(100%-160px))]';

export function AboutPage() {
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
                {t('About Spatio LGS')}
              </span>

              <h1 className="lgs-home-hero-title mt-6 font-['Manrope'] text-[clamp(40px,5.8vw,88px)] font-semibold leading-[.95] tracking-[-.055em] text-white normal-case 3xl:text-[104px] 4k:text-[124px]">
                {t('An Idea Born From a Real,')}
                <br />
                <span className="not-italic text-teal-300">
                  {t('Recurring Problem.')}
                </span>
              </h1>

              <p className="lgs-home-hero-description mt-6 max-w-2xl text-[14px] font-normal leading-relaxed text-slate-200 sm:text-[16px] sm:leading-7 3xl:max-w-3xl 3xl:text-[18px]">
                {t(
                  'Spatio LGS is a geospatial decision-support platform for Municipal and Urban Councils, bringing land management, permits, revenue, civic services and citizen engagement into one connected digital system.'
                )}
              </p>
            </ScrollReveal>
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[.18em] text-white/50 3xl:bottom-10">
            <span>{t('Scroll')}</span>
          </div>
        </section>

        {/* =========================
            ABOUT / APPROACH
        ========================= */}
        <section className="section-pad">
          <div className="section-shell about-editorial">
            <ScrollReveal direction="left">
              <div className="about-editorial__image">
                <img
                  src="/lgs-media/ExploreYourArea.png"
                  alt={t('Mapped municipal landscape')}
                  loading="lazy"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div>
                <span className="editorial-kicker editorial-kicker--dark">
                  {t('Our approach')}
                </span>

                <h2>
                  {t('One connected picture for every council.')}
                </h2>

                <p>
                  {t(
                    'Local government information is often spread across paper records, separate departments and disconnected systems. Spatio LGS connects land records, infrastructure, planning information and public services through one spatially aware platform, helping councils move toward connected, data-driven and sustainable governance.'
                  )}
                </p>

                <ul>
                  <li>
                    <Layers3 />
                    <span>
                      {t(
                        'Data-driven decisions using reliable, real-time and spatially aware information'
                      )}
                    </span>
                  </li>

                  <li>
                    <Users2 />
                    <span>
                      {t(
                        'Interoperability across departments, agencies and connected government systems'
                      )}
                    </span>
                  </li>

                  <li>
                    <CheckCircle2 />
                    <span>
                      {t(
                        'Citizen-centric services focused on accessibility, responsiveness and transparency'
                      )}
                    </span>
                  </li>

                  <li>
                    <ShieldCheck />
                    <span>
                      {t(
                        'Secure, privacy-aware and trusted handling of municipal information'
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
