import { ArrowRight, FileText, Plus, Stamp } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../context/LanguageContext';
const applications = [
    { id: 'APP-2026-0041', title: 'Trade licence renewal', submitted: '28 Sep 2026', status: 'Under review' },
    { id: 'APP-2026-0027', title: 'Street line certificate', submitted: '11 Aug 2026', status: 'Approved' },
];
export function ApplicationsPage() {
    const {  t  } = useLanguage();
    return (<div className="page">
      <PageHeader eyebrow={t('Citizen services')} title={t('Applications')} description={t('Submit and follow applications made to the municipality.')} actions={<button className="primary-btn" type="button">
            <Plus size={16}/>
            {t('New application')}
          </button>}/>
      <div className="grid gap-4 lg:grid-cols-[1fr_.36fr]">
        <section className="panel overflow-hidden">
          <div className="panel-head p-5">
            <div>
              <span className="eyebrow">{t('Your applications')}</span>
              <h2>{t('Recent submissions')}</h2>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {applications.map((application) => (<button key={application.id} type="button" className="flex w-full items-center justify-between gap-4 border-0 bg-transparent px-5 py-4 text-left transition hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500">
                    <FileText size={17}/>
                  </span>
                  <div>
                    <strong className="block text-sm text-slate-800">{t(application.title)}</strong>
                    <small className="mt-1 block text-[10px] text-slate-400">
                      {application.id}{t("\u00B7 Submitted")}{application.submitted}
                    </small>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                    {t(application.status)}
                  </span>
                  <ArrowRight size={15} className="text-slate-400"/>
                </div>
              </button>))}
          </div>
        </section>
        <aside className="panel p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <Stamp size={19}/>
          </span>
          <span className="eyebrow mt-5 block">{t('Online applications')}</span>
          <h2 className="mt-2 text-lg font-extrabold text-slate-900">{t('Municipal services')}</h2>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            {t('Future online application forms and status tracking can be connected here without changing the citizen navigation.')}
          </p>
        </aside>
      </div>
      <p className="mt-4 text-[11px] text-slate-400">{t("Demo page \u2014 application workflow/API integration will be connected later.")}</p>
    </div>);
}
