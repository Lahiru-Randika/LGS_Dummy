import { useLanguage } from '../context/LanguageContext'
import { CheckCircle2, Layers3, ShieldCheck, Users2, } from 'lucide-react';
import { PublicFooter, } from '../components/PublicFooter';
import { PublicHeader, } from '../components/PublicHeader';
import { ScrollReveal, } from '../components/ScrollReveal';
export function AboutPage() {
    const { t } = useLanguage();
    return (<div className="public-site public-inner-page">
      <PublicHeader />

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="inner-hero inner-hero--about">
          <div className="section-shell">
            <ScrollReveal>
              <span className="editorial-kicker">{t("About Spatio LGS")}</span>

              <h1>{t("An idea born from a")}<br />{t("real, recurring problem.")}</h1>

              <p>{t("Spatio LGS is a geospatial decision-support\r\n                platform for Municipal and Urban Councils,\r\n                bringing land management, permits, revenue,\r\n                civic services and citizen engagement into\r\n                one connected digital system.")}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* =====================================================
            ABOUT / APPROACH
        ====================================================== */}

        <section className="section-pad">
          <div className="section-shell about-editorial">
            <ScrollReveal direction="left">
              <div className="about-editorial__image">
                <img src="/lgs-media/ExploreYourArea.png" alt={t("Mapped municipal landscape")}/>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div>
                <span className="editorial-kicker editorial-kicker--dark">{t("Our approach")}</span>

                <h2>{t("One connected picture for every council.")}</h2>

                <p>{t("Local government information is often spread\r\n                  across paper records, separate departments and\r\n                  disconnected systems. Spatio LGS connects land\r\n                  records, infrastructure, planning information\r\n                  and public services through one spatially aware\r\n                  platform, helping councils move toward\r\n                  connected, data-driven and sustainable\r\n                  governance.")}</p>

                <ul>
                  <li>
                    <Layers3 />{t("Data-driven decisions using reliable,\r\n                    real-time and spatially aware information")}</li>

                  <li>
                    <Users2 />{t("Interoperability across departments,\r\n                    agencies and connected government systems")}</li>

                  <li>
                    <CheckCircle2 />{t("Citizen-centric services focused on\r\n                    accessibility, responsiveness and\r\n                    transparency")}</li>

                  <li>
                    <ShieldCheck />{t("Secure, privacy-aware and trusted handling\r\n                    of municipal information")}</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>);
}
