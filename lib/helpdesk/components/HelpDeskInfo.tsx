import type { HelpDesk } from '../types';
import { ORIGIN_LABELS } from '../types';
import { PriorityBadge } from './HDBadge';

interface HelpDeskInfoProps {
  hd: HelpDesk;
  showRequester?: boolean;
  showAssignee?: boolean;
}

export default function HelpDeskInfo({ hd, showRequester = false, showAssignee = false }: HelpDeskInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Informacion del Ticket</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-500">Servicio</span>
          <p className="font-medium text-slate-800">{hd.service_name}</p>
        </div>
        <div>
          <span className="text-slate-500">Origen</span>
          <p className="font-medium text-slate-800">{ORIGIN_LABELS[hd.origin]}</p>
        </div>
        <div>
          <span className="text-slate-500">Prioridad</span>
          <div className="mt-0.5"><PriorityBadge priority={hd.priority} /></div>
        </div>
        {showRequester && (
          <div>
            <span className="text-slate-500">Solicitante</span>
            <p className="font-medium text-slate-800">
              {hd.requester_id ? `Usuario #${hd.requester_id}` : 'Desconocido'}
            </p>
          </div>
        )}
        {showAssignee && (
          <div>
            <span className="text-slate-500">Tecnico asignado</span>
            <p className="font-medium text-slate-800">
              {hd.assignee_id ? `Tecnico #${hd.assignee_id}` : 'Sin asignar'}
            </p>
          </div>
        )}
        <div>
          <span className="text-slate-500">Creado</span>
          <p className="font-medium text-slate-800">{new Date(hd.created_at).toLocaleString('es-MX')}</p>
        </div>
        <div>
          <span className="text-slate-500">Tiempo estimado</span>
          <p className="font-medium text-slate-800">{hd.estimated_hours}h</p>
        </div>
        {hd.assigned_at && (
          <div>
            <span className="text-slate-500">Fecha asignacion</span>
            <p className="font-medium text-slate-800">{new Date(hd.assigned_at).toLocaleString('es-MX')}</p>
          </div>
        )}
        {hd.due_date && (
          <div>
            <span className="text-slate-500">Fecha compromiso</span>
            <p className="font-medium text-slate-800">{new Date(hd.due_date).toLocaleString('es-MX')}</p>
          </div>
        )}
        {hd.resolved_at && (
          <div>
            <span className="text-slate-500">Fecha resolucion</span>
            <p className="font-medium text-slate-800">{new Date(hd.resolved_at).toLocaleString('es-MX')}</p>
          </div>
        )}
      </div>

      <div>
        <span className="text-sm text-slate-500">Descripcion del problema</span>
        <p className="mt-1 text-sm text-slate-800 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg">
          {hd.problem_description}
        </p>
      </div>

      {hd.solution_description && (
        <div>
          <span className="text-sm text-slate-500">Solucion aplicada</span>
          <p className="mt-1 text-sm text-slate-800 whitespace-pre-wrap bg-green-50 p-3 rounded-lg">
            {hd.solution_description}
          </p>
        </div>
      )}
    </div>
  );
}
