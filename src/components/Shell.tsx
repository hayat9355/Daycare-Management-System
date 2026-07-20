import React, { useState } from 'react';
import {
  LayoutDashboard, CalendarCheck, Users, FileText, DollarSign,
  UserSquare2, CalendarDays, Images, Megaphone, ListOrdered,
  Menu, X, Bell, ChevronRight, Baby, LogOut, Languages
} from 'lucide-react';
import { useLang } from '../hooks/useLang';

export type Page =
  'dashboard'|'attendance'|'children'|'reports'|
  'billing'|'staff'|'calendar'|'gallery'|'communication'|'waitlist';

const NAV = [
  { id:'dashboard',     labelKey:'nav.dashboard',     icon:LayoutDashboard, color:'text-blue-500' },
  { id:'attendance',    labelKey:'nav.attendance',    icon:CalendarCheck,   color:'text-emerald-500' },
  { id:'children',      labelKey:'nav.children',      icon:Users,           color:'text-pink-500' },
  { id:'reports',       labelKey:'nav.reports',        icon:FileText,        color:'text-violet-500' },
  { id:'billing',       labelKey:'nav.billing',        icon:DollarSign,      color:'text-teal-500' },
  { id:'staff',         labelKey:'nav.staff',          icon:UserSquare2,     color:'text-orange-500' },
  { id:'calendar',      labelKey:'nav.calendar',      icon:CalendarDays,    color:'text-cyan-500' },
  { id:'gallery',       labelKey:'nav.gallery',        icon:Images,          color:'text-rose-500' },
  { id:'communication', labelKey:'nav.communication', icon:Megaphone,       color:'text-amber-500' },
  { id:'waitlist',      labelKey:'nav.waitlist',       icon:ListOrdered,     color:'text-indigo-500' },
] as const;

function NavList({ active, onNav, close }: { active: Page; onNav: (p: Page) => void; close?: () => void }) {
  const { t } = useLang();
  return (
    <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
      {NAV.map(({ id, labelKey, icon: Icon, color }) => (
        <button
          key={id}
          onClick={() => { onNav(id as Page); close?.(); }}
          className={`nav-item ${active === id ? 'active' : ''}`}
        >
          <Icon className={`nav-icon ${active === id ? 'text-blue-500' : color} opacity-80`} />
          <span className="flex-1">{t(labelKey)}</span>
          {active === id && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
        </button>
      ))}
    </nav>
  );
}

interface Props {
  active: Page;
  onNav: (p: Page) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function Shell({ active, onNav, onLogout, children }: Props) {
  const [mob, setMob] = useState(false);
  const { t, lang, toggle } = useLang();
  const currentLabel = NAV.find(n => n.id === active)?.labelKey ?? 'nav.dashboard';

  const UserFooter = ({ onLogoutClick }: { onLogoutClick: () => void }) => (
    <div className="px-3 py-4 border-t border-gray-100 flex-shrink-0 space-y-1">
      <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">LH</div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-gray-800 truncate">Linda Hayes</p>
          <p className="text-[11px] text-gray-400">{t('nav.director')}</p>
        </div>
      </div>
      <button
        onClick={onLogoutClick}
        className="nav-item text-red-500 hover:bg-red-50 hover:text-red-600 w-full"
      >
        <LogOut className="nav-icon text-red-400" />
        <span>{t('nav.logout')}</span>
      </button>
    </div>
  );

  return (
    <div className="shell">
      {/* Sidebar – desktop */}
      <aside className="sidebar hidden lg:flex">
        <div className="px-5 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Baby className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight">{t('app.name')}</p>
            </div>
          </div>
        </div>
        <NavList active={active} onNav={onNav} />
        <UserFooter onLogoutClick={onLogout} />
      </aside>

      {/* Mobile overlay */}
      {mob && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setMob(false)} />
          <div className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col shadow-2xl slide overflow-y-auto">
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Baby className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 text-sm">DMS</span>
              </div>
              <button onClick={() => setMob(false)} className="btn-icon"><X className="w-5 h-5" /></button>
            </div>
            <NavList active={active} onNav={onNav} close={() => setMob(false)} />
            <UserFooter onLogoutClick={() => { setMob(false); onLogout(); }} />
          </div>
        </>
      )}

      {/* Main area */}
      <div className="main">
        <header className="topbar">
          <button onClick={() => setMob(true)} className="lg:hidden btn-icon">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-base">{t(currentLabel)}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggle}
              title={lang === 'en' ? 'ወደ አማርኛ ቀይር' : 'Switch to English'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Languages className="w-4 h-4" />
              {lang === 'en' ? 'አማርኛ' : 'English'}
            </button>
            <button className="btn-icon relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={onLogout}
              title={t('nav.logout')}
              className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              LH
            </button>
          </div>
        </header>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
