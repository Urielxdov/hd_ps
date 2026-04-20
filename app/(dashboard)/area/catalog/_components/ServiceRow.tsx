'use client';

import type { Service } from '@/lib/catalog';

interface Props {
  service: Service;
  onEdit: () => void;
  onToggle: () => void;
}

export default function ServiceRow({ service, onEdit, onToggle }: Props) {
  return (
    <li className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/60 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            service.active ? 'bg-green-500' : 'bg-slate-300'
          }`}
        />
        <div className="min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              service.active ? 'text-slate-800' : 'text-slate-400 line-through'
            }`}
          >
            {service.name}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {service.estimated_hours}h
            {service.description ? ` · ${service.description}` : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <button
          onClick={onEdit}
          className="cursor-pointer text-xs text-blue-600 hover:underline"
        >
          Editar
        </button>
        <button
          onClick={onToggle}
          className={`cursor-pointer text-xs px-2 py-0.5 rounded font-medium ${
            service.active
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          {service.active ? 'Activo' : 'Inactivo'}
        </button>
      </div>
    </li>
  );
}
