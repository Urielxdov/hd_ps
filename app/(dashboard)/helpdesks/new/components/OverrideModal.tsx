import Modal from '@/lib/shared/components/Modal';
import type { ClassifySuggestion } from '@/lib/classify';

interface OverrideModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  suggestion: ClassifySuggestion | null;
}

export default function OverrideModal({
  open,
  onClose,
  onConfirm,
  suggestion,
}: OverrideModalProps) {
  if (!suggestion) return null;

  return (
    <Modal open={open} onClose={onClose} title="Cambiar sugerencia">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          El sistema sugirió <span className="font-medium text-slate-800">{suggestion.service_name}</span> del
          departamento <span className="font-medium text-slate-800">{suggestion.department_name}</span>.
        </p>
        <p className="text-sm text-slate-600">
          ¿Deseas seleccionar un servicio diferente manualmente?
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
          >
            Mantener sugerencia
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Seleccionar manualmente
          </button>
        </div>
      </div>
    </Modal>
  );
}
