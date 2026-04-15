'use client';

import Link from 'next/link';
import type { Estado } from '@/lib/types';
import { ESTADO_LABELS, VALID_TRANSITIONS } from '@/lib/types';
import { EstadoBadge, PrioridadBadge } from './HDBadge';
import { HelpDesk } from '@/lib/helpdesk/types';

interface HDTableProps {
  helpdesks: HelpDesk[];
  basePath: string;
  showTechnician?: boolean;
  showPriority?: boolean;
  onQuickStatusChange?: (id: number, newStatus: Estado) => void;
  technicianSelector?: (hd: HelpDesk) => React.ReactNode;
}

export default function HDTable({
  helpdesks,
  basePath,
  showTechnician = false,
  showPriority = false,
  onQuickStatusChange,
  technicianSelector,
}: HDTableProps) {
  console.log(helpdesks)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-600 font-medium">
              <th className="px-4 py-3">Folio</th>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Estado</th>
              {showPriority && <th className="px-4 py-3">Prioridad</th>}
              <th className="px-4 py-3">Fecha</th>
              {showTechnician && <th className="px-4 py-3">Tecnico</th>}
              {onQuickStatusChange && <th className="px-4 py-3">Accion</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {helpdesks.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                  No hay tickets para mostrar
                </td>
              </tr>
            ) : (
              helpdesks.map((hd) => (
                <tr key={hd.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`${basePath}/${hd.id}`} className="text-blue-600 hover:underline font-medium">
                      {hd.folio}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{hd.service_nombre}</td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={hd.estado} />
                  </td>
                  {showPriority && (
                    <td className="px-4 py-3">
                      <PrioridadBadge prioridad={hd.prioridad} />
                    </td>
                  )}
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(hd.created_at).toLocaleDateString('es-MX')}
                  </td>
                  {showTechnician && (
                    <td className="px-4 py-3 text-slate-700">
                      {technicianSelector ? technicianSelector(hd) : (hd.responsable_id ? `Tecnico #${hd.responsable_id}` : 'Sin asignar')}
                    </td>
                  )}
                  {onQuickStatusChange && (
                    <td className="px-4 py-3">
                      {VALID_TRANSITIONS[hd.estado].length > 0 && (
                        <select
                          className="text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              onQuickStatusChange(hd.id, e.target.value as Estado);
                              e.target.value = '';
                            }
                          }}
                        >
                          <option value="" disabled>Cambiar...</option>
                          {VALID_TRANSITIONS[hd.estado].map((s) => (
                            <option key={s} value={s}>{ESTADO_LABELS[s]}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
