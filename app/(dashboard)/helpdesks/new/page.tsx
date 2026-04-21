'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { createHelpDesk } from '@/lib/helpdesk';
import { useDepartmentList } from '@/lib/department';
import { useServicesByDepartment } from '@/lib/catalog';
import { classifyText, sendClassifyFeedback, type ClassifySuggestion } from '@/lib/classify';
import SuccessView from './components/SuccessView';
import HelpDeskForm from './components/HelpDeskForm';

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

  async function performClassify() {
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

  function handleDescriptionChange(value: string) {
    setDescription(value);
    setHasClassified(false);
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
      const selectedService = services.find((s) => s.id === Number(serviceId));
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
    return <SuccessView createdId={createdId} />;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Nuevo Ticket</h1>

      <HelpDeskForm
        user={user}
        description={description}
        onDescriptionChange={handleDescriptionChange}
        onClassifyNow={performClassify}
        isClassifying={classifying}
        hasClassified={hasClassified}
        suggestion={suggestion}
        isLocked={locked}
        departmentId={departmentId}
        onDepartmentChange={(id) => {
          setDepartmentId(id);
          setServiceId('');
        }}
        serviceId={serviceId}
        onServiceChange={setServiceId}
        departments={deptState.items}
        deptLoading={deptState.loading}
        services={services}
        servicesLoading={loadingServices}
        error={error}
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        showOverrideModal={showOverrideModal}
        onShowOverrideModal={setShowOverrideModal}
        onOverrideConfirm={handleOverrideConfirm}
      />
    </div>
  );
}
