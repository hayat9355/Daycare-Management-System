import React, { useState } from 'react';
import { Plus, Send, Pin, ChevronDown, ChevronUp, Users, User, Megaphone } from 'lucide-react';
import { ANNOUNCEMENTS } from '../data/mockData';
import type { Announcement } from '../data/mockData';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const AUD = {
  all:     {label:'All',     cls:'badge-blue'},
  parents: {label:'Parents', cls:'badge-green'},
  staff:   {label:'Staff',   cls:'badge-purple'},
};

function AnnCard({ann}:{ann:Announcement}) {
  const [open, setOpen] = useState(ann.pinned);
  const aud = AUD[ann.audience];
  return (
    <div className={`card overflow-hidden ${ann.pinned?'ring-1 ring-blue-200':''}`}>
      <div className="card-p">
        <div className="flex items-start gap-3">
          {ann.pinned && <Pin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"/>}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-gray-900 text-sm">{ann.title}</h3>
              {ann.pinned && <span className="badge badge-blue text-[10px]">Pinned</span>}
              <span className={`badge ${aud.cls} text-[10px]`}>{aud.label}</span>
            </div>
            <p className="text-xs text-gray-400">{ann.author} · {new Date(ann.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</p>
            {open && <p className="text-sm text-gray-600 mt-3 leading-relaxed">{ann.body}</p>}
          </div>
          <button onClick={()=>setOpen(!open)} className="btn-icon flex-shrink-0">
            {open ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ComposeModal({onClose}:{onClose:()=>void}) {
  const {show}=useToast();
  return (
    <Modal open onClose={onClose} title="New Announcement" size="md"
      footer={<><button onClick={onClose} className="btn btn-white">Cancel</button><button onClick={()=>{show('Announcement sent','success');onClose();}} className="btn btn-primary"><Send className="w-4 h-4"/>Send</button></>}>
      <div className="space-y-4">
        <div><label className="field-label">Title</label><input className="field" placeholder="Announcement title"/></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="field-label">Audience</label>
            <select className="field-select"><option value="all">All (Parents & Staff)</option><option value="parents">Parents Only</option><option value="staff">Staff Only</option></select>
          </div>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded accent-blue-600"/>
              <span className="text-sm text-gray-600 font-medium">Pin to top</span>
            </label>
          </div>
        </div>
        <div><label className="field-label">Message</label><textarea className="field min-h-[120px] resize-none" placeholder="Write your announcement..."/></div>
        <div>
          <p className="field-label mb-2">Send Via</p>
          <div className="flex gap-4">
            {['App Notification','Email','SMS'].map(ch=>(
              <label key={ch} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-blue-600"/>{ch}
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function Communication() {
  const [filter, setFilter] = useState<'all'|'parents'|'staff'|'pinned'>('all');
  const [showCompose, setShowCompose] = useState(false);

  const filtered = ANNOUNCEMENTS.filter(a=>{
    if(filter==='pinned') return a.pinned;
    if(filter==='all') return true;
    return a.audience===filter||a.audience==='all';
  });

  return (
    <div className="space-y-5 anim">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-lg font-bold text-gray-900">Communication</h2><p className="text-sm text-gray-400 mt-0.5">Announcements, alerts & parent messages</p></div>
        <button onClick={()=>setShowCompose(true)} className="btn btn-primary btn-sm"><Plus className="w-4 h-4"/>New Announcement</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label:'Total Sent',  v:ANNOUNCEMENTS.length,                         cls:'text-blue-600 bg-blue-50'},
          {label:'Pinned',      v:ANNOUNCEMENTS.filter(a=>a.pinned).length,     cls:'text-amber-600 bg-amber-50'},
          {label:'To Parents',  v:ANNOUNCEMENTS.filter(a=>a.audience!=='staff').length, cls:'text-emerald-600 bg-emerald-50'},
          {label:'To Staff',    v:ANNOUNCEMENTS.filter(a=>a.audience!=='parents').length,cls:'text-violet-600 bg-violet-50'},
        ].map(s=>(
          <div key={s.label} className={`card card-p ${s.cls} text-center`}>
            <p className="text-2xl font-bold">{s.v}</p>
            <p className="text-xs font-medium mt-0.5 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card card-p">
        <div className="flex items-center gap-3 mb-3">
          <Megaphone className="w-5 h-5 text-blue-400"/>
          <p className="font-semibold text-gray-800 text-sm">Active Channels</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            {ch:'App Notifications',count:'48 recipients',cls:'bg-blue-50 text-blue-600'},
            {ch:'Email',            count:'46 recipients',cls:'bg-emerald-50 text-emerald-600'},
            {ch:'SMS',              count:'31 recipients',cls:'bg-amber-50 text-amber-600'},
          ].map(c=>(
            <div key={c.ch} className={`${c.cls} rounded-xl p-3 text-center`}>
              <p className="text-sm font-semibold">{c.ch}</p>
              <p className="text-xs opacity-70 mt-0.5">{c.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex rounded-xl border border-gray-200 overflow-hidden w-fit">
        {(['all','parents','staff','pinned'] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-2 text-xs font-semibold capitalize transition-colors ${filter===f?'bg-blue-600 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(ann=><AnnCard key={ann.id} ann={ann}/>)}
      </div>

      {showCompose && <ComposeModal onClose={()=>setShowCompose(false)}/>}
    </div>
  );
}
