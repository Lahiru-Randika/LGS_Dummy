import { useLanguage } from '../context/LanguageContext'
import { Building2, Clock3, Mail, MapPin, Phone, Send, } from 'lucide-react';
import { FormEvent, useState, } from 'react';
import { ContactLocationMap, } from '../components/ContactLocationMap';
import { PublicFooter, } from '../components/PublicFooter';
import { PublicHeader, } from '../components/PublicHeader';
import { ScrollReveal, } from '../components/ScrollReveal';
import { ApiError, } from '../services/http';
import { publicService, } from '../services/public.service';
export function ContactPage() {
    const { t } = useLanguage();
    const [name, setName,] = useState('');
    const [email, setEmail,] = useState('');
    const [subject, setSubject,] = useState('');
    const [message, setMessage,] = useState('');
    const [status, setStatus,] = useState('');
    const [sending, setSending,] = useState(false);
    async function submit(event: FormEvent) {
        event.preventDefault();
        setStatus('');
        setSending(true);
        try {
            await publicService.contact({
                name,
                email,
                subject,
                message,
            });
            setStatus('Demo request received. Our team will get in touch with you.');
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        }
        catch (error) {
            setStatus(error instanceof
                ApiError
                ? error.message
                : 'Unable to send the request.');
        }
        finally {
            setSending(false);
        }
    }
    return (<div className="public-site public-inner-page">
      <PublicHeader />

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="inner-hero inner-hero--contact">
          <div className="section-shell">
            <ScrollReveal>
              <span className="editorial-kicker">{t("Contact")}</span>

              <h1>{t("Let\u2019s put your council")}<br />{t("on the map.")}</h1>

              <p>{t("Talk to the Spatio LGS team about your council\u2019s\r\n                needs, existing challenges and how a connected\r\n                geospatial platform can support better local\r\n                government operations.")}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* =====================================================
            CONTACT
        ====================================================== */}

        <section className="section-pad contact-editorial">
          <div className="section-shell contact-editorial__grid">
            <ScrollReveal direction="left">
              <div className="contact-editorial__info">
                <span className="editorial-kicker editorial-kicker--dark">{t("Prefer to reach us directly?")}</span>

                <h2>{t("Talk to an expert.")}</h2>

                <p>{t("Tell us about your council, the services you\r\n                  want to improve and the problems you are\r\n                  hoping to solve. Our team can walk you through\r\n                  how Spatio LGS can work in your own council\r\n                  area.")}</p>

                <div className="contact-detail">
                  <MapPin />

                  <span>
                    <small>{t("Office")}</small>

                    <strong>{t("No. 44, Beddagana South Road,\r\n                      Pitakotte")}</strong>
                  </span>
                </div>

                <div className="contact-detail">
                  <Phone />

                  <span>
                    <small>{t("Phone")}</small>

                    <strong>
                      +94 77 330 1274
                    </strong>
                  </span>
                </div>

                <div className="contact-detail">
                  <Mail />

                  <span>
                    <small>{t("Email")}</small>

                    <strong>{t("info@spatiosds.com")}</strong>
                  </span>
                </div>

                <div className="contact-detail">
                  <Clock3 />

                  <span>
                    <small>{t("Purpose")}</small>

                    <strong>{t("Platform demos, council implementation\r\n                      and solution discussions")}</strong>
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <form className="contact-editorial__form" onSubmit={submit}>
                <label>
                  <span>{t("Full name")}</span>

                  <input placeholder={t("Your full name")} value={name} onChange={(event) => setName(event.target.value)} required/>
                </label>

                <div>
                  <label>
                    <span>{t("Email address")}</span>

                    <input type="email" placeholder={t("you@example.com")} value={email} onChange={(event) => setEmail(event.target.value)} required/>
                  </label>

                  <label>
                    <span>{t("Primary service need")}</span>

                    <input placeholder={t("Land, tax, permits, complaints...")} value={subject} onChange={(event) => setSubject(event.target.value)} required/>
                  </label>
                </div>

                <label>
                  <span>{t("What are you hoping to solve?")}</span>

                  <textarea rows={7} placeholder={t("Tell us about your council, current challenges and what you would like to improve\u2026")} value={message} onChange={(event) => setMessage(event.target.value)} required/>
                </label>

                {status && (<small>
                    {status}
                  </small>)}

                <button type="submit" disabled={sending}>
                  <Send size={16}/>

                  {sending
            ? 'Sending…'
            : 'Request a demo'}
                </button>
              </form>
            </ScrollReveal>
          </div>
        </section>

        {/* =====================================================
            INFORMATION CARDS
        ====================================================== */}

        <section className="office-card-section">
          <div className="section-shell office-card-grid">
            {[
            [
                Building2,
                'Council implementation',
                'Spatio LGS',
                'A connected platform for Municipal and Urban Council operations.',
            ],
            [
                MapPin,
                'Geospatial foundation',
                'One verified map',
                'Bring land, infrastructure, services and operational information together spatially.',
            ],
            [
                ShieldIcon,
                'Decision support',
                'Connected governance',
                'Support council teams with secure, role-based information and shared operational visibility.',
            ],
        ].map(([Icon, title, sub, body,], index) => {
            const C = Icon as typeof Building2;
            return (<ScrollReveal key={String(title)} delay={index *
                    100}>
                    <article>
                      <span>
                        <C />
                      </span>

                      <h3>
                        {String(title)}
                      </h3>

                      <strong>
                        {String(sub)}
                      </strong>

                      <p>
                        {String(body)}
                      </p>
                    </article>
                  </ScrollReveal>);
        })}
          </div>
        </section>

        {/* =====================================================
            MAP
        ====================================================== */}

        <section className="contact-map-live">
          <ContactLocationMap />

          <div className="contact-map-live__label">
            <span>{t("Head office")}</span>

            <strong>{t("No. 44, Beddagana South Road, Pitakotte")}</strong>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>);
}
function ShieldIcon() {
    return (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>

      <path d="m9 12 2 2 4-4"/>
    </svg>);
}
