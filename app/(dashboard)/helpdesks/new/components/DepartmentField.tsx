import type { ClassifySuggestion } from '@/lib/classify';

const selectClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400';
const lockedClass = 'w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm text-slate-700 cursor-pointer flex items-center justify-between';

interface Department {
  id: number;
  name: string;
}

interface DepartmentFieldProps {
  value: string;
  onChange: (id: string) => void;
  isLocked: boolean;
  onOverride: () => void;
  suggestion: ClassifySuggestion | null;
  departments: Department[];
  isLoading: boolean;
  descriptionReady: boolean;
  isClassifying: boolean;
}

export default function DepartmentField({
  value,
  onChange,
  isLocked,
  onOverride,
  suggestion,
  departments,
  isLoading,
  descriptionReady,
  isClassifying,
}: DepartmentFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
      {isLocked ? (
        <button
          type="button"
          onClick={onOverride}
          className={lockedClass}
        >
          <span>{suggestion!.department_name}</span>
          <span className="text-xs text-blue-500 font-medium">Cambiar</span>
        </button>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!descriptionReady || isClassifying || isLoading}
          className={selectClass}
        >
          <option value="">
            {!descriptionReady
              ? 'Escribe una descripción primero'
              : isLoading
                ? 'Cargando...'
                : 'Selecciona un departamento'}
          </option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      )}
    </div>
  );
}
