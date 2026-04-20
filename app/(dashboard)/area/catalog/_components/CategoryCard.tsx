'use client';

import ServiceRow from './ServiceRow';
import type { ServiceCategory, Service } from '@/lib/catalog';

interface Props {
  category: ServiceCategory;
  services: Service[];
  loading: boolean;
  onEditCategory: () => void;
  onAddService: () => void;
  onEditService: (svc: Service) => void;
  onToggleService: (svc: Service) => void;
}

export default function CategoryCard({
  category, services, loading,
  onEditCategory, onAddService, onEditService, onToggleService,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-baseline gap-2">
          <h3 className="font-medium text-slate-800">{category.name}</h3>
          <span className="text-xs text-slate-400">
            {services.length} {services.length === 1 ? 'servicio' : 'servicios'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEditCategory}
            className="cursor-pointer text-xs text-slate-500 hover:text-slate-700"
          >
            Editar
          </button>
          <button
            onClick={onAddService}
            className="cursor-pointer text-xs px-2.5 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            + Servicio
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
        </div>
      ) : services.length === 0 ? (
        <p className="text-xs text-slate-400 px-5 py-4">Sin servicios en esta categoría</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {services.map((svc) => (
            <ServiceRow
              key={svc.id}
              service={svc}
              onEdit={() => onEditService(svc)}
              onToggle={() => onToggleService(svc)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
