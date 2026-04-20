'use client';

import { useState, useEffect } from 'react';
import Modal from '@/lib/shared/components/Modal';
import FormField, { TextInput, NumberInput, TextareaInput } from '@/lib/shared/components/FormField';
import CheckboxField from '@/lib/shared/components/CheckboxField';
import FormActions from '@/lib/shared/components/FormActions';
import { createService, updateService, type Service } from '@/lib/catalog';
import { getChoices } from '@/lib/shared/api/choices';

interface Props {
  open: boolean;
  onClose: () => void;
  catId: number;
  editing?: Service;
  onSaved: () => void;
}

const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

const impactLabels: Record<string, string> = {
  individual: 'Individual',
  area: 'Área',
  company: 'Empresa',
};

export default function ServiceModal({ open, onClose, catId, editing, onSaved }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('1');
  const [clientClose, setClientClose] = useState(true);
  const [impact, setImpact] = useState('');
  const [impactOptions, setImpactOptions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getChoices().then((c) => {
      setImpactOptions(c.impact);
      if (!editing) setImpact(c.impact[0] ?? '');
    });
  }, []);

  useEffect(() => {
    if (open) {
      setName(editing?.name || '');
      setDescription(editing?.description || '');
      setHours(String(editing?.estimated_hours || 1));
      setClientClose(editing?.client_close ?? true);
      setImpact(editing?.impact || impactOptions[0] || '');
    }
  }, [open, editing]);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const data = {
        name: name.trim(),
        description: description.trim(),
        category: catId,
        estimated_hours: Number(hours),
        client_close: clientClose,
        impact,
      };
      if (editing) {
        await updateService(editing.id, data);
      } else {
        await createService(data);
      }
      onClose();
      onSaved();
    } catch {
      alert('Error al guardar el servicio');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Editar Servicio' : 'Nuevo Servicio'}>
      <div className="space-y-4">
        <FormField label="Nombre">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField label="Descripcion">
          <TextareaInput value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </FormField>
        <FormField label="Tiempo estimado (horas)">
          <NumberInput min="1" value={hours} onChange={(e) => setHours(e.target.value)} />
        </FormField>
        <FormField label="Impacto">
          <select
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            className={inputClass}
          >
            {impactOptions.map((opt) => (
              <option key={opt} value={opt}>
                {impactLabels[opt] ?? opt}
              </option>
            ))}
          </select>
        </FormField>
        <CheckboxField
          id="client_close"
          label="Permitir que el solicitante cierre el ticket"
          checked={clientClose}
          onChange={setClientClose}
        />
        <FormActions
          onCancel={onClose}
          onSave={handleSave}
          saveLabel={saving ? 'Guardando...' : 'Guardar'}
          disabled={saving || !name.trim()}
        />
      </div>
    </Modal>
  );
}
