'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/lib/auth';
import { useSidebar } from '@/lib/shared/context/SidebarContext';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Ticket,
  Plus,
  ListTodo,
  LayoutGrid,
  Folder,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { href: '/helpdesks', label: 'Mis HDs', icon: <Ticket size={20} />, roles: ['user'] },
  { href: '/helpdesks/new', label: 'Nuevo HD', icon: <Plus size={20} />, roles: ['user'] },
  { href: '/queue', label: 'Mi Cola', icon: <ListTodo size={20} />, roles: ['technician'] },
  { href: '/area/helpdesks', label: 'Panel del Area', icon: <LayoutGrid size={20} />, roles: ['area_admin', 'super_admin'] },
  { href: '/area/incidents', label: 'Incidentes', icon: <Zap size={20} />, roles: ['area_admin', 'super_admin'] },
  { href: '/area/catalog', label: 'Catalogo', icon: <Folder size={20} />, roles: ['area_admin', 'super_admin'] },
  { href: '/admin/departments', label: 'Departamentos', icon: <Settings size={20} />, roles: ['super_admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col fixed top-0 left-0 h-screen overflow-y-auto transition-all duration-300 z-50 w-max`}
    >
      {/* Header */}
      <div className={`border-b border-slate-200 transition-all duration-300 ${
        collapsed ? 'p-3 flex justify-center items-center' : 'p-4 flex items-center justify-between'
      }`}>
        {!collapsed && (
          <div className="flex items-center gap-2 w-max">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-sm">
              HD
            </div>
            <span className="font-semibold text-slate-900">Help Desk</span>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-sm">
            HD
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
          title={collapsed ? 'Expandir' : 'Contraer'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Search bar */}
      <div className={`border-b border-slate-200 transition-all duration-300 ${
        collapsed ? 'p-3 flex justify-center' : 'p-3'
      }`}>
        {collapsed ? (
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
            title="Buscar"
          >
            <Search size={18} />
          </button>
        ) : (
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-9 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className={`flex-1 transition-all duration-300 ${
        collapsed ? 'p-2 flex flex-col items-center gap-1' : 'p-3 space-y-1'
      }`}>
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors w-full ${
                collapsed ? 'p-2.5 justify-center' : 'px-3 py-2'
              } ${
                active
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
              title={collapsed ? item.label : ''}
            >
              <span className={`flex-shrink-0 ${active ? 'text-slate-900' : 'text-slate-600'}`}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`border-t border-slate-200 transition-all duration-300 ${
        collapsed ? 'p-2 flex justify-center' : 'p-3'
      }`}>
        <button
          onClick={logout}
          className={`flex items-center gap-3 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50 transition-colors w-full ${
            collapsed ? 'p-2.5 justify-center' : 'px-3 py-2'
          }`}
          title={collapsed ? 'Cerrar sesión' : ''}
        >
          <LogOut size={18} className="text-slate-600" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
