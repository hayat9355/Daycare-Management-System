import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type TT = 'success'|'error'|'warning'|'info';
interface Toast { id:string; msg:string; type:TT }
const Ctx = createContext<{show:(m:string,t?:TT)=>void}>({show:()=>{}});
export const useToast = () => useContext(Ctx);

const CFG:Record<TT,{icon:React.ElementType;bar:string;ic:string}> = {
  success:{ icon:CheckCircle, bar:'bg-emerald-500', ic:'text-emerald-600' },
  error:  { icon:XCircle,     bar:'bg-red-500',     ic:'text-red-600'     },
  warning:{ icon:AlertTriangle,bar:'bg-amber-500',  ic:'text-amber-600'   },
  info:   { icon:Info,        bar:'bg-blue-500',    ic:'text-blue-600'    },
};

function Item({t,rm}:{t:Toast;rm:()=>void}) {
  const cfg = CFG[t.type];
  useEffect(()=>{const id=setTimeout(rm,3800);return()=>clearTimeout(id);},[]);
  return (
    <div className="toast-anim relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex items-start gap-3 px-4 py-3.5 min-w-[280px] max-w-xs">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar}`} />
      <cfg.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${cfg.ic}`} />
      <p className="text-sm font-medium text-gray-800 flex-1 pr-2">{t.msg}</p>
      <button onClick={rm} className="text-gray-300 hover:text-gray-500 flex-shrink-0"><X className="w-4 h-4"/></button>
    </div>
  );
}

export function ToastProvider({children}:{children:ReactNode}) {
  const [list, setList] = useState<Toast[]>([]);
  const show = useCallback((msg:string, type:TT='info')=>{
    const id = Math.random().toString(36).slice(2);
    setList(p=>[...p,{id,msg,type}]);
  },[]);
  const rm = (id:string)=>setList(p=>p.filter(t=>t.id!==id));
  return (
    <Ctx.Provider value={{show}}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {list.map(t=><Item key={t.id} t={t} rm={()=>rm(t.id)}/>)}
      </div>
    </Ctx.Provider>
  );
}
