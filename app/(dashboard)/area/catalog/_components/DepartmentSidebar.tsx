'use client';

import type { Department } from '@/lib/department';

interface Props {
  departments: Department[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function DepartmentSidebar({ departments, selectedId, onSelect }: Props) {
  return (
    <aside className="w-72 shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700">Departamentos</h2>
        <p className="text-xs text-slate-400 mt-0.5">{departments.length} en total</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {departments.map((d) => {
          const active = selectedId === d.id;
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              {d.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
