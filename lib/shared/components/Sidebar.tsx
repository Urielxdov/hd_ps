'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/lib/auth';
import { useSidebar } from '@/lib/shared/context/SidebarContext';
import {
  Menu,
  X,
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
    <aside
      className={`bg-slate-800 text-slate-300 flex flex-col fixed top-0 left-0 h-screen overflow-y-auto transition-all duration-300 z-50 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header con toggle */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold text-white">Help Desk</h2>
            <p className="text-xs text-slate-400 mt-0.5">Pro Servicio</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
          title={collapsed ? 'Expandir' : 'Contraer'}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-3 space-y-1">
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
      <div className="p-3 border-t border-slate-700">
        {!collapsed && (
          <div className="mb-3">
            <div className="text-sm">
              <span className="text-slate-400">ID:</span>{' '}
              <span className="text-white font-medium">{user.user_id}</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{roleLabels[user.role]}</div>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Cerrar sesión' : ''}
        >
          <LogOut size={18} />
          {!collapsed && <span>Cerrar sesion</span>}
        </button>
      </div>
    </aside>
  );
}
