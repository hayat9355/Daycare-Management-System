import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CALENDAR_EVENTS } from '../data/mockData';
import type { CalendarEvent, EventType } from '../data/mockData';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const EC: Record<EventType,{label:string;bg:string;dot:string;text:string;pill:string}> = {
  holiday:  {label:'Holiday',  bg:'bg-red-50',     dot:'bg-red-500',     text:'text-red-700',    pill:'bg-red-100 text-red-700'},
  meeting:  {label:'Meeting',  bg:'bg-blue-50',    dot:'bg-blue-500',    text:'text-blue-700',   pill:'bg-blue-100 text-blue-700'},
  activity: {label:'Activity', bg:'bg-emerald-50', dot:'bg-emerald-500', text:'text-emerald-700',pill:'bg-emerald-100 text-emerald-700'},
  trip:     {label:'Trip',     bg:'bg-amber-50',   dot:'bg-amber-500',   text:'text-amber-700',  pill:'bg-amber-100 text-amber-700'},
  deadline: {label:'Deadline', bg:'bg-violet-50',  dot:'bg-violet-500',  text:'text-violet-700', pill:'bg-violet-100 text-violet-700'},
};

export default function Calendar() {
  const today = new Date(); const todayStr = today.toISOString().split('T')[0];
  const [yr, setYr] = useState(today.getFullYear());
  const [mo, setMo] = useState(today.getMonth());
  const [selDate, setSelDate] = useState<string|null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const {show} = useToast();

  const dim = new Date(yr,mo+1,0).getDate();
  const first = new Date(yr,mo,1).getDay();
  const cells: (number|null)[] = Array(first).fill(null);
  for(let i=1;i<=dim;i++) cells.push(i);

  const eventsForDay = (d:number) => {
    const ds=`${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return CALENDAR_EVENTS.filter(e=>e.date===ds);
  };

  const selEvents = selDate ? CALENDAR_EVENTS.filter(e=>e.date===selDate) : [];
  const monthEvents = CALENDAR_EVENTS.filter(e=>{const d=new Date(e.date);return d.getFullYear()===yr&&d.getMonth()===mo;}).sort((a,b)=>a.date.localeCompare(b.date));

  const prev = ()=>{ if(mo===0){setMo(11);setYr(y=>y-1);}else setMo(m=>m-1);};
  const next = ()=>{ if(mo===11){setMo(0);setYr(y=>y+1);}else setMo(m=>m+1);};

  return (
    <div className="space-y-5 anim">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-lg font-bold text-gray-900">Calendar</h2><p className="text-sm text-gray-400 mt-0.5">Events, holidays & meetings</p></div>
        <button onClick={()=>setShowAdd(true)} className="btn btn-primary btn-sm"><Plus className="w-4 h-4"/>Add Event</button>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.entries(EC).map(([,v])=>(
          <div key={v.label} className="flex items-center gap-1.5 text-xs text-gray-500"><div className={`w-2.5 h-2.5 rounded-full ${v.dot}`}/>{v.label}</div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card card-p">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 text-base">{MONTHS[mo]} {yr}</h3>
            <div className="flex items-center gap-1">
              <button onClick={()=>{setMo(today.getMonth());setYr(today.getFullYear());}} className="btn btn-white btn-xs">Today</button>
              <button onClick={prev} className="btn-icon"><ChevronLeft className="w-4 h-4"/></button>
              <button onClick={next} className="btn-icon"><ChevronRight className="w-4 h-4"/></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px mb-1">{WD.map(d=><div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day,i)=>{
              if(!day) return <div key={i}/>;
              const ds=`${yr}-${String(mo+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const evs = eventsForDay(day);
              const isToday = ds===todayStr, isSel = ds===selDate;
              const isWe = [0,6].includes(new Date(ds).getDay());
              return (
                <button key={i} onClick={()=>setSelDate(isSel?null:ds)}
                  className={`min-h-[54px] p-1.5 rounded-xl flex flex-col text-left transition-all ${isSel?'bg-blue-600 ring-2 ring-blue-300':isToday?'ring-1 ring-blue-400 bg-blue-50':'hover:bg-gray-50'}`}>
                  <span className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center mb-1 ${isToday&&!isSel?'bg-blue-500 text-white':isSel?'text-white':isWe?'text-gray-300':'text-gray-700'}`}>{day}</span>
                  <div className="space-y-0.5 w-full">
                    {evs.slice(0,2).map(ev=>{
                      const cfg=EC[ev.type];
                      return <div key={ev.id} className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate ${isSel?'bg-white/20 text-white':`${cfg.bg} ${cfg.text}`}`}>{ev.title}</div>;
                    })}
                    {evs.length>2 && <div className={`text-[9px] ${isSel?'text-white/70':'text-gray-400'}`}>+{evs.length-2}</div>}
                  </div>
                </button>
              );
            })}
          </div>
          {selDate && selEvents.length>0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 anim">
              <p className="text-sm font-semibold text-gray-700 mb-3">{new Date(selDate).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
              <div className="space-y-2">
                {selEvents.map(ev=>{const cfg=EC[ev.type];return(
                  <div key={ev.id} className={`${cfg.bg} rounded-xl p-3`}><p className={`text-sm font-semibold ${cfg.text}`}>{ev.title}</p><p className="text-xs text-gray-600 mt-0.5">{ev.description}</p></div>
                );})}
              </div>
            </div>
          )}
        </div>

        <div className="card card-p">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Events This Month ({monthEvents.length})</h3>
          {monthEvents.length===0 ? <p className="text-xs text-gray-400 text-center py-6">No events this month</p> : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {monthEvents.map(ev=>{
                const cfg=EC[ev.type]; const d=new Date(ev.date);
                return (
                  <button key={ev.id} onClick={()=>setSelDate(ev.date)} className={`w-full ${cfg.bg} rounded-xl p-3 text-left hover:opacity-90 transition-opacity flex items-start gap-3`}>
                    <div className="text-center flex-shrink-0 w-8">
                      <p className="text-xs font-bold text-gray-700">{d.getDate()}</p>
                      <p className="text-[10px] text-gray-400">{MONTHS[d.getMonth()].slice(0,3)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold ${cfg.text} truncate`}>{ev.title}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate">{ev.description}</p>
                    </div>
                    <span className={`badge text-[10px] flex-shrink-0 ${cfg.pill}`}>{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <Modal open onClose={()=>setShowAdd(false)} title="Add Event" size="sm"
          footer={<><button onClick={()=>setShowAdd(false)} className="btn btn-white">Cancel</button><button onClick={()=>{show('Event added to calendar','success');setShowAdd(false);}} className="btn btn-primary">Add</button></>}>
          <div className="space-y-4">
            <div><label className="field-label">Title</label><input className="field" placeholder="Event title"/></div>
            <div><label className="field-label">Date</label><input type="date" className="field"/></div>
            <div><label className="field-label">Type</label><select className="field-select">{Object.entries(EC).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
            <div><label className="field-label">Description</label><textarea className="field min-h-[80px] resize-none"/></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
