'use client';

import { useState, useEffect } from 'react';
import FormField, { NumberInput } from '@/lib/shared/components/FormField';
import {
  getSLAConfigs, createSLAConfig, updateSLAConfig,
  type SLAConfig, type ResolutionUnit, RESOLUTION_UNIT_LABELS,
} from '@/lib/sla';

type SLAForm = {
  max_load: number;
  resolution_time: number;
  resolution_unit: ResolutionUnit;
  score_overdue: number;
  score_company: number;
  score_area: number;
  score_individual: number;
  score_critical: number;
  score_high: number;
  score_medium: number;
  score_low: number;
  incident_threshold: number;
};

const SLA_DEFAULTS: SLAForm = {
  max_load: 3,
  resolution_time: 8,
  resolution_unit: 'business_hours',
  score_overdue: 1000,
  score_company: 100,
  score_area: 50,
  score_individual: 10,
  score_critical: 40,
  score_high: 30,
  score_medium: 20,
  score_low: 10,
  incident_threshold: 0,
};

const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

interface Props {
  departmentId: number;
}

export default function SLAConfigCard({ departmentId }: Props) {
  const [sla, setSla] = useState<SLAConfig | null>(null);
  const [form, setForm] = useState<SLAForm>(SLA_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSLAConfigs({ department: String(departmentId) })
      .then((res) => {
        const existing = res.results[0];
        if (existing) {
          setSla(existing);
          setForm({
            max_load: existing.max_load,
            resolution_time: existing.resolution_time,
            resolution_unit: existing.resolution_unit,
            score_overdue: existing.score_overdue,
            score_company: existing.score_company,
            score_area: existing.score_area,
            score_individual: existing.score_individual,
            score_critical: existing.score_critical,
            score_high: existing.score_high,
            score_medium: existing.score_medium,
            score_low: existing.score_low,
            incident_threshold: existing.incident_threshold ?? 0,
          });
        } else {
          setSla(null);
          setForm(SLA_DEFAULTS);
        }
      })
      .finally(() => setLoading(false));
  }, [departmentId]);

  function updateField(key: keyof SLAForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value === '' ? 0 : Number(value) }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (sla) {
        setSla(await updateSLAConfig(sla.id, form));
      } else {
        setSla(await createSLAConfig({ department: departmentId, ...form }));
      }
    } catch {
      alert('Error al guardar configuración SLA');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Configuración SLA</h2>
        {!loading && !sla && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
            Sin configurar — usa valores por defecto
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Límite de carga</h3>
            <div className="max-w-xs">
              <FormField label="Máx. tickets simultáneos por técnico">
                <NumberInput min="1" value={form.max_load} onChange={(e) => updateField('max_load', e.target.value)} />
              </FormField>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Umbral de incidentes</h3>
            <div className="max-w-xs">
              <FormField label="Tickets abiertos para detectar incidente (0 = usar default global)">
                <NumberInput min="0" value={form.incident_threshold} onChange={(e) => updateField('incident_threshold', e.target.value)} />
              </FormField>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Tiempo de resolución</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm">
              <FormField label="Tiempo">
                <NumberInput min="1" value={form.resolution_time} onChange={(e) => updateField('resolution_time', e.target.value)} />
              </FormField>
              <FormField label="Unidad">
                <select
                  value={form.resolution_unit}
                  onChange={(e) => setForm((prev) => ({ ...prev, resolution_unit: e.target.value as ResolutionUnit }))}
                  className={inputClass}
                >
                  {(Object.keys(RESOLUTION_UNIT_LABELS) as ResolutionUnit[]).map((key) => (
                    <option key={key} value={key}>{RESOLUTION_UNIT_LABELS[key]}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Puntaje por impacto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Empresa">
                <NumberInput min="0" value={form.score_company} onChange={(e) => updateField('score_company', e.target.value)} />
              </FormField>
              <FormField label="Área">
                <NumberInput min="0" value={form.score_area} onChange={(e) => updateField('score_area', e.target.value)} />
              </FormField>
              <FormField label="Individual">
                <NumberInput min="0" value={form.score_individual} onChange={(e) => updateField('score_individual', e.target.value)} />
              </FormField>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Puntaje por prioridad</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <FormField label="Crítica">
                <NumberInput min="0" value={form.score_critical} onChange={(e) => updateField('score_critical', e.target.value)} />
              </FormField>
              <FormField label="Alta">
                <NumberInput min="0" value={form.score_high} onChange={(e) => updateField('score_high', e.target.value)} />
              </FormField>
              <FormField label="Media">
                <NumberInput min="0" value={form.score_medium} onChange={(e) => updateField('score_medium', e.target.value)} />
              </FormField>
              <FormField label="Baja">
                <NumberInput min="0" value={form.score_low} onChange={(e) => updateField('score_low', e.target.value)} />
              </FormField>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">Puntaje por vencimiento</h3>
            <div className="max-w-xs">
              <FormField label="Ticket vencido">
                <NumberInput min="0" value={form.score_overdue} onChange={(e) => updateField('score_overdue', e.target.value)} />
              </FormField>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Guardando...' : sla ? 'Guardar cambios' : 'Crear configuración SLA'}
          </button>
        </>
      )}
    </div>
  );
}
