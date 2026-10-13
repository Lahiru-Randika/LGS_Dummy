import { useLanguage } from '../context/LanguageContext'
import { ArrowRight, BarChart3, ClipboardList, FileCheck2, Globe2, Landmark, MapPin, Network, Settings2, Smartphone, } from 'lucide-react';
import { Link, } from 'react-router-dom';
import { PublicFooter, } from '../components/PublicFooter';
import { PublicHeader, } from '../components/PublicHeader';
import { ScrollReveal, } from '../components/ScrollReveal';
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
    return (<div className="public-site public-inner-page">
      <PublicHeader />

      <main>
        <section className="inner-hero inner-hero--services">
          <div className="section-shell">
            <ScrollReveal>
              <span className="editorial-kicker">{t("Services")}</span>

              <h1>{t("One platform. Ten jobs.")}<br />{t("Zero filing cabinets.")}</h1>

              <p>{t("Every function a municipal council runs today,\r\n                rebuilt as one connected digital system.")}</p>
            </ScrollReveal>
          </div>
        </section>

        <section className="section-pad">
          <div className="section-shell service-long-grid">
            {items.map(([Icon, title, body,], index) => {
            const C = Icon as typeof MapPin;
            return (<ScrollReveal key={String(title)} delay={index *
                    100}>
                    <article>
                      <span>
                        <C />
                      </span>

                      <div>
                        <small>{t("Platform capability")}</small>

                        <h2>
                          {String(title)}
                        </h2>

                        <p>
                          {String(body)}
                        </p>

                        <Link to="/map">{t("Explore from the map")}<ArrowRight size={15}/>
                        </Link>
                      </div>
                    </article>
                  </ScrollReveal>);
        })}
          </div>
        </section>

        <section className="map-feature-banner map-feature-banner--short">
          <img src="/lgs-media/FindCivicPlaces.png" alt=""/>

          <div className="map-feature-banner__overlay"/>

          <div className="section-shell map-feature-banner__content">
            <ScrollReveal>
              <span className="editorial-kicker">{t("GIS integration")}</span>

              <h2>{t("The map that ties")}<br />{t("it all together.")}</h2>

              <p>{t("Geographic Information System integration lets\r\n                spatial data drive planning, permitting,\r\n                revenue management and service delivery across\r\n                the council instead of remaining disconnected\r\n                between departments.")}</p>

              <Link to="/map" className="editorial-btn editorial-btn--light">{t("Explore the map")}<ArrowRight size={16}/>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>);
}
