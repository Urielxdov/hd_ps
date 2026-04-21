import { useRef, useEffect } from 'react';

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  onClassifyNow: () => void;
  isClassifying: boolean;
  hasClassified: boolean;
  isLocked: boolean;
}

export default function DescriptionField({
  value,
  onChange,
  onClassifyNow,
  isClassifying,
  hasClassified,
  isLocked,
}: DescriptionFieldProps) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const descriptionReady = value.trim().length >= 10;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    onChange(newValue);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (newValue.trim().length >= 10) {
      debounceTimerRef.current = setTimeout(() => {
        onClassifyNow();
      }, 2000);
    }
  }

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-slate-700">Descripción del problema</label>
        {descriptionReady && !isLocked && (
          <button
            type="button"
            onClick={onClassifyNow}
            disabled={isClassifying}
            className="text-xs px-2 py-1 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClassifying ? 'Buscando...' : 'Obtener sugerencia'}
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        rows={4}
        placeholder="Describe el problema..."
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      {descriptionReady && !isClassifying && !hasClassified && (
        <p className="text-xs text-slate-400 mt-1">Se buscará una sugerencia automáticamente...</p>
      )}

      {isClassifying && (
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
          Buscando servicio sugerido...
        </div>
      )}
    </div>
  );
}
