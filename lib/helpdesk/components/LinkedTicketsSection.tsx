'use client';

import Link from 'next/link';
import { Link2 } from 'lucide-react';
import { StatusBadge } from './HDBadge';
import type { LinkedTicket } from '../types';

interface Props {
  linkedTickets: LinkedTicket[];
  linkedTicketsCount: number;
}

export default function LinkedTicketsSection({ linkedTickets, linkedTicketsCount }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Link2 size={18} className="text-slate-600" />
        <h2 className="font-semibold text-slate-900">Tickets vinculados</h2>
        <span className="ml-auto text-sm text-slate-500">{linkedTicketsCount} en total</span>
      </div>

      {linkedTickets.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">Sin tickets vinculados aún</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {linkedTickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between py-2.5">
              <Link
                href={`/area/helpdesks/${ticket.id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {ticket.folio}
              </Link>
              <StatusBadge status={ticket.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
