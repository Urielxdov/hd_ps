'use client';

import { useState, useEffect } from 'react';
import Modal from '@/lib/shared/components/Modal';
import FormField, { TextInput, NumberInput, TextareaInput } from '@/lib/shared/components/FormField';
import CheckboxField from '@/lib/shared/components/CheckboxField';
import FormActions from '@/lib/shared/components/FormActions';
import { createService, updateService, createServiceKeyword, getServiceKeywords, type Service, type ServiceImpact } from '@/lib/catalog';
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
  const [existingKeywords, setExistingKeywords] = useState<{ id: number; keyword: string; weight: number }[]>([]);
  const [keywords, setKeywords] = useState<{ keyword: string; weight: number }[]>([]);
  const [kwInput, setKwInput] = useState('');

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
      setKeywords([]);
      setKwInput('');
      setExistingKeywords([]);
      if (editing) {
        getServiceKeywords(editing.id).then(setExistingKeywords).catch(() => {});
      }
    }
  }, [open, editing]);

  function addKeyword() {
    const kw = kwInput.trim();
    if (!kw) return;
    const alreadyExists =
      keywords.some((k) => k.keyword.toLowerCase() === kw.toLowerCase()) ||
      existingKeywords.some((k) => k.keyword.toLowerCase() === kw.toLowerCase());
    if (alreadyExists) return;
    setKeywords((prev) => [...prev, { keyword: kw, weight: 5 }]);
    setKwInput('');
  }

  function removeKeyword(index: number) {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  }

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
        impact: impact as ServiceImpact,
      };
      if (editing) {
        await updateService(editing.id, data);
        await Promise.all(
          keywords.map((kw) => createServiceKeyword({ service: editing.id, ...kw }))
        );
      } else {
        const service = await createService(data);
        await Promise.all(
          keywords.map((kw) => createServiceKeyword({ service: service.id, ...kw }))
        );
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
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">
            Palabras clave <span className="text-slate-400 font-normal">(opcional)</span>
          </p>
          {(existingKeywords.length > 0 || keywords.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {existingKeywords.map((kw) => (
                <span
                  key={kw.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
                >
                  {kw.keyword}
                  <span className="text-slate-400 text-xs">({kw.weight})</span>
                </span>
              ))}
              {keywords.map((kw, i) => (
                <span
                  key={`new-${i}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800"
                >
                  {kw.keyword}
                  <span className="text-blue-400 text-xs">({kw.weight})</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(i)}
                    className="text-blue-400 hover:text-blue-700 ml-1 leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Agregar palabra clave"
              value={kwInput}
              onChange={(e) => setKwInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              className={inputClass + ' flex-1'}
            />
            <button
              type="button"
              onClick={addKeyword}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 whitespace-nowrap"
            >
              Agregar
            </button>
          </div>
        </div>
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
