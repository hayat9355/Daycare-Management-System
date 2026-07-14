import React from 'react';
import { Users, CalendarCheck, DollarSign, UserSquare2, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { CHILDREN, ATTENDANCE, INVOICES, STAFF, MONTHLY_ENROLLMENT, MONTHLY_REVENUE, ANNOUNCEMENTS } from '../data/mockData';
import { KpiCard, MiniBar } from '../components/UI';
import type { Page } from '../components/Shell';

const today = new Date().toISOString().split('T')[0];

export default function Dashboard({ onNav }: { onNav: (p: Page) => void }) {
  const active = CHILDREN.filter(c => c.status === 'active');
  const todayAtt = ATTENDANCE.filter(a => a.date === today);
  const present = todayAtt.filter(a => a.status === 'present' || a.status === 'late').length;
  const rate = active.length ? Math.round((present / active.length) * 100) : 0;

  const overdue = INVOICES.filter(i => i.status === 'overdue');
  const pending = INVOICES.filter(i => i.status === 'pending');
  const collected = INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const outstanding = [...overdue, ...pending].reduce((s, i) => s + i.total, 0);

  const classes = ['Toddlers A','Toddlers B','Preschool A','Preschool B','Pre-K Stars'].map(cls => ({
    name: cls,
    enrolled: active.filter(c => c.classGroup === cls).length,
    present: todayAtt.filter(a => {
      const ch = active.find(c => c.id === a.childId);
      return ch?.classGroup === cls && (a.status === 'present' || a.status === 'late');
    }).length,
  }));

  return (
    <div className="space-y-6 anim">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
        <p className="text-blue-100 text-sm font-medium mb-1">{new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        <h1 className="text-2xl font-bold mb-1">Good morning, Linda 👋</h1>
        <p className="text-blue-100 text-sm">Here's what's happening at the daycare today.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={<Users className="w-6 h-6 text-blue-600"/>}    label="Active Children"    value={active.length}                      sub={`${active.filter(c=>c.classGroup.startsWith('Toddlers')).length} toddlers · ${active.filter(c=>!c.classGroup.startsWith('Toddlers')).length} preschool`} iconBg="bg-blue-50"/>
        <KpiCard icon={<CalendarCheck className="w-6 h-6 text-emerald-600"/>} label="Present Today" value={`${present}/${active.length}`} sub={`${rate}% attendance rate`} iconBg="bg-emerald-50"/>
        <KpiCard icon={<DollarSign className="w-6 h-6 text-teal-600"/>} label="Revenue Collected"  value={`$${(collected/1000).toFixed(1)}k`} sub={`$${(outstanding/1000).toFixed(1)}k outstanding`} iconBg="bg-teal-50"/>
        <KpiCard icon={<UserSquare2 className="w-6 h-6 text-violet-600"/>} label="Active Staff"   value={STAFF.filter(s=>s.status==='active').length} sub={`${STAFF.filter(s=>s.status==='on_leave').length} on leave`} iconBg="bg-violet-50"/>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card card-p">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Enrollment Trend</h3>
              <p className="text-xs text-gray-400 mt-0.5">Children enrolled per month</p>
            </div>
            <TrendingUp className="w-4 h-4 text-gray-300"/>
          </div>
          <MiniBar data={MONTHLY_ENROLLMENT} labelKey="m" valueKey="n" color="bg-blue-500"/>
        </div>
        <div className="card card-p">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Revenue</h3>
              <p className="text-xs text-gray-400 mt-0.5">Tuition & fees collected ($)</p>
            </div>
            <DollarSign className="w-4 h-4 text-gray-300"/>
          </div>
          <MiniBar data={MONTHLY_REVENUE} labelKey="m" valueKey="v" color="bg-teal-500"/>
        </div>
      </div>

      {/* Attendance by class + Alerts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card card-p">
          <h3 className="font-semibold text-gray-900 mb-4">Today's Attendance by Class</h3>
          <div className="space-y-3.5">
            {classes.map(c => {
              const pct = c.enrolled ? Math.round((c.present/c.enrolled)*100) : 0;
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{c.name}</span>
                    <span className="text-gray-400 text-xs">{c.present}/{c.enrolled} <span className="font-semibold text-gray-600">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct>=85?'bg-emerald-400':pct>=70?'bg-amber-400':'bg-red-400'}`} style={{width:`${pct}%`}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card card-p">
          <h3 className="font-semibold text-gray-900 mb-4">Action Required</h3>
          <div className="space-y-2.5">
            {overdue.length > 0 && (
              <button onClick={()=>onNav('billing')} className="w-full flex items-start gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-left">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-red-700">{overdue.length} Overdue Invoices</p>
                  <p className="text-xs text-red-400">${overdue.reduce((s,i)=>s+i.total,0).toLocaleString()} total</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-red-300 flex-shrink-0 mt-0.5"/>
              </button>
            )}
            {ATTENDANCE.filter(a=>a.date===today&&a.status==='absent').length > 0 && (
              <button onClick={()=>onNav('attendance')} className="w-full flex items-start gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors text-left">
                <CalendarCheck className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amber-700">{ATTENDANCE.filter(a=>a.date===today&&a.status==='absent').length} Absences Today</p>
                  <p className="text-xs text-amber-400">View attendance log</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 mt-0.5"/>
              </button>
            )}
            {STAFF.filter(s=>s.status==='on_leave').length > 0 && (
              <button onClick={()=>onNav('staff')} className="w-full flex items-start gap-3 p-3 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors text-left">
                <UserSquare2 className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5"/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-violet-700">Staff on Leave</p>
                  <p className="text-xs text-violet-400">{STAFF.filter(s=>s.status==='on_leave').map(s=>s.name.split(' ').slice(-1)[0]).join(', ')}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-violet-300 flex-shrink-0 mt-0.5"/>
              </button>
            )}
            {ANNOUNCEMENTS.filter(a=>a.pinned).slice(0,1).map(ann=>(
              <button key={ann.id} onClick={()=>onNav('communication')} className="w-full flex items-start gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-blue-700 line-clamp-1">{ann.title}</p>
                  <p className="text-xs text-blue-400">Pinned notice</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-300 flex-shrink-0 mt-0.5"/>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {([
            {label:'Take Attendance',  page:'attendance',    bg:'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',   icon:<CalendarCheck className="w-5 h-5 text-emerald-600"/>},
            {label:'Add Daily Report', page:'reports',       bg:'bg-violet-50 hover:bg-violet-100 border-violet-200',      icon:<FileText className="w-5 h-5 text-violet-600"/>},
            {label:'Create Invoice',   page:'billing',       bg:'bg-teal-50 hover:bg-teal-100 border-teal-200',            icon:<DollarSign className="w-5 h-5 text-teal-600"/>},
            {label:'Add Child',        page:'children',      bg:'bg-pink-50 hover:bg-pink-100 border-pink-200',            icon:<Users className="w-5 h-5 text-pink-600"/>},
            {label:'Announcement',     page:'communication', bg:'bg-amber-50 hover:bg-amber-100 border-amber-200',         icon:<Megaphone className="w-5 h-5 text-amber-600"/>},
          ] as {label:string;page:Page;bg:string;icon:React.ReactNode}[]).map(({label,page,bg,icon})=>(
            <button key={label} onClick={()=>onNav(page)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-center ${bg}`}>
              {icon}
              <span className="text-xs font-semibold text-gray-700 leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// needed for quick action
const FileText = ({className}:{className:string}) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
);
const Megaphone = ({className}:{className:string}) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
);
