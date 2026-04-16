interface FormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  disabled?: boolean;
}

export default function FormActions({ onCancel, onSave, saveLabel = 'Guardar', disabled }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600">
        Cancelar
      </button>
      <button
        onClick={onSave}
        disabled={disabled}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {saveLabel}
      </button>
    </div>
  );
}
