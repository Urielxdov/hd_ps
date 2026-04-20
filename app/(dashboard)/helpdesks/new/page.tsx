'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { createHelpDesk, AttachmentUploader } from '@/lib/helpdesk';
import { IMPACT_LABELS } from '@/lib/helpdesk/types';
import { useDepartmentList } from '@/lib/department';
import { useServicesByDepartment } from '@/lib/catalog';
import { classifyText, sendClassifyFeedback, type ClassifySuggestion } from '@/lib/classify';
import Modal from '@/lib/shared/components/Modal';

const selectClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400';
const lockedClass = 'w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm text-slate-700 cursor-pointer flex items-center justify-between';

export default function NuevoHelpDesk() {
  const router = useRouter();
  const { user } = useAuth();
  const { state: deptState } = useDepartmentList();

  const [description, setDescription] = useState('');
  const [classifying, setClassifying] = useState(false);
  const [hasClassified, setHasClassified] = useState(false);
  const [suggestion, setSuggestion] = useState<ClassifySuggestion | null>(null);
  const [locked, setLocked] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const [departmentId, setDepartmentId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdId, setCreatedId] = useState<number | null>(null);

  const { services, loading: loadingServices } = useServicesByDepartment(
    departmentId ? Number(departmentId) : null
  );

  const selectedService = services.find((s) => s.id === Number(serviceId)) ?? null;

  async function handleDescriptionBlur() {
    const text = description.trim();
    if (text.length < 10 || classifying) return;

    setClassifying(true);
    setSuggestion(null);
    setLocked(false);

    try {
      const { suggestions } = await classifyText(text);
      const top = suggestions.filter((s) => s.score > 0).sort((a, b) => b.score - a.score)[0] ?? null;
      setSuggestion(top);
      if (top) {
        setDepartmentId(String(top.department_id));
        setServiceId(String(top.service_id));
        setLocked(true);
      } else {
        setDepartmentId('');
        setServiceId('');
      }
    } catch {
      // classify failed silently — let user select manually
    } finally {
      setClassifying(false);
      setHasClassified(true);
    }
  }

  function handleOverrideConfirm() {
    setShowOverrideModal(false);
    setLocked(false);
    setDepartmentId('');
    setServiceId('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!serviceId) return;

    setSubmitting(true);
    setError('');

    try {
      const hd = await createHelpDesk({
        service: Number(serviceId),
        origin: 'request',
        priority: 'medium',
        problem_description: description.trim(),
        impact: selectedService?.impact ?? 'individual',
      });

      await sendClassifyFeedback({
        problem_description: description.trim(),
        suggested_service: suggestion?.service_id ?? null,
        chosen_service: Number(serviceId),
        accepted: locked,
      });

      setCreatedId(hd.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el ticket.');
    } finally {
      setSubmitting(false);
    }
  }

  if (createdId) {
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

  const descriptionReady = description.trim().length >= 10;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Nuevo Ticket</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">

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
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descripción del problema</label>
          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); setHasClassified(false); }}
            onBlur={handleDescriptionBlur}
            rows={4}
            placeholder="Describe el problema..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Clasificando spinner */}
        {classifying && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            Buscando servicio sugerido...
          </div>
        )}

        {/* Departamento */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
          {locked ? (
            <button
              type="button"
              onClick={() => setShowOverrideModal(true)}
              className={lockedClass}
            >
              <span>{suggestion!.department_name}</span>
              <span className="text-xs text-blue-500 font-medium">Cambiar</span>
            </button>
          ) : (
            <select
              value={departmentId}
              onChange={(e) => { setDepartmentId(e.target.value); setServiceId(''); }}
              disabled={!descriptionReady || classifying || deptState.loading}
              className={selectClass}
            >
              <option value="">
                {!descriptionReady
                  ? 'Escribe una descripción primero'
                  : deptState.loading
                    ? 'Cargando...'
                    : 'Selecciona un departamento'}
              </option>
              {deptState.items.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Servicio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Servicio</label>
          {locked ? (
            <button
              type="button"
              onClick={() => setShowOverrideModal(true)}
              className={lockedClass}
            >
              <span>{suggestion!.service_name}</span>
              <span className="text-xs text-blue-500 font-medium">Cambiar</span>
            </button>
          ) : (
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              disabled={!departmentId || loadingServices}
              className={selectClass}
            >
              <option value="">
                {!departmentId
                  ? 'Selecciona un departamento primero'
                  : loadingServices
                    ? 'Cargando servicios...'
                    : 'Selecciona un servicio'}
              </option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>{svc.name}</option>
              ))}
            </select>
          )}
        </div>

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
        {hasClassified && !classifying && !suggestion && !serviceId && (
          <p className="text-xs text-slate-400">
            No se encontró una sugerencia automática. Selecciona el servicio manualmente.
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="cursor-pointer px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!serviceId || !description.trim() || submitting}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creando...' : 'Crear Ticket'}
          </button>
        </div>
      </form>

      {/* Modal: confirmar cambio de sugerencia */}
      <Modal
        open={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        title="Cambiar sugerencia"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            El sistema sugirió <span className="font-medium text-slate-800">{suggestion?.service_name}</span> del
            departamento <span className="font-medium text-slate-800">{suggestion?.department_name}</span>.
          </p>
          <p className="text-sm text-slate-600">
            ¿Deseas seleccionar un servicio diferente manualmente?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowOverrideModal(false)}
              className="cursor-pointer px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
            >
              Mantener sugerencia
            </button>
            <button
              type="button"
              onClick={handleOverrideConfirm}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Seleccionar manualmente
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
