import React, { useState } from 'react';
import { Plus, Search, Send, Download, CheckCircle, Clock, AlertCircle, Minus } from 'lucide-react';
import { INVOICES, CHILDREN } from '../data/mockData';
import type { Invoice, PaymentStatus } from '../data/mockData';
import { Avatar } from '../components/UI';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const ST: Record<PaymentStatus,{label:string;cls:string;icon:React.ReactNode}> = {
  paid:    {label:'Paid',    cls:'badge-green',  icon:<CheckCircle className="w-3.5 h-3.5"/>},
  pending: {label:'Pending', cls:'badge-amber',  icon:<Clock className="w-3.5 h-3.5"/>},
  overdue: {label:'Overdue', cls:'badge-red',    icon:<AlertCircle className="w-3.5 h-3.5"/>},
  partial: {label:'Partial', cls:'badge-purple', icon:<Minus className="w-3.5 h-3.5"/>},
};

function InvoiceDetail({inv,onClose}:{inv:Invoice;onClose:()=>void}) {
  const {show}=useToast();
  const child = CHILDREN.find(c=>c.id===inv.childId);
  const cfg = ST[inv.status];
  return (
    <Modal open onClose={onClose} title="Invoice Details" size="md"
      footer={<><button onClick={()=>{show('Invoice sent to parent','success');onClose();}} className="btn btn-white btn-sm"><Send className="w-3.5 h-3.5"/>Send</button><button onClick={()=>show('PDF downloaded','info')} className="btn btn-primary btn-sm"><Download className="w-3.5 h-3.5"/>PDF</button></>}>
      <div className="space-y-5">
        <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            {child && <Avatar src={child.photo} name={`${child.firstName} ${child.lastName}`} size="sm"/>}
            <div><p className="font-bold text-gray-900">{child?.firstName} {child?.lastName}</p><p className="text-xs text-gray-500">{child?.classGroup} · {inv.month}</p></div>
          </div>
          <span className={`badge ${cfg.cls} gap-1.5 px-3 py-1.5`}>{cfg.icon}{cfg.label}</span>
        </div>
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          {inv.items.map((item,i)=>(
            <div key={i} className="flex justify-between px-4 py-3 text-sm border-b border-gray-50 last:border-0">
              <span className="text-gray-600">{item.description}</span>
              <span className="font-semibold text-gray-900">${item.amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3 bg-gray-50 font-bold text-sm">
            <span>Total</span><span className="text-gray-900">${inv.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Due Date</p><p className="font-medium text-sm text-gray-800">{new Date(inv.dueDate).toLocaleDateString()}</p></div>
          {inv.paidDate && <div className="bg-emerald-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Paid On</p><p className="font-medium text-sm text-emerald-700">{new Date(inv.paidDate).toLocaleDateString()}</p></div>}
        </div>
        {inv.status!=='paid' && (
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-sm font-semibold text-blue-700 mb-3">Record Payment</p>
            <div className="flex gap-2">
              <input className="field flex-1 text-sm" type="number" defaultValue={inv.total}/>
              <select className="field-select w-32 text-sm"><option>Cash</option><option>Card</option><option>Bank Transfer</option></select>
              <button onClick={()=>{show('Payment recorded','success');onClose();}} className="btn btn-primary btn-sm whitespace-nowrap">Record</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function CreateInvoice({onClose}:{onClose:()=>void}) {
  const {show}=useToast();
  return (
    <Modal open onClose={onClose} title="Create Invoice" size="md"
      footer={<><button onClick={onClose} className="btn btn-white">Cancel</button><button onClick={()=>{show('Invoice created','success');onClose();}} className="btn btn-primary">Create</button></>}>
      <div className="space-y-4">
        <div><label className="field-label">Child</label><select className="field-select">{CHILDREN.filter(c=>c.status==='active').map(c=><option key={c.id}>{c.firstName} {c.lastName} – {c.classGroup}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="field-label">Month</label><input type="month" className="field" defaultValue={new Date().toISOString().slice(0,7)}/></div>
          <div><label className="field-label">Due Date</label><input type="date" className="field"/></div>
        </div>
        <div><label className="field-label">Tuition ($)</label><input type="number" className="field" defaultValue="1200"/></div>
        <div><label className="field-label">Activity Fee ($)</label><input type="number" className="field" defaultValue="35"/></div>
        <div><label className="field-label">Additional Fees / Notes</label><input className="field" placeholder="Late pick-up, supply fee, etc."/></div>
      </div>
    </Modal>
  );
}

export default function Billing() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState<'all'|PaymentStatus>('all');
  const [selInv, setSelInv] = useState<Invoice|null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const {show} = useToast();

  const filtered = INVOICES.filter(inv=>{
    const child = CHILDREN.find(c=>c.id===inv.childId);
    const name = child?`${child.firstName} ${child.lastName}`:'';
    return name.toLowerCase().includes(search.toLowerCase()) && (statusF==='all'||inv.status===statusF);
  });

  const collected = INVOICES.filter(i=>i.status==='paid').reduce((s,i)=>s+i.total,0);
  const pending   = INVOICES.filter(i=>i.status==='pending').reduce((s,i)=>s+i.total,0);
  const overdue   = INVOICES.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.total,0);

  return (
    <div className="space-y-5 anim">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-lg font-bold text-gray-900">Billing & Fees</h2><p className="text-sm text-gray-400 mt-0.5">Invoices, payments & reminders</p></div>
        <div className="flex gap-2">
          <button onClick={()=>show('Reminders sent to parents with overdue invoices','info')} className="btn btn-white btn-sm"><Send className="w-4 h-4"/>Send Reminders</button>
          <button onClick={()=>setShowCreate(true)} className="btn btn-primary btn-sm"><Plus className="w-4 h-4"/>New Invoice</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {label:'Collected',value:`$${(collected/1000).toFixed(1)}k`,count:INVOICES.filter(i=>i.status==='paid').length,   cls:'bg-emerald-50 border-emerald-100 text-emerald-700'},
          {label:'Pending',  value:`$${(pending/1000).toFixed(1)}k`,  count:INVOICES.filter(i=>i.status==='pending').length, cls:'bg-amber-50 border-amber-100 text-amber-700'},
          {label:'Overdue',  value:`$${(overdue/1000).toFixed(1)}k`,  count:INVOICES.filter(i=>i.status==='overdue').length, cls:'bg-red-50 border-red-100 text-red-700'},
        ].map(s=>(
          <div key={s.label} className={`card card-p border ${s.cls}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm font-medium mt-1 opacity-80">{s.label} ({s.count} invoices)</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input className="field pl-9" placeholder="Search by child..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          {(['all','paid','pending','overdue','partial'] as const).map(s=>(
            <button key={s} onClick={()=>setStatusF(s)} className={`px-3 py-2 text-xs font-semibold capitalize transition-colors ${statusF===s?'bg-blue-600 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="card overflow-hidden">
        <table className="tbl">
          <thead><tr><th>Child</th><th>Month</th><th className="hidden sm:table-cell">Items</th><th>Amount</th><th>Due</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(inv=>{
              const child = CHILDREN.find(c=>c.id===inv.childId);
              const cfg = ST[inv.status];
              return (
                <tr key={inv.id}>
                  <td><div className="flex items-center gap-2">{child&&<Avatar src={child.photo} name={`${child.firstName} ${child.lastName}`} size="xs"/>}<div><p className="text-sm font-medium text-gray-800">{child?.firstName} {child?.lastName}</p><p className="text-xs text-gray-400">{child?.classGroup}</p></div></div></td>
                  <td className="text-sm text-gray-600">{inv.month}</td>
                  <td className="hidden sm:table-cell text-xs text-gray-400">{inv.items.length} items</td>
                  <td className="font-semibold text-gray-900">${inv.total.toLocaleString()}</td>
                  <td className="text-sm text-gray-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td><span className={`badge ${cfg.cls} gap-1`}>{cfg.icon}{cfg.label}</span></td>
                  <td><div className="flex gap-1"><button onClick={()=>setSelInv(inv)} className="btn btn-white btn-xs">View</button>{inv.status!=='paid'&&<button onClick={()=>show('Reminder sent','success')} className="btn-icon text-blue-400"><Send className="w-3.5 h-3.5"/></button>}</div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selInv && <InvoiceDetail inv={selInv} onClose={()=>setSelInv(null)}/>}
      {showCreate && <CreateInvoice onClose={()=>setShowCreate(false)}/>}
    </div>
  );
}
