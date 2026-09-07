// import { CircleDollarSign, Landmark, ReceiptText, TrendingUp } from 'lucide-react'
// import { useEffect, useMemo, useState } from 'react'
// import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
// import { MetricCard } from '../components/MetricCard'
// import { PageHeader } from '../components/PageHeader'
// import { taxService } from '../services/tax.service'

// function money(value: unknown){
//   const n=Number(value||0)
//   if(Math.abs(n)>=1_000_000)return `Rs. ${(n/1_000_000).toFixed(n%1_000_000===0?0:1)}M`
//   if(Math.abs(n)>=1_000)return `Rs. ${(n/1_000).toFixed(1)}K`
//   return `Rs. ${n.toLocaleString()}`
// }

// export function TaxPage(){
//   const year=new Date().getFullYear()
//   const [summary,setSummary]=useState<any>({})
//   const [monthly,setMonthly]=useState<any[]>([])
//   const [wards,setWards]=useState<any[]>([])

//   useEffect(()=>{
//     Promise.all([taxService.summary(year),taxService.monthly(year),taxService.byWard(year)]).then(([s,m,w])=>{setSummary(s);setMonthly(m);setWards(w)}).catch(error=>console.error('Unable to load tax data',error))
//   },[year])

//   const taxData=useMemo(()=>monthly.map(item=>({month:String(item.month||'').slice(5)||String(item.month||''),collected:Number(item.collected||0)})),[monthly])
//   const wardData=useMemo(()=>wards.map(item=>{
//     const assessed=Number(item.assessed||0),outstanding=Number(item.outstanding||0)
//     return [String(item.wardName||'Unassigned'),assessed>0?Math.max(0,Math.min(100,Math.round((assessed-outstanding)/assessed*100))):0] as [string,number]
//   }),[wards])
//   const latest=monthly.at(-1)

//   return <div className="page"><PageHeader eyebrow="Financial overview" title="Municipal tax collection" description="Executive-level tax health by collection progress and geographic area."/><div className="metrics-grid metrics-grid--4"><MetricCard icon={Landmark} label="Annual target" value={money(summary.annualTarget)}/><MetricCard icon={CircleDollarSign} label="Collected" value={money(summary.collected)} note={`${Number(summary.collectionRate||0).toFixed(1)}% of annual target`} tone="mint"/><MetricCard icon={ReceiptText} label="Outstanding" value={money(summary.outstanding)} note="Across active assessments"/><MetricCard icon={TrendingUp} label="YoY collection" value="—" note="Year-over-year endpoint not configured" tone="dark"/></div><div className="tax-layout"><section className="panel panel--wide"><div className="panel-head"><div><span className="eyebrow">Collection curve</span><h2>Monthly collection</h2></div><strong className="money-summary">{money(latest?.collected)} <small>{String(latest?.month||'Latest')}</small></strong></div><div className="chart-wrap chart-wrap--xlarge"><ResponsiveContainer width="100%" height="100%"><BarChart data={taxData}><CartesianGrid vertical={false} stroke="#e8edf3"/><XAxis dataKey="month" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="collected" fill="#0f766e" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></section><section className="panel"><div className="panel-head"><div><span className="eyebrow">By ward</span><h2>Collection progress</h2></div></div><div className="ward-list">{wardData.map(([w,p])=><div key={w}><div><strong>{w}</strong><span>{p}%</span></div><div className="progress"><i style={{width:`${p}%`}}/></div></div>)}</div></section></div></div>
// }











import {
  CircleDollarSign,
  Landmark,
  ReceiptText,
  TrendingUp,
} from 'lucide-react'

import {
  useMemo,
} from 'react'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  MetricCard,
} from '../components/MetricCard'

import {
  PageHeader,
} from '../components/PageHeader'

/* =========================================================
   MONEY FORMATTER
========================================================= */

function money(
  value:
    unknown,
) {
  const n =
    Number(
      value ||
        0,
    )

  if (
    Math.abs(
      n,
    ) >=
    1_000_000
  ) {
    return `Rs. ${(
      n /
      1_000_000
    ).toFixed(
      n %
        1_000_000 ===
        0
        ? 0
        : 1,
    )}M`
  }

  if (
    Math.abs(
      n,
    ) >=
    1_000
  ) {
    return `Rs. ${(
      n /
      1_000
    ).toFixed(
      1,
    )}K`
  }

  return `Rs. ${n.toLocaleString()}`
}

/* =========================================================
   TEMPORARY DUMMY DATA

   Replace these values later with:

   taxService.summary(year)
   taxService.monthly(year)
   taxService.byWard(year)
========================================================= */

const dummySummary = {
  annualTarget:
    185_000_000,

  collected:
    137_450_000,

  outstanding:
    47_550_000,

  collectionRate:
    74.3,

  yoyGrowth:
    8.6,
}

const dummyMonthly = [
  {
    month:
      '2026-01',

    collected:
      10_200_000,
  },

  {
    month:
      '2026-02',

    collected:
      11_750_000,
  },

  {
    month:
      '2026-03',

    collected:
      13_400_000,
  },

  {
    month:
      '2026-04',

    collected:
      14_100_000,
  },

  {
    month:
      '2026-05',

    collected:
      15_600_000,
  },

  {
    month:
      '2026-06',

    collected:
      16_250_000,
  },

  {
    month:
      '2026-07',

    collected:
      17_300_000,
  },

  {
    month:
      '2026-08',

    collected:
      18_400_000,
  },

  {
    month:
      '2026-09',

    collected:
      20_450_000,
  },
]

const dummyWards = [
  {
    wardName:
      'Colombo Central',

    assessed:
      30_000_000,

    outstanding:
      5_400_000,
  },

  {
    wardName:
      'Cinnamon Gardens',

    assessed:
      27_500_000,

    outstanding:
      3_300_000,
  },

  {
    wardName:
      'Borella',

    assessed:
      24_000_000,

    outstanding:
      6_000_000,
  },

  {
    wardName:
      'Wellawatte',

    assessed:
      22_500_000,

    outstanding:
      4_050_000,
  },

  {
    wardName:
      'Bambalapitiya',

    assessed:
      21_000_000,

    outstanding:
      2_730_000,
  },

  {
    wardName:
      'Kotahena',

    assessed:
      19_500_000,

    outstanding:
      5_265_000,
  },

  {
    wardName:
      'Dematagoda',

    assessed:
      17_000_000,

    outstanding:
      5_950_000,
  },

  {
    wardName:
      'Mattakkuliya',

    assessed:
      14_500_000,

    outstanding:
      5_365_000,
  },
]

/* =========================================================
   MONTH LABELS
========================================================= */

const monthNames:
  Record<
    string,
    string
  > = {
    '01':
      'Jan',

    '02':
      'Feb',

    '03':
      'Mar',

    '04':
      'Apr',

    '05':
      'May',

    '06':
      'Jun',

    '07':
      'Jul',

    '08':
      'Aug',

    '09':
      'Sep',

    '10':
      'Oct',

    '11':
      'Nov',

    '12':
      'Dec',
  }

/* =========================================================
   COMPONENT
========================================================= */

export function TaxPage() {
  const year =
    new Date()
      .getFullYear()

  /*
    For now use local dummy data.

    Later replace these three lines with API state.
  */
  const summary =
    dummySummary

  const monthly =
    dummyMonthly

  const wards =
    dummyWards

  /* =======================================================
     CHART DATA
  ======================================================= */

  const taxData =
    useMemo(
      () =>
        monthly.map(
          (
            item,
          ) => {
            const monthCode =
              String(
                item.month,
              ).slice(
                5,
                7,
              )

            return {
              month:
                monthNames[
                  monthCode
                ] ||
                monthCode,

              collected:
                Number(
                  item.collected ||
                    0,
                ),
            }
          },
        ),
      [
        monthly,
      ],
    )

  /* =======================================================
     WARD COLLECTION %
  ======================================================= */

  const wardData =
    useMemo(
      () =>
        wards.map(
          (
            item,
          ) => {
            const assessed =
              Number(
                item.assessed ||
                  0,
              )

            const outstanding =
              Number(
                item.outstanding ||
                  0,
              )

            const progress =
              assessed >
              0
                ? Math.max(
                    0,
                    Math.min(
                      100,

                      Math.round(
                        (
                          (
                            assessed -
                            outstanding
                          ) /
                          assessed
                        ) *
                          100,
                      ),
                    ),
                  )
                : 0

            return [
              String(
                item.wardName ||
                  'Unassigned',
              ),

              progress,
            ] as [
              string,
              number,
            ]
          },
        ),
      [
        wards,
      ],
    )

  const latest =
    monthly[
      monthly.length -
        1
    ]

  return (
    <div
      className="page"
    >
      {/* ===================================================
          HEADER
      ==================================================== */}

      <PageHeader
        eyebrow="Financial overview"
        title="Municipal tax collection"
        description={`Executive-level tax health, collection progress and geographic performance for ${year}.`}
      />

      {/* ===================================================
          METRICS
      ==================================================== */}

      <div
        className="metrics-grid metrics-grid--4"
      >
        <MetricCard
          icon={
            Landmark
          }
          label="Annual target"
          value={money(
            summary.annualTarget,
          )}
          note={`Target for ${year}`}
        />

        <MetricCard
          icon={
            CircleDollarSign
          }
          label="Collected"
          value={money(
            summary.collected,
          )}
          note={`${Number(
            summary.collectionRate ||
              0,
          ).toFixed(
            1,
          )}% of annual target`}
          tone="mint"
        />

        <MetricCard
          icon={
            ReceiptText
          }
          label="Outstanding"
          value={money(
            summary.outstanding,
          )}
          note="Across active assessments"
        />

        <MetricCard
          icon={
            TrendingUp
          }
          label="YoY collection"
          value={`+${Number(
            summary.yoyGrowth ||
              0,
          ).toFixed(
            1,
          )}%`}
          note="Compared with previous year"
          tone="dark"
        />
      </div>

      {/* ===================================================
          MAIN TAX LAYOUT
      ==================================================== */}

      <div
        className="tax-layout"
      >
        {/* =================================================
            MONTHLY COLLECTION
        ================================================== */}

        <section
          className="panel panel--wide"
        >
          <div
            className="panel-head"
          >
            <div>
              <span
                className="eyebrow"
              >
                Collection curve
              </span>

              <h2>
                Monthly collection
              </h2>
            </div>

            <strong
              className="money-summary"
            >
              {money(
                latest?.collected,
              )}

              <small>
                {
                  monthNames[
                    String(
                      latest?.month ||
                        '',
                    ).slice(
                      5,
                      7,
                    )
                  ] ||
                  'Latest'
                }
              </small>
            </strong>
          </div>

          <div
            className="chart-wrap chart-wrap--xlarge"
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={
                  taxData
                }
              >
                <CartesianGrid
                  vertical={
                    false
                  }
                  stroke="#e8edf3"
                />

                <XAxis
                  dataKey="month"
                  axisLine={
                    false
                  }
                  tickLine={
                    false
                  }
                />

                <YAxis
                  axisLine={
                    false
                  }
                  tickLine={
                    false
                  }
                  tickFormatter={(
                    value,
                  ) =>
                    `${Math.round(
                      Number(
                        value,
                      ) /
                        1_000_000,
                    )}M`
                  }
                />

                <Tooltip
                  formatter={(
                    value,
                  ) => [
                    money(
                      value,
                    ),

                    'Collected',
                  ]}
                />

                <Bar
                  dataKey="collected"
                  fill="#0f766e"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* =================================================
            WARD COLLECTION
        ================================================== */}

        <section
          className="panel"
        >
          <div
            className="panel-head"
          >
            <div>
              <span
                className="eyebrow"
              >
                By ward
              </span>

              <h2>
                Collection progress
              </h2>
            </div>
          </div>

          <div
            className="ward-list"
          >
            {wardData.map(
              (
                [
                  ward,
                  progress,
                ],
              ) => (
                <div
                  key={
                    ward
                  }
                >
                  <div>
                    <strong>
                      {
                        ward
                      }
                    </strong>

                    <span>
                      {
                        progress
                      }
                      %
                    </span>
                  </div>

                  <div
                    className="progress"
                  >
                    <i
                      style={{
                        width:
                          `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  )
}