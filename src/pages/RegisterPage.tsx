import { useLanguage } from '../context/LanguageContext'
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck, UserRound, } from 'lucide-react';
import { FormEvent, useEffect, useState, } from 'react';
import { Link, useNavigate, } from 'react-router-dom';
import { Brand } from '../components/Brand';
import { authService } from '../services/auth.service';
import { ApiError } from '../services/http';
export function RegisterPage() {
  const { t, language } = useLanguage();
  const isSi = language === 'si';
  const [firstName, setFirstName,] = useState('');
  const [lastName, setLastName,] = useState('');
  const [email, setEmail,] = useState('');
  const [password, setPassword,] = useState('');
  const [showPassword, setShowPassword,] = useState(false);
  const [error, setError,] = useState('');
  const [submitting, setSubmitting,] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });
      navigate('/login');
    }
    catch (cause) {
      setError(cause instanceof ApiError
        ? cause.message
        : 'Unable to create the account. Please try again.');
    }
    finally {
      setSubmitting(false);
    }
  }
  return (<>
    <style>{`
        html, body {
          overflow: hidden !important;
          height: 100% !important;
        }

        .register-page-new {
          isolation: isolate;
          height: 100vh;
          height: 100dvh;
          max-height: 100dvh;
          overflow: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .register-page-new::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        @media (max-height: 520px) {
          html, body {
            overflow: auto !important;
          }
          .register-page-new {
            overflow-y: auto !important;
            height: auto !important;
            min-height: 100dvh !important;
          }
        }

        .register-input-new {
          width: 100% !important;
          height: 100% !important;

          margin: 0 !important;
          padding: 0 !important;

          border: 0 !important;
          outline: none !important;

          background: transparent !important;

          color: #0f172a !important;

          font-family: inherit !important;
          font-size: 12px !important;
          font-weight: 600 !important;

          box-shadow: none !important;

          caret-color: #0f766e !important;

          appearance: none !important;
          -webkit-appearance: none !important;
        }

        .register-input-new::placeholder {
          color: rgba(71, 85, 105, .55) !important;
          font-weight: 500 !important;
        }

        .register-input-new:focus {
          border: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }

        .register-input-new:-webkit-autofill,
        .register-input-new:-webkit-autofill:hover,
        .register-input-new:-webkit-autofill:focus,
        .register-input-new:-webkit-autofill:active {
          -webkit-text-fill-color: #0f172a !important;

          -webkit-box-shadow:
            0 0 0 1000px #ffffff inset !important;

          box-shadow:
            0 0 0 1000px #ffffff inset !important;

          caret-color: #0f766e !important;
        }

        .register-field-new {
          transition:
            border-color .25s ease,
            box-shadow .25s ease,
            transform .25s ease;
        }

        .register-field-new:focus-within {
          border-color: rgba(45, 212, 191, .9);

          box-shadow:
            0 0 0 3px rgba(45, 212, 191, .12),
            0 12px 35px rgba(0, 0, 0, .12);
        }

        @keyframes registerFadeLeft {
          from {
            opacity: 0;
            transform: translateX(-28px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes registerFadeRight {
          from {
            opacity: 0;
            transform: translateX(28px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes registerFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        .register-left-enter {
          animation:
            registerFadeLeft .7s
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .register-right-enter {
          animation:
            registerFadeRight .7s
            .08s
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .register-float-icon {
          animation:
            registerFloat 3.5s
            ease-in-out
            infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .register-left-enter,
          .register-right-enter,
          .register-float-icon {
            animation: none !important;
          }
        }
      `}</style>

    <main className="
          register-page-new
          relative
          h-screen
          h-[100dvh]
          w-full
          overflow-hidden
          bg-slate-950
        ">
      {/* =====================================================
            FULL SCREEN BACKGROUND
        ====================================================== */}

      <div className="
            absolute
            inset-0
            scale-[1.02]
            bg-cover
            bg-center
            bg-no-repeat
          " style={{
          backgroundImage: "url('/lgs-media/BackgroundSole.png')",
        }} />

      {/* Main dark overlay */}

      <div className="
            absolute
            inset-0
            bg-slate-950/45
          "/>

      {/* Left/right cinematic gradient */}

      <div className="
            absolute
            inset-0
            bg-[linear-gradient(90deg,rgba(3,15,20,.72)_0%,rgba(3,15,20,.32)_45%,rgba(3,15,20,.58)_100%)]
          "/>

      {/* Bottom vignette */}

      <div className="
            absolute
            inset-0
            bg-[linear-gradient(0deg,rgba(2,12,17,.70)_0%,transparent_45%)]
          "/>

      {/* Teal ambient glow */}

      <div className="
            pointer-events-none
            absolute
            -left-[15%]
            top-[10%]
            h-[650px]
            w-[650px]
            rounded-full
            bg-teal-500/[0.10]
            blur-[140px]
          "/>

      {/* =====================================================
            BRAND
        ====================================================== */}

      <header className="
            absolute
            left-0
            right-0
            top-0
            z-30
            flex
            h-[72px]
            items-center
            px-[5vw]
            max-sm:h-[60px]
            max-sm:px-5
          ">
        <div className="origin-left scale-[0.90]">
          <Brand light />
        </div>
      </header>

      {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

      <div className="
            relative
            z-20
            grid
            h-full
            max-h-[100dvh]
            grid-cols-[1.05fr_.95fr]
            items-center
            px-[6.5vw]
            pt-[54px]
            pb-3
            max-xl:px-[5vw]
            max-lg:grid-cols-1
            max-lg:px-5
            max-lg:pt-[50px]
            max-lg:pb-3
            max-sm:px-4
            max-sm:pt-[46px]
            max-sm:pb-3
            3xl:px-[8vw]
            4k:px-[10vw]
          ">
        {/* ===================================================
            LEFT
        ==================================================== */}

        <section className="
              register-left-enter
              flex
              min-h-0
              items-center
              pr-[7vw]
              max-lg:hidden
            ">
          <div className="max-w-[560px]">
            <span className="
                  inline-flex
                  items-center
                  gap-3
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[.22em]
                  text-teal-300
                ">
              <i className="h-6 w-[2px] rounded-full bg-teal-300" />{t("Join Spatio LGS")}</span>

            <h1 className={`
                  mt-3
                  font-['Manrope']
                  font-extrabold
                  text-white
                  ${isSi
                    ? 'text-[clamp(28px,3.2vw,48px)] leading-[1.05] tracking-tight'
                    : 'text-[clamp(36px,4vw,64px)] leading-[.95] tracking-[-.06em]'
                  }
                `}>{t("Your city.")}<br />{t("Connected.")}</h1>

            <p className="
                  mt-3.5
                  max-w-[440px]
                  text-[12px]
                  font-medium
                  leading-6
                  text-white/70
                ">{t("Create your citizen account to report issues and track service requests.")}</p>

            {/* Back home */}

            <div className="mt-5">
              <Link to="/" className="
                    group
                    inline-flex
                    items-center
                    gap-2.5
                    rounded-xl
                    border
                    border-white/15
                    bg-white/[.08]
                    px-3.5
                    py-2
                    text-white
                    backdrop-blur-md
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-white/25
                    hover:bg-white/[.12]
                  ">
                <span className="
                      grid
                      h-7
                      w-7
                      place-items-center
                      rounded-lg
                      bg-white/10
                      text-teal-200
                      transition-transform
                      duration-200
                      group-hover:-translate-x-0.5
                    ">
                  <ArrowLeft size={14} />
                </span>

                <span>
                  <strong className="block text-[10px] font-bold text-white/90">{t("Back to Home")}</strong>
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================
            RIGHT REGISTER
        ==================================================== */}

        <section className="
              register-right-enter
              flex
              min-h-0
              items-center
              justify-center
              max-lg:h-full
            ">
          <div className="
                w-full
                max-w-[470px]
                rounded-[20px]
                border
                border-white/15
                bg-slate-950/20
                px-5
                py-3.5
                sm:px-6
                sm:py-4
                shadow-[0_30px_90px_rgba(0,0,0,.22)]
                backdrop-blur-[8px]
                max-lg:max-w-[440px]
                max-sm:rounded-[18px]
                max-sm:p-3.5
              ">
            {/* Heading */}

            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="
                      text-[8px]
                      font-extrabold
                      uppercase
                      tracking-[.18em]
                      text-teal-300
                    ">{t("Citizen registration")}</span>

                <h2 className={`
                      m-0
                      mt-1.5
                      mb-0
                      font-['Manrope']
                      text-white
                      ${isSi
                        ? 'text-[21px] sm:text-[23px] font-bold leading-tight pb-2 tracking-[-.01em]'
                        : 'text-[27px] sm:text-[29px] font-extrabold leading-none pb-1 tracking-[-.04em]'
                      }
                    `}>{t("Create account")}</h2>
              </div>

              <span className="
                    register-float-icon
                    grid
                    h-10
                    w-10
                    sm:h-11
                    sm:w-11
                    place-items-center
                    rounded-[14px]
                    border
                    border-white/15
                    bg-white/10
                    text-teal-200
                    backdrop-blur-md
                  ">
                <UserRound size={18} strokeWidth={1.8} />
              </span>
            </div>

            <p className="m-0 mt-2 mb-0 text-[9.5px] leading-normal text-white/55">{t("Enter your account details below.")}</p>

            {/* =================================================
            FORM
        ================================================== */}

            <form onSubmit={submit} className="mt-3">
              {/* FIRST + LAST NAME */}

              <div className="grid grid-cols-2 gap-2.5">
                {/* First name */}

                <label className="block">
                  <span className="
                        mb-0.5
                        block
                        text-[8px]
                        font-extrabold
                        uppercase
                        tracking-[.12em]
                        text-white/65
                      ">{t("First name")}</span>

                  <div className="
                        register-field-new
                        flex
                        h-[36px]
                        items-center
                        gap-2
                        rounded-[8px]
                        border
                        border-white/70
                        bg-white
                        px-3
                        shadow-[0_8px_24px_rgba(0,0,0,.08)]
                      ">
                    <UserRound size={14} strokeWidth={1.7} className="shrink-0 text-slate-400" />

                    <input className="register-input-new text-[12px]" type="text" autoComplete="given-name" placeholder={t("First name")} value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
                  </div>
                </label>

                {/* Last name */}

                <label className="block">
                  <span className="
                        mb-0.5
                        block
                        text-[8px]
                        font-extrabold
                        uppercase
                        tracking-[.12em]
                        text-white/65
                      ">{t("Last name")}</span>

                  <div className="
                        register-field-new
                        flex
                        h-[36px]
                        items-center
                        gap-2
                        rounded-[8px]
                        border
                        border-white/70
                        bg-white
                        px-3
                        shadow-[0_8px_24px_rgba(0,0,0,.08)]
                      ">
                    <UserRound size={14} strokeWidth={1.7} className="shrink-0 text-slate-400" />

                    <input className="register-input-new text-[12px]" type="text" autoComplete="family-name" placeholder={t("Last name")} value={lastName} onChange={(event) => setLastName(event.target.value)} required />
                  </div>
                </label>
              </div>

              {/* EMAIL */}

              <label className="mt-2 block">
                <span className="
                      mb-0.5
                      block
                      text-[8px]
                      font-extrabold
                      uppercase
                      tracking-[.12em]
                      text-white/65
                    ">{t("Email address")}</span>

                <div className="
                      register-field-new
                      flex
                      h-[36px]
                      items-center
                      gap-2
                      rounded-[8px]
                      border
                      border-white/70
                      bg-white
                      px-3
                      shadow-[0_8px_24px_rgba(0,0,0,.08)]
                    ">
                  <Mail size={14} strokeWidth={1.7} className="shrink-0 text-slate-400" />

                  <input className="register-input-new text-[12px]" type="email" autoComplete="email" placeholder={t("you@example.com")} value={email} onChange={(event) => setEmail(event.target.value)} required />
                </div>
              </label>

              {/* PASSWORD */}

              <label className="mt-2 block">
                <span className="
                      mb-0.5
                      block
                      text-[8px]
                      font-extrabold
                      uppercase
                      tracking-[.12em]
                      text-white/65
                    ">{t("Password")}</span>

                <div className="
                      register-field-new
                      flex
                      h-[36px]
                      items-center
                      gap-2
                      rounded-[8px]
                      border
                      border-white/70
                      bg-white
                      px-3
                      shadow-[0_8px_24px_rgba(0,0,0,.08)]
                    ">
                  <KeyRound size={14} strokeWidth={1.7} className="shrink-0 text-slate-400" />

                  <input className="register-input-new text-[12px]" type={showPassword
                    ? 'text'
                    : 'password'} autoComplete="new-password" placeholder={t("Minimum 12 characters")} value={password} onChange={(event) => setPassword(event.target.value)} minLength={12} required />

                  <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword
                    ? 'Hide password'
                    : 'Show password'} className="
                        grid
                        h-6
                        w-6
                        shrink-0
                        cursor-pointer
                        place-items-center
                        rounded-md
                        border-0
                        bg-transparent
                        text-slate-400
                        shadow-none
                        outline-none
                        transition
                        hover:bg-slate-100
                        hover:text-slate-700
                      ">
                    {showPassword ? (<EyeOff size={13} />) : (<Eye size={13} />)}
                  </button>
                </div>

                {/* <small className="mt-0.5 block text-[7.5px] text-white/40">{t("Use at least 12 characters.")}</small> */}
              </label>

              {/* ERROR */}

              {error && (<div className="
                      mt-2
                      flex
                      items-start
                      gap-2
                      rounded-[8px]
                      border
                      border-red-300/30
                      bg-red-950/35
                      px-2.5
                      py-1.5
                      text-[8.5px]
                      leading-4
                      text-red-100
                      backdrop-blur-md
                    ">
                <ShieldCheck size={12} className="mt-px shrink-0" />

                <span>
                  {error}
                </span>
              </div>)}

              {/* SUBMIT */}

              <button type="submit" disabled={submitting} className="
                    group
                    mt-2.5
                    flex
                    h-[38px]
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-[8px]
                    border
                    border-teal-200/20
                    bg-teal-400
                    px-4
                    text-[9.5px]
                    font-extrabold
                    uppercase
                    tracking-[.12em]
                    !text-slate-950
                    shadow-[0_10px_28px_rgba(20,184,166,.18)]
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-teal-300
                    hover:shadow-[0_14px_32px_rgba(20,184,166,.24)]
                    active:translate-y-0
                    active:scale-[.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  ">
                {submitting
                  ? 'Creating account…'
                  : 'Create citizen account'}

                {!submitting && (<ArrowRight size={14} className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "/>)}
              </button>
            </form>

            {/* =================================================
            LOGIN LINK
        ================================================== */}

            <div className="
                  mt-2
                  border-t
                  border-white/15
                  pt-2
                  text-center
                ">
              <span className="text-[9px] text-white/55">{t("Already registered?")}{' '}

                <Link to="/login" className="
                      font-extrabold
                      !text-teal-300
                      transition
                      hover:!text-teal-200
                    ">{t("Sign in")}</Link>
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  </>);
}
