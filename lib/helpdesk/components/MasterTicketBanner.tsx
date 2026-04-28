'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { IncidentRef } from '../types';

interface Props {
  incident: IncidentRef;
}

export default function MasterTicketBanner({ incident }: Props) {
  const { activeRole } = useAuth();
  // Usa activeRole (no el rol real) para respetar el switch de rol —
  // un admin impersonando técnico debe ver la vista de técnico completa.
  const canViewIncident = activeRole === 'area_admin' || activeRole === 'super_admin';

  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
      <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800">
        Este ticket está siendo atendido como parte del incidente{' '}
        {canViewIncident ? (
          <Link
            href={`/area/incidents/${incident.id}`}
            className="font-semibold underline hover:text-amber-900"
          >
            {incident.master_folio}
          </Link>
        ) : (
          <span className="font-semibold">{incident.master_folio}</span>
        )}
        . El estado de tu ticket se actualizará automáticamente.
      </p>
    </div>
  );
}
