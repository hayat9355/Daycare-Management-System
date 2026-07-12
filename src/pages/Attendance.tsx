import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Clock, FileQuestion, Search, Save } from 'lucide-react';
import { CHILDREN, ATTENDANCE } from '../data/mockData';
import type { AttendanceStatus } from '../data/mockData';
import { Avatar } from '../components/UI';
import { useToast } from '../components/Toast';

type Local = Record<string,AttendanceStatus>;
const CFG: Record<AttendanceStatus,{label:string;bg:string;dot:string;icon:React.ReactNode}> = {
  present: {label:'Present', bg:'bg-emerald-500', dot:'bg-emerald-400', icon:<Check className="w-3.5 h-3.5"/>},
  absent:  {label:'Absent',  bg:'bg-red-500',     dot:'bg-red-400',     icon:<X className="w-3.5 h-3.5"/>},
  late:    {label:'Late',    bg:'bg-amber-500',   dot:'bg-amber-400',   icon:<Clock className="w-3.5 h-3.5"/>},
  excused: {label:'Excused', bg:'bg-blue-500',    dot:'bg-blue-400',    icon:<FileQuestion className="w-3.5 h-3.5"/>},
};
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WDAYS = ['S','M','T','W','T','F','S'];
const fmt = (d:Date) => d.toISOString().split('T')[0];

export default function Attendance() {
  const today = new Date(); const todayStr = fmt(today);
  const [selDate, setSelDate] = useState(todayStr);
  const [yr, setYr] = useState(today.getFullYear());
  const [mo, setMo] = useState(today.getMonth());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all'|AttendanceStatus>('all');
  const [local, setLocal] = useState<Local>({});
  const {show} = useToast();

  const getStatus = (cid:string):AttendanceStatus|undefined =>
    local[`${selDate}::${cid}`] ?? ATTENDANCE.find(a=>a.date===selDate&&a.childId===cid)?.status;

  const setStatus = (cid:string, s:AttendanceStatus) =>
    setLocal(p=>({...p,[`${selDate}::${cid}`]:s}));

  const kids = CHILDREN.filter(c=>c.status==='active')
    .filter(c=>`${c.firstName} ${c.lastName} ${c.classGroup}`.toLowerCase().includes(search.toLowerCase()));
  const shown = filter==='all' ? kids : kids.filter(c=>getStatus(c.id)===filter);

  const dim = new Date(yr,mo+1,0).getDate();
  const first = new Date(yr,mo,1).getDay();
  const cells: (number|null)[] = Array(first).fill(null);
  for(let i=1;i<=dim;i++) cells.push(i);

  const hasData = (d:number) => {
    const ds = `${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return ATTENDANCE.some(a=>a.date===ds);
  };

  const summary = {present:0,absent:0,late:0,excused:0};
  CHILDREN.filter(c=>c.status==='active').forEach(c=>{
    const s=getStatus(c.id); if(s) summary[s]++;
  });

  const prevMo = ()=>{ if(mo===0){setMo(11);setYr(y=>y-1);}else setMo(m=>m-1);};
  const nextMo = ()=>{ if(mo===11){setMo(0);setYr(y=>y+1);}else setMo(m=>m+1);};

  return (
    <div className="space-y-5 anim">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Attendance Tracking</h2>
          <p className="text-sm text-gray-400 mt-0.5">Digital check-in/out for all children</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>{const u:Local={};CHILDREN.filter(c=>c.status==='active').forEach(c=>{u[`${selDate}::${c.id}`]='present';});setLocal(p=>({...p,...u}));show('All marked present','success');}} className="btn btn-white btn-sm">Mark All Present</button>
          <button onClick={()=>show('Attendance saved','success')} className="btn btn-primary btn-sm"><Save className="w-4 h-4"/>Save</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Calendar */}
        <div className="card card-p">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-800 text-sm">{MONTHS[mo]} {yr}</span>
            <div className="flex gap-1">
              <button onClick={prevMo} className="btn-icon"><ChevronLeft className="w-4 h-4"/></button>
              <button onClick={nextMo} className="btn-icon"><ChevronRight className="w-4 h-4"/></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {WDAYS.map((d,i)=><div key={i} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day,i)=>{
              if(!day) return <div key={i}/>;
              const ds = `${yr}-${String(mo+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const isToday = ds===todayStr, isSel = ds===selDate;
              const isWe = [0,6].includes(new Date(ds).getDay());
              return (
                <button key={i} onClick={()=>setSelDate(ds)} disabled={isWe}
                  className={`aspect-square rounded-xl text-xs font-medium flex flex-col items-center justify-center transition-all ${isSel?'bg-blue-600 text-white':isToday?'bg-blue-50 text-blue-700 ring-1 ring-blue-200':isWe?'text-gray-200 cursor-default':'hover:bg-gray-100 text-gray-700'}`}>
                  {day}
                  {hasData(day)&&!isSel&&<div className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"/>}
                </button>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-3">{new Date(selDate).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</p>
            <div className="grid grid-cols-2 gap-2">
              {(['present','absent','late','excused'] as AttendanceStatus[]).map(s=>{
                const cfg=CFG[s];
                const colorMap = {present:'bg-emerald-50 text-emerald-700',absent:'bg-red-50 text-red-700',late:'bg-amber-50 text-amber-700',excused:'bg-blue-50 text-blue-700'};
                return (
                  <div key={s} className={`rounded-xl px-2.5 py-2 flex items-center justify-between ${colorMap[s]}`}>
                    <span className="text-xs font-medium capitalize">{cfg.label}</span>
                    <span className="text-sm font-bold">{summary[s]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Children list */}
        <div className="lg:col-span-2 card flex flex-col">
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex gap-3 items-center flex-wrap">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
              <input className="field pl-9 py-2 text-sm" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <select className="field-select w-32 py-2 text-sm" value={filter} onChange={e=>setFilter(e.target.value as typeof filter)}>
              <option value="all">All</option>
              {(['present','absent','late','excused'] as AttendanceStatus[]).map(s=><option key={s} value={s}>{CFG[s].label}</option>)}
            </select>
          </div>
          <div className="divide-y divide-gray-50 overflow-y-auto max-h-[500px]">
            {shown.map(child=>{
              const status = getStatus(child.id);
              return (
                <div key={child.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                  <Avatar src={child.photo} name={`${child.firstName} ${child.lastName}`} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{child.firstName} {child.lastName}</p>
                    <p className="text-xs text-gray-400">{child.classGroup}</p>
                  </div>
                  {status && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full text-white ${CFG[status].bg}`}>{CFG[status].label}</span>
                  )}
                  <div className="flex gap-1">
                    {(['present','absent','late','excused'] as AttendanceStatus[]).map(s=>(
                      <button key={s} title={CFG[s].label} onClick={()=>setStatus(child.id,s)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${status===s?`${CFG[s].bg} text-white`:'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                        {CFG[s].icon}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
