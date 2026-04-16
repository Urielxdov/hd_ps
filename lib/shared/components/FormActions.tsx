interface FormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
}

export default function FormActions({ onCancel, onSave, saveLabel = 'Guardar' }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600">
        Cancelar
      </button>
      <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
        {saveLabel}
      </button>
    </div>
  );
}
