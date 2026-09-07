import {
  CheckCircle2,
  Layers3,
  ShieldCheck,
  Users2,
} from 'lucide-react'

import {
  PublicFooter,
} from '../components/PublicFooter'

import {
  PublicHeader,
} from '../components/PublicHeader'

import {
  ScrollReveal,
} from '../components/ScrollReveal'

export function AboutPage() {
  return (
    <div className="public-site public-inner-page">
      <PublicHeader />

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="inner-hero inner-hero--about">
          <div className="section-shell">
            <ScrollReveal>
              <span className="editorial-kicker">
                About Spatio LGS
              </span>

              <h1>
                An idea born from a
                <br />
                real, recurring problem.
              </h1>

              <p>
                Spatio LGS is a geospatial decision-support
                platform for Municipal and Urban Councils,
                bringing land management, permits, revenue,
                civic services and citizen engagement into
                one connected digital system.
              </p>
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
                <img
                  src="/lgs-media/map-center.jpg"
                  alt="Mapped municipal landscape"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div>
                <span className="editorial-kicker editorial-kicker--dark">
                  Our approach
                </span>

                <h2>
                  One connected picture for every council.
                </h2>

                <p>
                  Local government information is often spread
                  across paper records, separate departments and
                  disconnected systems. Spatio LGS connects land
                  records, infrastructure, planning information
                  and public services through one spatially aware
                  platform, helping councils move toward
                  connected, data-driven and sustainable
                  governance.
                </p>

                <ul>
                  <li>
                    <Layers3 />
                    Data-driven decisions using reliable,
                    real-time and spatially aware information
                  </li>

                  <li>
                    <Users2 />
                    Interoperability across departments,
                    agencies and connected government systems
                  </li>

                  <li>
                    <CheckCircle2 />
                    Citizen-centric services focused on
                    accessibility, responsiveness and
                    transparency
                  </li>

                  <li>
                    <ShieldCheck />
                    Secure, privacy-aware and trusted handling
                    of municipal information
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}