import type { Status } from '../types';
import { STATUS_LABELS } from '../types';

const STEPS: Status[] = ['open', 'in_progress', 'resolved', 'closed'];

const STEP_INDEX: Record<Status, number> = {
  open: 0,
  in_progress: 1,
  on_hold: 1,
  resolved: 2,
  closed: 3,
};

export default function StatusStepper({ status }: { status: Status }) {
  const currentIdx = STEP_INDEX[status];

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
                {STATUS_LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 mt-[-16px] ${i < currentIdx ? 'bg-green-500' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
      {status === 'on_hold' && (
        <div className="ml-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            En espera
          </span>
        </div>
      )}
    </div>
  );
}
