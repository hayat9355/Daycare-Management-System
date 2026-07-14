import React, { useState } from 'react';
import { Plus, Search, Phone, Edit2, UserCheck } from 'lucide-react';
import { WAITLIST, CLASS_GROUPS } from '../data/mockData';
import type { WaitlistEntry, WaitlistStatus } from '../data/mockData';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const ST: Record<WaitlistStatus,{label:string;cls:string}> = {
  waiting:   {label:'Waiting',   cls:'badge-amber'},
  contacted: {label:'Contacted', cls:'badge-blue'},
  enrolled:  {label:'Enrolled',  cls:'badge-green'},
  cancelled: {label:'Cancelled', cls:'badge-gray'},
};
const PRI = {
  high:   {label:'High',   cls:'badge-red'},
  normal: {label:'Normal', cls:'badge-amber'},
  low:    {label:'Low',    cls:'badge-gray'},
};

function EntryModal({e,onClose}:{e:WaitlistEntry;onClose:()=>void}) {
  const {show}=useToast();
  return (
    <Modal open onClose={onClose} title="Waitlist Entry" size="md"
      footer={<><button onClick={()=>{show('Marked as contacted','success');onClose();}} className="btn btn-white btn-sm">Mark Contacted</button><button onClick={()=>{show('Child moved to enrolled','success');onClose();}} className="btn btn-primary btn-sm"><UserCheck className="w-3.5 h-3.5"/>Enroll</button></>}>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div><h3 className="font-bold text-gray-900">{e.childName}</h3><p className="text-xs text-gray-500 mt-0.5">DOB: {new Date(e.dob).toLocaleDateString()} · {e.requestedClass}</p></div>
            <div className="flex flex-col items-end gap-1.5"><span className={`badge ${ST[e.status].cls}`}>{ST[e.status].label}</span><span className={`badge ${PRI[e.priority].cls}`}>{PRI[e.priority].label} Priority</span></div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-0.5">Parent</p><p className="text-sm font-medium text-gray-800">{e.parentName}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-0.5">Request Date</p><p className="text-sm font-medium text-gray-800">{new Date(e.requestDate).toLocaleDateString()}</p></div>
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/><p className="text-sm text-gray-800">{e.parentPhone}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-0.5">Email</p><p className="text-sm text-gray-800 truncate">{e.parentEmail}</p></div>
        </div>
        {e.notes && <div className="bg-amber-50 rounded-xl p-3"><p className="text-xs font-semibold text-amber-600 mb-1">Notes</p><p className="text-sm text-gray-700">{e.notes}</p></div>}
        <div><label className="field-label">Update Status</label><select className="field-select" defaultValue={e.status}>{Object.entries(ST).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
      </div>
    </Modal>
  );
}

function AddEntry({onClose}:{onClose:()=>void}) {
  const {show}=useToast();
  return (
    <Modal open onClose={onClose} title="Add to Waitlist" size="md"
      footer={<><button onClick={onClose} className="btn btn-white">Cancel</button><button onClick={()=>{show('Added to waitlist','success');onClose();}} className="btn btn-primary">Add Entry</button></>}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="field-label">Child Name</label><input className="field" placeholder="Full name"/></div>
        <div><label className="field-label">Date of Birth</label><input type="date" className="field"/></div>
        <div><label className="field-label">Requested Class</label><select className="field-select">{CLASS_GROUPS.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label className="field-label">Priority</label><select className="field-select"><option value="normal">Normal</option><option value="high">High</option><option value="low">Low</option></select></div>
        <div><label className="field-label">Parent Name</label><input className="field" placeholder="Jane Smith"/></div>
        <div><label className="field-label">Parent Phone</label><input type="tel" className="field" placeholder="(555) 000-0000"/></div>
        <div className="sm:col-span-2"><label className="field-label">Parent Email</label><input type="email" className="field" placeholder="parent@email.com"/></div>
        <div className="sm:col-span-2"><label className="field-label">Notes</label><textarea className="field min-h-[70px] resize-none" placeholder="Sibling discounts, special needs, etc."/></div>
      </div>
    </Modal>
  );
}

export default function Waitlist() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState<'all'|WaitlistStatus>('all');
  const [selected, setSelected] = useState<WaitlistEntry|null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = WAITLIST.filter(e=>
    `${e.childName} ${e.parentName} ${e.requestedClass}`.toLowerCase().includes(search.toLowerCase()) &&
    (statusF==='all'||e.status===statusF)
  );

  return (
    <div className="space-y-5 anim">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-lg font-bold text-gray-900">Waitlist Management</h2><p className="text-sm text-gray-400 mt-0.5">{WAITLIST.filter(e=>e.status==='waiting').length} waiting for a spot</p></div>
        <button onClick={()=>setShowAdd(true)} className="btn btn-primary btn-sm"><Plus className="w-4 h-4"/>Add to Waitlist</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label:'Waiting',  v:WAITLIST.filter(e=>e.status==='waiting').length,   cls:'bg-amber-50 text-amber-700'},
          {label:'Contacted',v:WAITLIST.filter(e=>e.status==='contacted').length, cls:'bg-blue-50 text-blue-700'},
          {label:'Enrolled', v:WAITLIST.filter(e=>e.status==='enrolled').length,  cls:'bg-emerald-50 text-emerald-700'},
          {label:'Total',    v:WAITLIST.length,                                    cls:'bg-gray-100 text-gray-700'},
        ].map(s=>(
          <div key={s.label} className={`card card-p ${s.cls}`}>
            <p className="text-2xl font-bold">{s.v}</p>
            <p className="text-xs font-medium mt-0.5 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input className="field pl-9" placeholder="Search by child or parent..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          {(['all','waiting','contacted','enrolled','cancelled'] as const).map(s=>(
            <button key={s} onClick={()=>setStatusF(s)} className={`px-3 py-2 text-xs font-semibold capitalize transition-colors ${statusF===s?'bg-blue-600 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="tbl">
          <thead><tr><th>Child</th><th>Requested Class</th><th className="hidden sm:table-cell">Parent</th><th className="hidden md:table-cell">Date</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(entry=>(
              <tr key={entry.id}>
                <td><p className="text-sm font-medium text-gray-900">{entry.childName}</p><p className="text-xs text-gray-400">DOB: {new Date(entry.dob).toLocaleDateString()}</p></td>
                <td><span className="badge badge-blue">{entry.requestedClass}</span></td>
                <td className="hidden sm:table-cell"><p className="text-sm text-gray-700">{entry.parentName}</p><p className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3"/>{entry.parentPhone}</p></td>
                <td className="hidden md:table-cell text-sm text-gray-600">{new Date(entry.requestDate).toLocaleDateString()}</td>
                <td><span className={`badge ${PRI[entry.priority].cls}`}>{PRI[entry.priority].label}</span></td>
                <td><span className={`badge ${ST[entry.status].cls}`}>{ST[entry.status].label}</span></td>
                <td><button onClick={()=>setSelected(entry)} className="btn-icon"><Edit2 className="w-3.5 h-3.5"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <EntryModal e={selected} onClose={()=>setSelected(null)}/>}
      {showAdd && <AddEntry onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}
