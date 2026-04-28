'use client';

import Link from 'next/link';
import type { Status, HelpDesk } from '../types';
import { STATUS_LABELS } from '../types';
import { getValidTransitions } from '../domain/transitions';
import { StatusBadge, PriorityBadge } from './HDBadge';

interface HDTableProps {
  helpdesks: HelpDesk[];
  /**
   * Prefijo de ruta para el link del folio. Varía según el rol:
   * usuarios van a `/helpdesks`, técnicos a `/queue`.
   */
  basePath: string;
  /** Muestra la columna de técnico asignado. */
  showTechnician?: boolean;
  /** Muestra la columna de prioridad. */
  showPriority?: boolean;
  /**
   * Si se provee, muestra un select de cambio rápido de estado en cada fila.
   * Las opciones se calculan con `getValidTransitions` — solo estados válidos.
   * El select se resetea a `""` tras la selección para evitar estado visual residual.
   */
  onQuickStatusChange?: (id: number, newStatus: Status) => void;
  /** Render prop para personalizar la celda del técnico asignado. */
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
              helpdesks.map((hd) => {
                const transitions = getValidTransitions(hd.status);
                return (
                  <tr key={hd.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`${basePath}/${hd.id}`} className="text-blue-600 hover:underline font-medium">
                        {hd.folio}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{hd.service_name}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={hd.status} />
                    </td>
                    {showPriority && (
                      <td className="px-4 py-3">
                        <PriorityBadge priority={hd.priority} />
                      </td>
                    )}
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(hd.created_at).toLocaleDateString('es-MX')}
                    </td>
                    {showTechnician && (
                      <td className="px-4 py-3 text-slate-700">
                        {technicianSelector ? technicianSelector(hd) : (hd.assignee_id ? `Tecnico #${hd.assignee_id}` : 'Sin asignar')}
                      </td>
                    )}
                    {onQuickStatusChange && (
                      <td className="px-4 py-3">
                        {transitions.length > 0 && (
                          <select
                            className="text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                onQuickStatusChange(hd.id, e.target.value as Status);
                                e.target.value = '';
                              }
                            }}
                          >
                            <option value="" disabled>Cambiar...</option>
                            {transitions.map((s) => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
