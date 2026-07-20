import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm'|'md'|'lg'|'xl';
}
const S = {sm:'max-w-sm',md:'max-w-lg',lg:'max-w-2xl',xl:'max-w-4xl'};

export default function Modal({open,onClose,title,children,footer,size='md'}:Props) {
  useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow='';};},[open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose}/>
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${S[size]} flex flex-col max-h-[90vh] anim`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="btn-icon"><X className="w-4 h-4"/></button>
          </div>
        )}
        <div className={`overflow-y-auto flex-1 p-6 ${!title?'pt-10':''}`}>
          {!title && <button onClick={onClose} className="absolute top-4 right-4 btn-icon"><X className="w-4 h-4"/></button>}
          {children}
        </div>
        {footer && <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
