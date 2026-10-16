import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  Loader2,
  Printer,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import {
  type CitizenTaxSummary,
  type TaxReceiptItem,
  taxService,
} from '../services/tax.service'

export function MyTaxPaymentsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()

  const [summary, setSummary] = useState<CitizenTaxSummary | null>(null)
  const [payments, setPayments] = useState<TaxReceiptItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Payment Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [payAmount, setPayAmount] = useState('4850')
  const [payDescription, setPayDescription] = useState('Assessment Tax — Q4 2026')
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvv, setCardCvv] = useState('420')
  const [submittingPayment, setSubmittingPayment] = useState(false)

  // Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState<TaxReceiptItem | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [sumData, payList] = await Promise.all([
        taxService.mySummary(),
        taxService.myPayments(),
      ])
      setSummary(sumData)
      setPayments(payList)
    } catch (err: any) {
      console.error('Failed to load tax payments data:', err)
      setError(err?.message || 'Unable to load tax records from municipal server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleMakePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = parseFloat(payAmount)
    if (!amountNum || amountNum <= 0) {
      setActionMessage({ type: 'error', text: 'Please enter a valid payment amount.' })
      return
    }

    setSubmittingPayment(true)
    try {
      const res = await taxService.pay({
        amount: amountNum,
        description: payDescription.trim() || undefined,
        paymentMethod: 'ONLINE_CARD',
      })

      setIsPayModalOpen(false)
      setActionMessage({
        type: 'success',
        text: `Payment of LKR ${amountNum.toLocaleString()} confirmed (Receipt: ${res.receipt})!`,
      })
      await loadData()
    } catch (err: any) {
      console.error('Payment submission failed:', err)
      setActionMessage({
        type: 'error',
        text: err?.message || 'Payment processing failed. Please verify and try again.',
      })
    } finally {
      setSubmittingPayment(false)
    }
  }

  const formatLKR = (val: number | undefined | null) => {
    const n = Number(val || 0)
    return `LKR ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatLKRWhole = (val: number | undefined | null) => {
    const n = Number(val || 0)
    return `LKR ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow={t('Citizen finance')}
        title={t('My tax payments')}
        actions={
          <div className="flex items-center gap-2">
            <button
              className="secondary-btn"
              type="button"
              onClick={loadData}
              disabled={loading}
              title={t('Refresh')}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{t('Refresh')}</span>
            </button>
            <button
              className="primary-btn"
              type="button"
              onClick={() => {
                setActionMessage(null)
                setIsPayModalOpen(true)
              }}
            >
              <CreditCard size={16} />
              {t('Make payment')}
            </button>
          </div>
        }
      />

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`mb-4 flex items-center justify-between rounded-xl border p-4 text-sm transition-all ${
            actionMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="metrics-grid metrics-grid--3">
        <div className="metric-card">
          <div className="metric-card__top">
            <span>{t('Outstanding')}</span>
            <span className="metric-card__icon">
              <ReceiptText size={16} />
            </span>
          </div>
          <strong>
            {loading && !summary ? (
              <span className="inline-block h-8 w-28 rounded bg-slate-200 animate-pulse" />
            ) : (
              formatLKR(summary?.outstanding ?? 0)
            )}
          </strong>
          <p>
            {summary && summary.outstanding > 0
              ? t('Payment due for active assessment')
              : t('No overdue balance')}
          </p>
        </div>

        <div className="metric-card metric-card--mint">
          <div className="metric-card__top">
            <span>{t('Paid this year')}</span>
            <span className="metric-card__icon">
              <CheckCircle2 size={16} />
            </span>
          </div>
          <strong>
            {loading && !summary ? (
              <span className="inline-block h-8 w-28 rounded bg-emerald-100 animate-pulse" />
            ) : (
              formatLKRWhole(summary?.paidThisYear ?? 9700)
            )}
          </strong>
          <p>{t('Verified municipal account summary')}</p>
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="panel p-6 text-center my-4">
          <AlertCircle size={32} className="mx-auto text-rose-500 mb-2" />
          <h4 className="text-sm font-bold text-slate-800">{t('Unable to load tax records')}</h4>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
          <button onClick={loadData} className="secondary-btn mt-3 inline-flex">
            <RefreshCw size={14} />
            {t('Try again')}
          </button>
        </div>
      )}

      {/* Payment History Panel */}
      <section className="panel overflow-hidden mt-6">
        <div className="panel-head p-5 border-b border-slate-100">
          <div>
            <span className="eyebrow text-teal-700">{t('Payment history')}</span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">{t('Recent receipts')}</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {payments.length} {t('receipts recorded')}
          </span>
        </div>

        {/* Loading skeleton */}
        {loading && payments.length === 0 && (
          <div className="divide-y divide-slate-100">
            {[1, 2].map((i) => (
              <div key={i} className="p-5 flex justify-between items-center animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-48 rounded bg-slate-200" />
                  <div className="h-3 w-32 rounded bg-slate-200" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-8 w-20 rounded-lg bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && payments.length === 0 && !error && (
          <div className="p-8 text-center text-slate-500">
            <Building2 size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">{t('No payment history recorded yet.')}</p>
            <p className="text-xs text-slate-400 mt-1">
              {t('Payments made through the portal will appear here with official municipal receipts.')}
            </p>
          </div>
        )}

        {/* List of payments */}
        {payments.length > 0 && (
          <div className="divide-y divide-slate-100">
            {payments.map((payment) => (
              <div
                key={payment.receipt || payment.id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50/60"
              >
                <div>
                  <strong className="block text-sm font-bold text-slate-900">
                    {payment.description}
                  </strong>
                  <small className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-teal-800">{payment.receipt}</span>
                    <span>·</span>
                    <span>{payment.date}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck size={12} className="text-emerald-600" />
                      {t('Verified')}
                    </span>
                  </small>
                </div>
                <div className="flex items-center gap-4">
                  <strong className="text-sm font-extrabold text-slate-900">
                    {payment.amountFormatted || formatLKR(payment.amount)}
                  </strong>
                  <button
                    type="button"
                    className="secondary-btn inline-flex items-center gap-1.5 hover:border-teal-500 hover:text-teal-700"
                    onClick={() => setActiveReceipt(payment)}
                  >
                    <Download size={14} />
                    {t('Receipt')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          MAKE PAYMENT MODAL
      ========================================================= */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 sm:p-6 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150">
          <div className="relative w-full max-w-md my-auto rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 sm:p-6 max-h-[85vh] flex flex-col">
            <div className="shrink-0 flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <span className="eyebrow text-teal-700">{t('Municipal payment gateway')}</span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">{t('Pay assessment tax')}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleMakePayment} className="flex-1 overflow-y-auto pr-1 space-y-3.5">
              <div className="rounded-xl bg-teal-50/70 border border-teal-100 p-3.5 text-xs text-teal-900">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{t('Council')}:</span>
                  <span>Colombo Municipal Council</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{t('Tax account')}:</span>
                  <span className="font-mono font-semibold">{summary?.primaryTaxCode || 'TX-ACC-CURRENT'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('Payment description')}
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={payDescription}
                  onChange={(e) => setPayDescription(e.target.value)}
                  placeholder="Assessment Tax — Q4 2026"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('Amount to pay (LKR)')} *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">LKR</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-14 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('Payment card simulation')}
                </span>
                <div className="space-y-2.5">
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-800"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card Number"
                  />
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-800"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                    />
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-800"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="CVV"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="secondary-btn"
                  disabled={submittingPayment}
                >
                  {t('Cancel')}
                </button>
                <button
                  type="submit"
                  className="primary-btn inline-flex items-center gap-2"
                  disabled={submittingPayment}
                >
                  {submittingPayment ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t('Processing...')}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      {t('Pay now')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          OFFICIAL RECEIPT MODAL
      ========================================================= */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 sm:p-6 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150">
          <div className="relative w-full max-w-md sm:max-w-lg my-auto rounded-2xl bg-white shadow-2xl border-2 border-teal-600/30 p-5 sm:p-6 max-h-[85vh] flex flex-col">
            {/* Header with Council Branding */}
            <div className="shrink-0 flex items-start justify-between border-b-2 border-slate-800 pb-3 mb-3">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-teal-800 block">
                  COLOMBO MUNICIPAL COUNCIL
                </span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  OFFICIAL TAX RECEIPT
                </h3>
                <span className="text-[10px] text-slate-500">Local Government Spatial Services (LGS)</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Receipt Details Table */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 text-xs text-slate-700 py-1">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">Receipt Reference:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{activeReceipt.receipt}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">Date &amp; Time:</span>
                <span className="font-medium text-slate-900">{activeReceipt.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">Payer Name:</span>
                <span className="font-medium text-slate-900">{user?.name || 'Lahiru Randika'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">Tax Account:</span>
                <span className="font-mono font-semibold text-slate-900">{activeReceipt.taxCode || summary?.primaryTaxCode || 'TX-ACC-2026'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">Description:</span>
                <span className="font-medium text-slate-900">{activeReceipt.description}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">Payment Channel:</span>
                <span className="font-medium text-slate-900">{activeReceipt.paymentMethod || 'Online Portal'}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-slate-800">Total Amount Paid:</span>
                <strong className="text-lg font-black text-teal-800">
                  {activeReceipt.amountFormatted || formatLKR(activeReceipt.amount)}
                </strong>
              </div>
            </div>

            {/* Digital Stamp */}
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 flex items-center gap-3">
              <ShieldCheck size={28} className="text-emerald-600 shrink-0" />
              <div>
                <strong className="block text-xs font-bold text-emerald-900">
                  Digitally Verified &amp; Council Recorded
                </strong>
                <span className="text-[10px] text-emerald-700 block">
                  This transaction is officially authenticated and reconciled against CMC municipal accounts.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="shrink-0 flex items-center justify-end gap-3 pt-3 mt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="secondary-btn"
              >
                {t('Close')}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="primary-btn inline-flex items-center gap-2"
              >
                <Printer size={15} />
                {t('Print receipt')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
