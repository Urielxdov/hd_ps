'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/lib/auth';
import { useSidebar } from '@/lib/shared/context/SidebarContext';
import {
  ChevronLeft,
  ChevronRight,
  Ticket,
  Plus,
  ListTodo,
  LayoutGrid,
  Folder,
  Settings,
  LogOut,
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
  { href: '/area/catalog', label: 'Catalogo', icon: <Folder size={20} />, roles: ['area_admin', 'super_admin'] },
  { href: '/admin/departments', label: 'Departamentos', icon: <Settings size={20} />, roles: ['super_admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();

  if (!user) return null;

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  const roleLabels: Record<Role, string> = {
    user: 'Usuario',
    technician: 'Tecnico',
    area_admin: 'Admin de area',
    super_admin: 'Super Admin',
  };

  return (
    <>
      <aside
        className={`bg-slate-800 text-slate-300 flex flex-col fixed top-0 left-0 h-screen overflow-y-auto transition-all duration-300 z-50 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
      {/* Header */}
      <div className={`border-b border-slate-700 transition-all duration-300 ${
        collapsed ? 'p-3 flex justify-center' : 'p-4'
      }`}>
        {!collapsed && (
          <div className="w-max">
            <h2 className="text-lg font-bold text-white">Help Desk</h2>
            <p className="text-xs text-slate-400 mt-0.5">Pro Servicio</p>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className={`flex-1 space-y-1 transition-all duration-300 ${
        collapsed ? 'p-2 flex flex-col items-center' : 'p-3'
      }`}>
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors w-max ${
                collapsed ? 'p-2' : 'px-3 py-2'
              } ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-700 hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer con info de usuario */}
      <div className={`border-t border-slate-700 transition-all duration-300 ${
        collapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3'
      }`}>
        {!collapsed && (
          <div className="mb-2">
            <div className="text-sm">
              <span className="text-slate-400">ID:</span>{' '}
              <span className="text-white font-medium">{user.user_id}</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{roleLabels[user.role]}</div>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center gap-2 text-sm rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors w-max ${
            collapsed ? 'p-2' : 'w-full px-3 py-2'
          }`}
          title={collapsed ? 'Cerrar sesión' : ''}
        >
          <LogOut size={18} />
          {!collapsed && <span>Cerrar sesion</span>}
        </button>
      </div>
      </aside>

      {/* Botón flotante toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`fixed top-5 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 z-40 shadow-lg ${
          collapsed ? 'left-24' : 'left-80'
        }`}
        title={collapsed ? 'Expandir' : 'Contraer'}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </>
  );
}
