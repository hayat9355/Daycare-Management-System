import React, { useState } from 'react';
import { Plus, Search, AlertCircle, Phone, Mail, ChevronRight, Heart, Trash2, Edit2 } from 'lucide-react';
import { CHILDREN, CLASS_GROUPS } from '../data/mockData';
import type { Child } from '../data/mockData';
import { Avatar } from '../components/UI';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

function ChildDetail({ child, onClose }: { child: Child; onClose: () => void }) {
  const [tab, setTab] = useState<'info'|'medical'|'emergency'>('info');
  const age = Math.floor((Date.now() - new Date(child.dob).getTime()) / (365.25*24*3600*1000));
  return (
    <Modal open onClose={onClose} size="lg">
      <div className="flex items-center gap-4 mb-6">
        <Avatar src={child.photo} name={`${child.firstName} ${child.lastName}`} size="lg"/>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{child.firstName} {child.lastName}</h2>
          <p className="text-sm text-gray-500">{child.classGroup} · Age {age} · {child.gender}</p>
          <span className={`badge mt-1.5 ${child.status==='active'?'badge-green':'badge-gray'}`}>{child.status}</span>
        </div>
      </div>
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
        {(['info','medical','emergency'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${tab===t?'bg-white shadow-sm text-blue-600':'text-gray-500 hover:text-gray-700'}`}>{t==='emergency'?'Emergency':t==='medical'?'Medical':'Info'}</button>
        ))}
      </div>
      {tab==='info' && (
        <div className="grid sm:grid-cols-2 gap-3 anim">
          {[
            {l:'Date of Birth',   v:new Date(child.dob).toLocaleDateString()},
            {l:'Blood Type',      v:child.bloodType},
            {l:'Enrolled',        v:new Date(child.enrolledDate).toLocaleDateString()},
            {l:'Parent',          v:child.parentName},
            {l:'Parent Phone',    v:child.parentPhone},
            {l:'Parent Email',    v:child.parentEmail},
            {l:'Address',         v:child.address},
          ].map(f=>(
            <div key={f.l} className="bg-gray-50 rounded-xl p-3.5">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{f.l}</p>
              <p className="text-sm font-medium text-gray-800">{f.v}</p>
            </div>
          ))}
        </div>
      )}
      {tab==='medical' && (
        <div className="space-y-4 anim">
          <div className="bg-red-50 rounded-xl p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wide mb-2"><AlertCircle className="w-3.5 h-3.5"/>Allergies</p>
            {child.allergies.length>0
              ? <div className="flex flex-wrap gap-2">{child.allergies.map(a=><span key={a} className="badge badge-red">{a}</span>)}</div>
              : <p className="text-sm text-gray-500">No known allergies</p>}
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2"><Heart className="w-3.5 h-3.5"/>Medical Conditions</p>
            <p className="text-sm text-gray-700">{child.medicalConditions||'None'}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3.5"><p className="text-[11px] text-gray-400 mb-1">Doctor</p><p className="text-sm font-medium text-gray-800">{child.doctor}</p></div>
            <div className="bg-gray-50 rounded-xl p-3.5"><p className="text-[11px] text-gray-400 mb-1">Doctor Phone</p><p className="text-sm font-medium text-gray-800">{child.doctorPhone}</p></div>
          </div>
        </div>
      )}
      {tab==='emergency' && (
        <div className="space-y-4 anim">
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-3">Emergency Contact</p>
            <p className="font-semibold text-gray-900">{child.emergencyContact}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1"><Phone className="w-3.5 h-3.5"/>{child.emergencyPhone}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Parent Contact</p>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/>{child.parentPhone}</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400"/>{child.parentEmail}</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function AddChild({ onClose }: { onClose: () => void }) {
  const {show} = useToast();
  return (
    <Modal open onClose={onClose} title="Add Child Profile" size="lg"
      footer={<><button onClick={onClose} className="btn btn-white">Cancel</button><button onClick={()=>{show('Child added successfully','success');onClose();}} className="btn btn-primary">Save Profile</button></>}>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Personal</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="field-label">First Name</label><input className="field" placeholder="Emma" /></div>
            <div><label className="field-label">Last Name</label><input className="field" placeholder="Patterson" /></div>
            <div><label className="field-label">Date of Birth</label><input type="date" className="field" /></div>
            <div><label className="field-label">Gender</label><select className="field-select"><option>Female</option><option>Male</option></select></div>
            <div><label className="field-label">Class</label><select className="field-select">{CLASS_GROUPS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="field-label">Blood Type</label><select className="field-select">{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t=><option key={t}>{t}</option>)}</select></div>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Parent / Guardian</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="field-label">Parent Name</label><input className="field" placeholder="Jane Patterson" /></div>
            <div><label className="field-label">Phone</label><input className="field" type="tel" placeholder="(555) 000-0000" /></div>
            <div className="sm:col-span-2"><label className="field-label">Email</label><input className="field" type="email" placeholder="parent@email.com" /></div>
            <div className="sm:col-span-2"><label className="field-label">Address</label><input className="field" placeholder="123 Main St, City" /></div>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Medical & Emergency</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="field-label">Allergies</label><input className="field" placeholder="None, or list allergies" /></div>
            <div><label className="field-label">Medical Conditions</label><input className="field" placeholder="None" /></div>
            <div><label className="field-label">Emergency Contact</label><input className="field" placeholder="John Patterson" /></div>
            <div><label className="field-label">Emergency Phone</label><input className="field" type="tel" placeholder="(555) 000-0001" /></div>
            <div><label className="field-label">Doctor</label><input className="field" placeholder="Dr. Smith" /></div>
            <div><label className="field-label">Doctor Phone</label><input className="field" type="tel" /></div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function Children() {
  const [search, setSearch] = useState('');
  const [cls, setCls] = useState('all');
  const [detail, setDetail] = useState<Child|null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [viewMode, setViewMode] = useState<'grid'|'table'>('grid');
  const {show} = useToast();

  const filtered = CHILDREN.filter(c=>{
    const name = `${c.firstName} ${c.lastName} ${c.classGroup}`.toLowerCase();
    return name.includes(search.toLowerCase()) && (cls==='all'||c.classGroup===cls);
  });

  return (
    <div className="space-y-5 anim">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-lg font-bold text-gray-900">Children ({CHILDREN.filter(c=>c.status==='active').length} active)</h2><p className="text-sm text-gray-400 mt-0.5">Manage child profiles, records & contacts</p></div>
        <button onClick={()=>setShowAdd(true)} className="btn btn-primary btn-sm"><Plus className="w-4 h-4"/>Add Child</button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
          <input className="field pl-9" placeholder="Search children..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="field-select w-44" value={cls} onChange={e=>setCls(e.target.value)}>
          <option value="all">All Classes</option>
          {CLASS_GROUPS.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          <button onClick={()=>setViewMode('grid')} className={`px-3 py-2 text-xs font-semibold transition-colors ${viewMode==='grid'?'bg-blue-600 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>Grid</button>
          <button onClick={()=>setViewMode('table')} className={`px-3 py-2 text-xs font-semibold transition-colors ${viewMode==='table'?'bg-blue-600 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>Table</button>
        </div>
      </div>

      {viewMode==='grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(child=>(
            <div key={child.id} onClick={()=>setDetail(child)} className="card card-p cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="flex items-start gap-3 mb-3">
                <Avatar src={child.photo} name={`${child.firstName} ${child.lastName}`} size="md"/>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{child.firstName} {child.lastName}</p>
                  <p className="text-xs text-gray-400">{child.classGroup}</p>
                  <span className="badge badge-blue mt-1">{child.gender}</span>
                </div>
              </div>
              {child.allergies.length>0 && (
                <div className="flex items-center gap-1.5 bg-red-50 rounded-lg px-2 py-1.5 mb-2">
                  <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0"/>
                  <span className="text-xs text-red-600 truncate font-medium">{child.allergies.join(', ')}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400 truncate">{child.parentName}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors"/>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="tbl">
            <thead><tr><th>Child</th><th>Class</th><th>DOB</th><th className="hidden md:table-cell">Parent</th><th className="hidden lg:table-cell">Allergies</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(child=>(
                <tr key={child.id}>
                  <td><div className="flex items-center gap-2.5"><Avatar src={child.photo} name={`${child.firstName} ${child.lastName}`} size="xs"/><span className="font-medium text-gray-800 text-sm">{child.firstName} {child.lastName}</span></div></td>
                  <td><span className="badge badge-blue">{child.classGroup}</span></td>
                  <td className="text-xs">{new Date(child.dob).toLocaleDateString()}</td>
                  <td className="hidden md:table-cell text-xs">{child.parentName}</td>
                  <td className="hidden lg:table-cell">{child.allergies.length>0?<span className="badge badge-red">{child.allergies[0]}{child.allergies.length>1?` +${child.allergies.length-1}`:''}</span>:<span className="text-xs text-gray-400">None</span>}</td>
                  <td><div className="flex gap-1"><button onClick={()=>setDetail(child)} className="btn-icon"><Edit2 className="w-3.5 h-3.5"/></button><button onClick={()=>show('Confirm delete in modal','warning')} className="btn-icon text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detail && <ChildDetail child={detail} onClose={()=>setDetail(null)}/>}
      {showAdd && <AddChild onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}
