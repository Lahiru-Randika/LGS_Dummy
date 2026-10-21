import { useLanguage } from '../context/LanguageContext';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ContactLocationMap } from '../components/ContactLocationMap';
import { PublicFooter } from '../components/PublicFooter';
import { PublicHeader } from '../components/PublicHeader';
import { ScrollReveal } from '../components/ScrollReveal';

const sectionShell =
  'mx-auto w-[min(1500px,calc(100%-80px))] max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-28px)] max-[400px]:w-[calc(100%-20px)] 3xl:w-[min(1820px,calc(100%-120px))] 4k:w-[min(2360px,calc(100%-160px))]';

export function ContactPage() {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceNeed, setServiceNeed] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('');
    setSending(true);

    const apiBase = (
      (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
      'http://localhost:4000'
    ).trim().replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch(
        `${apiBase}/api/v1/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            serviceNeed,
            message,
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to send message");
      }

      setPopup({
        isOpen: true,
        type: 'success',
        title: t('Message sent successfully'),
        message: t(
          'Thank you for reaching out. We have received your inquiry and our team will get back to you shortly.'
        ),
      });
      setStatus(t('Message sent successfully'));
      setFullName('');
      setEmail('');
      setServiceNeed('');
      setMessage('');
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error && error.message !== 'Failed to send message'
          ? error.message
          : t('Failed to send your message. Please try again.');

      setPopup({
        isOpen: true,
        type: 'error',
        title: t('Unable to send the request.'),
        message: errorMessage,
      });
      setStatus(t('Unable to send the request.'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['DM_Sans'] text-slate-950">
      <PublicHeader overlay />

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}
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
                {t('Contact')}
              </span>

              <h1 className="lgs-home-hero-title mt-6 font-['Manrope'] text-[clamp(40px,5.8vw,88px)] font-semibold leading-[.95] tracking-[-.055em] text-white normal-case 3xl:text-[104px] 4k:text-[124px]">
                {t('Let’s put your council')}
                <br />
                <span className="not-italic text-teal-300">
                  {t('on the map.')}
                </span>
              </h1>

              <p className="lgs-home-hero-description mt-6 max-w-2xl text-[14px] font-normal leading-relaxed text-slate-200 sm:text-[16px] sm:leading-7 3xl:max-w-3xl 3xl:text-[18px]">
                {t(
                  'Talk to the Spatio LGS team about your council’s needs, existing challenges and how a connected geospatial platform can support better local government operations.'
                )}
              </p>
            </ScrollReveal>
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[.18em] text-white/50 3xl:bottom-10">
            <span>{t('Scroll')}</span>
          </div>
        </section>

        {/* =====================================================
            CONTACT
        ====================================================== */}
        <section className="section-pad contact-editorial">
          <div className="section-shell contact-editorial__grid">
            <ScrollReveal direction="left">
              <div className="contact-editorial__info">
                <span className="editorial-kicker editorial-kicker--dark">
                  {t('Prefer to reach us directly?')}
                </span>

                <h2>{t('Talk to an expert.')}</h2>

                <p>
                  {t(
                    'Tell us about your council, the services you want to improve and the problems you are hoping to solve. Our team can walk you through how Spatio LGS can work in your own council area.'
                  )}
                </p>

                <div className="contact-detail">
                  <MapPin />
                  <span>
                    <small>{t('Office')}</small>
                    <strong>
                      {t('No. 44, Beddagana South Road, Pitakotte')}
                    </strong>
                  </span>
                </div>

                <div className="contact-detail">
                  <Phone />
                  <span>
                    <small>{t('Phone')}</small>
                    <strong>+94 77 330 1274</strong>
                  </span>
                </div>

                <div className="contact-detail">
                  <Mail />
                  <span>
                    <small>{t('Email')}</small>
                    <strong>info@spatiosds.com</strong>
                  </span>
                </div>

                <div className="contact-detail">
                  <Clock3 />
                  <span>
                    <small>{t('Purpose')}</small>
                    <strong>
                      {t(
                        'Platform demos, council implementation and solution discussions'
                      )}
                    </strong>
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <form className="contact-editorial__form" onSubmit={handleSubmit}>
                <label>
                  <span>{t('Full name')}</span>
                  <input
                    placeholder={t('Your full name')}
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                  />
                </label>

                <div>
                  <label>
                    <span>{t('Email address')}</span>
                    <input
                      type="email"
                      placeholder={t('you@example.com')}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </label>

                  <label>
                    <span>{t('Primary service need')}</span>
                    <input
                      placeholder={t('Land, tax, permits, complaints...')}
                      value={serviceNeed}
                      onChange={(event) => setServiceNeed(event.target.value)}
                      required
                    />
                  </label>
                </div>

                <label>
                  <span>{t('What are you hoping to solve?')}</span>
                  <textarea
                    rows={7}
                    placeholder={t(
                      'Tell us about your council, current challenges and what you would like to improve…'
                    )}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                  />
                </label>

                {status && <small>{status}</small>}

                <button type="submit" disabled={sending}>
                  <Send size={16} />
                  {sending ? t('Sending message...') : t('Request a demo')}
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
            ].map(([Icon, title, sub, body], index) => {
              const C = Icon as typeof Building2;
              return (
                <ScrollReveal key={String(title)} delay={index * 100}>
                  <article>
                    <span>
                      <C />
                    </span>
                    <h3>{t(String(title))}</h3>
                    <strong>{t(String(sub))}</strong>
                    <p>{t(String(body))}</p>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            MAP
        ====================================================== */}
        <section className="contact-map-live">
          <ContactLocationMap />
          <div className="contact-map-live__label">
            <span>{t('Head office')}</span>
            <strong>{t('No. 44, Beddagana South Road, Pitakotte')}</strong>
          </div>
        </section>
      </main>

      <PublicFooter />

      {/* =====================================================
          CONFIRMATION POPUP MODAL
      ====================================================== */}
      {popup.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200/80 p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              {popup.type === 'success' ? (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-inner">
                  <CheckCircle2 size={34} strokeWidth={2.2} />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/80 shadow-inner">
                  <AlertCircle size={34} strokeWidth={2.2} />
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="font-['Manrope'] text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {popup.title}
            </h3>

            {/* Message */}
            <p className="mt-2.5 text-sm text-slate-600 leading-relaxed sm:text-[15px]">
              {popup.message}
            </p>

            {/* Action Button */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
                className={`inline-flex items-center justify-center rounded-xl px-7 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 active:scale-[0.98] ${
                  popup.type === 'success'
                    ? 'bg-[#061522] hover:bg-[#0c2338] shadow-[#061522]/20'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                }`}
              >
                {t('OK')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
