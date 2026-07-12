import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, Edit2 } from 'lucide-react';
import { STAFF } from '../data/mockData';
import type { Staff } from '../data/mockData';
import { Avatar } from '../components/UI';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

function StaffDetail({s,onClose}:{s:Staff;onClose:()=>void}) {
  return (
    <Modal open onClose={onClose} size="md">
      <div className="flex items-center gap-4 mb-6">
        <Avatar src={s.photo} name={s.name} size="lg"/>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{s.name}</h2>
          <p className="text-sm text-blue-600 font-medium">{s.role}</p>
          <div className="flex gap-2 mt-1.5">
            <span className={`badge ${s.status==='active'?'badge-green':'badge-amber'}`}>{s.status==='active'?'Active':'On Leave'}</span>
            <span className="badge badge-blue">{s.classAssigned}</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Contact</p>
          <div className="flex items-center gap-2 text-sm text-gray-700"><Mail className="w-4 h-4 text-gray-400"/>{s.email}</div>
          <div className="flex items-center gap-2 text-sm text-gray-700"><Phone className="w-4 h-4 text-gray-400"/>{s.phone}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Schedule</p><p className="text-sm font-medium text-gray-800">{s.schedule}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Joined</p><p className="text-sm font-medium text-gray-800">{new Date(s.joinDate).toLocaleDateString()}</p></div>
        </div>
        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Qualifications</p><div className="flex flex-wrap gap-2">{s.qualifications.map(q=><span key={q} className="badge badge-blue">{q}</span>)}</div></div>
        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Certifications</p><div className="flex flex-wrap gap-2">{s.certifications.map(c=><span key={c} className="badge badge-green">{c}</span>)}</div></div>
      </div>
    </Modal>
  );
}

function AddStaff({onClose}:{onClose:()=>void}) {
  const {show}=useToast();
  return (
    <Modal open onClose={onClose} title="Add Staff Member" size="md"
      footer={<><button onClick={onClose} className="btn btn-white">Cancel</button><button onClick={()=>{show('Staff added successfully','success');onClose();}} className="btn btn-primary">Save</button></>}>
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="field-label">Full Name</label><input className="field" placeholder="Ms. Jane Smith"/></div>
          <div><label className="field-label">Role</label><select className="field-select">{['Director','Lead Teacher','Assistant Teacher','Aide','Nutritionist','Admin'].map(r=><option key={r}>{r}</option>)}</select></div>
          <div><label className="field-label">Email</label><input type="email" className="field" placeholder="jane@daycare.edu"/></div>
          <div><label className="field-label">Phone</label><input type="tel" className="field" placeholder="(555) 000-0000"/></div>
          <div><label className="field-label">Class Assigned</label><select className="field-select">{['Administration','Toddlers A','Toddlers B','Preschool A','Preschool B','Pre-K Stars'].map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label className="field-label">Start Date</label><input type="date" className="field"/></div>
          <div className="sm:col-span-2"><label className="field-label">Schedule</label><input className="field" placeholder="Mon-Fri 8am-5pm"/></div>
          <div className="sm:col-span-2"><label className="field-label">Qualifications (comma-separated)</label><input className="field" placeholder="B.Ed Early Childhood, CPR Certified"/></div>
          <div className="sm:col-span-2"><label className="field-label">Certifications (comma-separated)</label><input className="field" placeholder="CPR, First Aid, Mandated Reporter"/></div>
        </div>
      </div>
    </Modal>
  );
}

export default function StaffPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Staff|null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState<'cards'|'table'>('cards');

  const filtered = STAFF.filter(s=>`${s.name} ${s.role} ${s.classAssigned}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5 anim">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-lg font-bold text-gray-900">Staff Management</h2><p className="text-sm text-gray-400 mt-0.5">{STAFF.filter(s=>s.status==='active').length} active · {STAFF.filter(s=>s.status==='on_leave').length} on leave</p></div>
        <button onClick={()=>setShowAdd(true)} className="btn btn-primary btn-sm"><Plus className="w-4 h-4"/>Add Staff</button>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input className="field pl-9" placeholder="Search staff..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          <button onClick={()=>setView('cards')} className={`px-3 py-2 text-xs font-semibold transition-colors ${view==='cards'?'bg-blue-600 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>Cards</button>
          <button onClick={()=>setView('table')} className={`px-3 py-2 text-xs font-semibold transition-colors ${view==='table'?'bg-blue-600 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>Table</button>
        </div>
      </div>
      {view==='cards' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s=>(
            <div key={s.id} onClick={()=>setSelected(s)} className="card card-p cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <Avatar src={s.photo} name={s.name} size="md"/>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{s.name}</p>
                  <p className="text-xs text-blue-600 font-medium">{s.role}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.classAssigned}</p>
                </div>
                <span className={`badge ${s.status==='active'?'badge-green':'badge-amber'} flex-shrink-0`}>{s.status==='active'?'Active':'Leave'}</span>
              </div>
              <div className="space-y-1 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1.5 truncate"><Mail className="w-3 h-3 flex-shrink-0"/>{s.email}</div>
                <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 flex-shrink-0"/>{s.phone}</div>
              </div>
              <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
                {s.certifications.map(c=><span key={c} className="badge badge-green text-[10px]">{c}</span>)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="tbl">
            <thead><tr><th>Staff</th><th>Role</th><th className="hidden md:table-cell">Class</th><th className="hidden lg:table-cell">Schedule</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id}>
                  <td><div className="flex items-center gap-2.5"><Avatar src={s.photo} name={s.name} size="xs"/><div><p className="text-sm font-medium text-gray-800">{s.name}</p><p className="text-xs text-gray-400">{s.email}</p></div></div></td>
                  <td className="text-sm">{s.role}</td>
                  <td className="hidden md:table-cell"><span className="badge badge-blue">{s.classAssigned}</span></td>
                  <td className="hidden lg:table-cell text-xs text-gray-500">{s.schedule}</td>
                  <td><span className={`badge ${s.status==='active'?'badge-green':'badge-amber'}`}>{s.status==='active'?'Active':'On Leave'}</span></td>
                  <td><button onClick={()=>setSelected(s)} className="btn-icon"><Edit2 className="w-3.5 h-3.5"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && <StaffDetail s={selected} onClose={()=>setSelected(null)}/>}
      {showAdd && <AddStaff onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}
