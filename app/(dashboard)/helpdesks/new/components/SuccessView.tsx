import { useRouter } from 'next/navigation';
import { AttachmentUploader } from '@/lib/helpdesk';

interface SuccessViewProps {
  createdId: number;
}

export default function SuccessView({ createdId }: SuccessViewProps) {
  const router = useRouter();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Ticket creado</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <AttachmentUploader helpDeskId={createdId} attachments={[]} onUpdate={() => {}} />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => router.push(`/helpdesks/${createdId}`)}
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Ver ticket
        </button>
      </div>
    </div>
  );
}
