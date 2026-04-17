'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/lib/auth';

interface NavItem {
  href: string;
  label: string;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { href: '/helpdesks', label: 'Mis HDs', roles: ['user'] },
  { href: '/helpdesks/new', label: 'Nuevo HD', roles: ['user'] },
  { href: '/queue', label: 'Mi Cola', roles: ['technician'] },
  { href: '/area/helpdesks', label: 'Panel del Area', roles: ['area_admin', 'super_admin'] },
  { href: '/area/catalog', label: 'Catalogo', roles: ['area_admin', 'super_admin'] },
  { href: '/admin/departments', label: 'Departamentos', roles: ['super_admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  const roleLabels: Record<Role, string> = {
    user: 'Usuario',
    technician: 'Tecnico',
    area_admin: 'Admin de area',
    super_admin: 'Super Admin',
  };

  return (
    <aside className="w-64 bg-slate-800 text-slate-300 flex flex-col fixed top-0 left-0 h-screen overflow-y-auto">
      <div className="p-5 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white">Help Desk</h2>
        <p className="text-xs text-slate-400 mt-0.5">Pro Servicio</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="text-sm">
          <span className="text-slate-400">ID:</span>{' '}
          <span className="text-white font-medium">{user.user_id}</span>
        </div>
        <div className="text-xs text-slate-400 mt-0.5">{roleLabels[user.role]}</div>
        <button
          onClick={logout}
          className="mt-3 w-full text-sm px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}
