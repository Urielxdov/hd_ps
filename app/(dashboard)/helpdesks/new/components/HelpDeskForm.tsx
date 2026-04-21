import type { ClassifySuggestion } from '@/lib/classify';
import { IMPACT_LABELS } from '@/lib/helpdesk/types';
import DescriptionField from './DescriptionField';
import DepartmentField from './DepartmentField';
import ServiceField from './ServiceField';
import OverrideModal from './OverrideModal';

interface Department {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  impact: string;
}

interface HelpDeskFormProps {
  user: { user_id: number } | null;
  description: string;
  onDescriptionChange: (value: string) => void;
  onClassifyNow: () => void;
  isClassifying: boolean;
  hasClassified: boolean;
  suggestion: ClassifySuggestion | null;
  isLocked: boolean;
  departmentId: string;
  onDepartmentChange: (id: string) => void;
  serviceId: string;
  onServiceChange: (id: string) => void;
  departments: Department[];
  deptLoading: boolean;
  services: Service[];
  servicesLoading: boolean;
  error: string;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  showOverrideModal: boolean;
  onShowOverrideModal: (show: boolean) => void;
  onOverrideConfirm: () => void;
}

export default function HelpDeskForm({
  user,
  description,
  onDescriptionChange,
  onClassifyNow,
  isClassifying,
  hasClassified,
  suggestion,
  isLocked,
  departmentId,
  onDepartmentChange,
  serviceId,
  onServiceChange,
  departments,
  deptLoading,
  services,
  servicesLoading,
  error,
  isSubmitting,
  onSubmit,
  showOverrideModal,
  onShowOverrideModal,
  onOverrideConfirm,
}: HelpDeskFormProps) {
  const selectedService = services.find((s) => s.id === Number(serviceId)) ?? null;
  const descriptionReady = description.trim().length >= 10;

  return (
    <>
      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        {/* Solicitante */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Solicitante</label>
          <input
            type="text"
            readOnly
            value={user ? `Usuario #${user.user_id}` : ''}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-500"
          />
        </div>

        {/* Descripción */}
        <DescriptionField
          value={description}
          onChange={onDescriptionChange}
          onClassifyNow={onClassifyNow}
          isClassifying={isClassifying}
          hasClassified={hasClassified}
          isLocked={isLocked}
        />

        {/* Departamento */}
        <DepartmentField
          value={departmentId}
          onChange={onDepartmentChange}
          isLocked={isLocked}
          onOverride={() => onShowOverrideModal(true)}
          suggestion={suggestion}
          departments={departments}
          isLoading={deptLoading}
          descriptionReady={descriptionReady}
          isClassifying={isClassifying}
        />

        {/* Servicio */}
        <ServiceField
          value={serviceId}
          onChange={onServiceChange}
          isLocked={isLocked}
          onOverride={() => onShowOverrideModal(true)}
          suggestion={suggestion}
          services={services}
          isLoading={servicesLoading}
          departmentId={departmentId}
        />

        {/* Impacto heredado del servicio */}
        {selectedService && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Impacto</label>
            <input
              type="text"
              readOnly
              value={IMPACT_LABELS[selectedService.impact as keyof typeof IMPACT_LABELS] ?? selectedService.impact}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-500"
            />
          </div>
        )}

        {/* Sin sugerencia y ya clasificó */}
        {hasClassified && !isClassifying && !suggestion && !serviceId && (
          <p className="text-xs text-slate-400">
            No se encontró una sugerencia automática. Selecciona el servicio manualmente.
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="cursor-pointer px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!serviceId || !description.trim() || isSubmitting}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creando...' : 'Crear Ticket'}
          </button>
        </div>
      </form>

      <OverrideModal
        open={showOverrideModal}
        onClose={() => onShowOverrideModal(false)}
        onConfirm={onOverrideConfirm}
        suggestion={suggestion}
      />
    </>
  );
}
