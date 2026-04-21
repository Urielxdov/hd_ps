import type { ClassifySuggestion } from '@/lib/classify';

const selectClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400';
const lockedClass = 'w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm text-slate-700 cursor-pointer flex items-center justify-between';

interface Service {
  id: number;
  name: string;
}

interface ServiceFieldProps {
  value: string;
  onChange: (id: string) => void;
  isLocked: boolean;
  onOverride: () => void;
  suggestion: ClassifySuggestion | null;
  services: Service[];
  isLoading: boolean;
  departmentId: string;
}

export default function ServiceField({
  value,
  onChange,
  isLocked,
  onOverride,
  suggestion,
  services,
  isLoading,
  departmentId,
}: ServiceFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Servicio</label>
      {isLocked ? (
        <button
          type="button"
          onClick={onOverride}
          className={lockedClass}
        >
          <span>{suggestion!.service_name}</span>
          <span className="text-xs text-blue-500 font-medium">Cambiar</span>
        </button>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!departmentId || isLoading}
          className={selectClass}
        >
          <option value="">
            {!departmentId
              ? 'Selecciona un departamento primero'
              : isLoading
                ? 'Cargando servicios...'
                : 'Selecciona un servicio'}
          </option>
          {services.map((svc) => (
            <option key={svc.id} value={svc.id}>{svc.name}</option>
          ))}
        </select>
      )}
    </div>
  );
}
