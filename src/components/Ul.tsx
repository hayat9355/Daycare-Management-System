import React from 'react';

export function Avatar({src,name,size='md'}:{src?:string;name:string;size?:'xs'|'sm'|'md'|'lg'}) {
  const sz={xs:'w-7 h-7 text-[10px]',sm:'w-9 h-9 text-xs',md:'w-11 h-11 text-sm',lg:'w-16 h-16 text-lg'}[size];
  const initials = name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  if (src) return <img src={src} alt={name} className={`${sz} rounded-full object-cover flex-shrink-0`}/>;
  return <div className={`${sz} rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0`}>{initials}</div>;
}

export function KpiCard({icon,label,value,sub,iconBg}:{icon:React.ReactNode;label:string;value:string|number;sub?:string;iconBg:string}) {
  return (
    <div className="card card-p flex items-start gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function MiniBar({data,labelKey,valueKey,color='bg-blue-500'}:{
  data:Record<string,string|number>[];labelKey:string;valueKey:string;color?:string
}) {
  const max = Math.max(...data.map(d=>d[valueKey] as number));
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((d,i)=>{
        const v = d[valueKey] as number;
        const pct = (v/max)*100;
        const label = typeof v === 'number' && v > 999 ? `$${(v/1000).toFixed(0)}k` : String(v);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="w-full flex flex-col justify-end" style={{height:'68px'}}>
              <div title={`${d[labelKey]}: ${label}`} className={`w-full ${color} rounded-t-md transition-all hover:opacity-80`} style={{height:`${Math.max(pct,5)}%`}}/>
            </div>
            <span className="text-[10px] font-medium text-gray-400">{d[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

export function EmptyState({icon,title,desc}:{icon:React.ReactNode;title:string;desc?:string}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-400">{icon}</div>
      <p className="font-semibold text-gray-600 text-sm">{title}</p>
      {desc && <p className="text-xs text-gray-400 mt-1 max-w-xs">{desc}</p>}
    </div>
  );
}
