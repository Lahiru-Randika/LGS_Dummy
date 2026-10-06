import { CheckCircle2, CreditCard, Download, ReceiptText } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

const payments = [
  { receipt: 'TX-2026-1042', description: 'Assessment Tax — Q3 2026', date: '15 Sep 2026', amount: 'LKR 4,850.00' },
  { receipt: 'TX-2026-0817', description: 'Assessment Tax — Q2 2026', date: '12 Jun 2026', amount: 'LKR 4,850.00' },
]

export function MyTaxPaymentsPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="Citizen finance" title="My tax payments" description="Review municipal tax payments, receipts and outstanding balances." actions={<button className="primary-btn" type="button"><CreditCard size={16}/>Make payment</button>} />
      <div className="metrics-grid metrics-grid--3">
        <div className="metric-card"><div className="metric-card__top"><span>Outstanding</span><span className="metric-card__icon"><ReceiptText size={16}/></span></div><strong>LKR 0.00</strong><p>No overdue balance</p></div>
        <div className="metric-card metric-card--mint"><div className="metric-card__top"><span>Paid this year</span><span className="metric-card__icon"><CheckCircle2 size={16}/></span></div><strong>LKR 9,700</strong><p>Demo account summary</p></div>
      </div>
      <section className="panel overflow-hidden">
        <div className="panel-head p-5"><div><span className="eyebrow">Payment history</span><h2>Recent receipts</h2></div></div>
        <div className="divide-y divide-slate-100">
          {payments.map((payment) => <div key={payment.receipt} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"><div><strong className="block text-sm text-slate-800">{payment.description}</strong><small className="mt-1 block text-[10px] text-slate-400">{payment.receipt} · {payment.date}</small></div><div className="flex items-center gap-4"><strong className="text-sm text-slate-800">{payment.amount}</strong><button type="button" className="secondary-btn"><Download size={14}/>Receipt</button></div></div>)}
        </div>
      </section>
      <p className="mt-4 text-[11px] text-slate-400">Demo page — tax/payment gateway integration will be connected later.</p>
    </div>
  )
}
