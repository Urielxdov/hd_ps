import type { Estado } from '@/lib/types';
import { ESTADO_LABELS } from '@/lib/types';

const STEPS: Estado[] = ['abierto', 'en_progreso', 'resuelto', 'cerrado'];

const STEP_INDEX: Record<Estado, number> = {
  abierto: 0,
  en_progreso: 1,
  en_espera: 1,
  resuelto: 2,
  cerrado: 3,
};

export default function StatusStepper({ estado }: { estado: Estado }) {
  const currentIdx = STEP_INDEX[estado];

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const isPast = i < currentIdx;
        const isCurrent = i === currentIdx;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : isPast
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isPast ? '\u2713' : i + 1}
              </div>
              <span className={`text-xs mt-1 ${isCurrent ? 'font-semibold text-blue-600' : 'text-slate-500'}`}>
                {ESTADO_LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 mt-[-16px] ${i < currentIdx ? 'bg-green-500' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
      {estado === 'en_espera' && (
        <div className="ml-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            En espera
          </span>
        </div>
      )}
    </div>
  );
}
