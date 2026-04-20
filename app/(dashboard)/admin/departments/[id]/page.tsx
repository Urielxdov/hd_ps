'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Modal from '@/lib/shared/components/Modal';
import FormField, { TextInput, TextareaInput, NumberInput } from '@/lib/shared/components/FormField';
import FormActions from '@/lib/shared/components/FormActions';
import { useDepartmentList, updateDepartment } from '@/lib/department';
import {
  useTechnicianList,
  createTechnicianProfile, updateTechnicianProfile, deleteTechnicianProfile,
  getSLAConfigs, createSLAConfig, updateSLAConfig,
  type TechnicianProfile, type SLAConfig,
} from '@/lib/sla';

type SLAForm = {
  max_load: number;
  score_overdue: number;
  score_company: number;
  score_area: number;
  score_individual: number;
  score_critical: number;
  score_high: number;
  score_medium: number;
  score_low: number;
};

const SLA_DEFAULTS: SLAForm = {
  max_load: 3,
  score_overdue: 1000,
  score_company: 100,
  score_area: 50,
  score_individual: 10,
  score_critical: 40,
  score_high: 30,
  score_medium: 20,
  score_low: 10,
};

export default function DepartmentPanel({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const deptId = Number(id);

  const { state: deptState, load: reloadDepts } = useDepartmentList();
  const department = deptState.items.find((d) => d.id === deptId);

  const { state: techState, load: reloadTechs, setFilter } = useTechnicianList();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [savingTech, setSavingTech] = useState(false);

  const [sla, setSla] = useState<SLAConfig | null>(null);
  const [slaForm, setSlaForm] = useState<SLAForm>(SLA_DEFAULTS);
  const [slaLoading, setSlaLoading] = useState(true);
  const [savingSla, setSavingSla] = useState(false);

  useEffect(() => {
    setFilter('department', id);
  }, [id, setFilter]);

  useEffect(() => {
    setSlaLoading(true);
    getSLAConfigs({ department: id })
      .then((res) => {
        const existing = res.results[0];
        if (existing) {
          setSla(existing);
          setSlaForm({
            max_load: existing.max_load,
            score_overdue: existing.score_overdue,
            score_company: existing.score_company,
            score_area: existing.score_area,
            score_individual: existing.score_individual,
            score_critical: existing.score_critical,
            score_high: existing.score_high,
            score_medium: existing.score_medium,
            score_low: existing.score_low,
          });
        } else {
          setSla(null);
          setSlaForm(SLA_DEFAULTS);
        }
      })
      .finally(() => setSlaLoading(false));
  }, [id]);

  useEffect(() => {
    if (department) {
      setName(department.name);
      setDescription(department.description || '');
    }
  }, [department]);

  async function handleSaveInfo() {
    if (!name.trim() || !department) return;
    setSavingInfo(true);
    try {
      await updateDepartment(deptId, { name: name.trim(), description: description.trim(), active: department.active });
      await reloadDepts();
    } catch {
      alert('Error al guardar');
    } finally {
      setSavingInfo(false);
    }
  }

  async function handleToggleStatus() {
    if (!department) return;
    try {
      await updateDepartment(deptId, { ...department, active: !department.active });
      await reloadDepts();
    } catch {
      alert('Error al cambiar estado');
    }
  }

  async function handleAddTech() {
    if (!userId.trim()) return;
    setSavingTech(true);
    try {
      await createTechnicianProfile({ user_id: Number(userId), department: deptId, active: true });
      setModalOpen(false);
      setUserId('');
      await reloadTechs();
    } catch {
      alert('Error al agregar técnico');
    } finally {
      setSavingTech(false);
    }
  }

  async function handleToggleTech(tech: TechnicianProfile) {
    try {
      await updateTechnicianProfile(tech.id, { active: !tech.active });
      await reloadTechs();
    } catch {
      alert('Error al cambiar estado del técnico');
    }
  }

  async function handleDeleteTech(tech: TechnicianProfile) {
    if (!confirm(`¿Eliminar al técnico #${tech.user_id} del departamento?`)) return;
    try {
      await deleteTechnicianProfile(tech.id);
      await reloadTechs();
    } catch {
      alert('Error al eliminar técnico');
    }
  }

  function updateSlaField(key: keyof SLAForm, value: string) {
    setSlaForm((prev) => ({ ...prev, [key]: value === '' ? 0 : Number(value) }));
  }

  async function handleSaveSla() {
    setSavingSla(true);
    try {
      if (sla) {
        const updated = await updateSLAConfig(sla.id, slaForm);
        setSla(updated);
      } else {
        const created = await createSLAConfig({ department: deptId, ...slaForm });
        setSla(created);
      }
    } catch {
      alert('Error al guardar configuración SLA');
    } finally {
      setSavingSla(false);
    }
  }

  if (deptState.loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="space-y-4">
        <Link href="/admin/departments" className="text-sm text-slate-500 hover:text-slate-700">
          ← Departamentos
        </Link>
        <p className="text-slate-500">Departamento no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/departments" className="text-sm text-slate-500 hover:text-slate-700">
          ← Departamentos
        </Link>
        <span className="text-slate-300">/</span>
        <h1 className="text-2xl font-bold text-slate-900">{department.name}</h1>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          department.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {department.active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800">Información general</h2>
            <FormField label="Nombre">
              <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
            </FormField>
            <FormField label="Descripción">
              <TextareaInput value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            </FormField>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Estado</span>
              <button
                onClick={handleToggleStatus}
                className={`cursor-pointer text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  department.active
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {department.active ? 'Activo' : 'Inactivo'}
              </button>
            </div>
            <button
              onClick={handleSaveInfo}
              disabled={savingInfo || !name.trim()}
              className="cursor-pointer w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {savingInfo ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">Técnicos asignados</h2>
              <button
                onClick={() => setModalOpen(true)}
                className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Agregar Técnico
              </button>
            </div>
            {techState.loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-600 font-medium">
                    <th className="px-4 py-3">ID Usuario</th>
                    <th className="px-4 py-3">Agregado</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {techState.items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        No hay técnicos en este departamento
                      </td>
                    </tr>
                  ) : (
                    techState.items.map((tech) => (
                      <tr key={tech.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800">#{tech.user_id}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(tech.created_at).toLocaleDateString('es-MX')}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleTech(tech)}
                            className={`cursor-pointer text-xs px-2.5 py-1 rounded-full font-medium ${
                              tech.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {tech.active ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteTech(tech)}
                            className="cursor-pointer text-sm text-red-500 hover:underline"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">Configuración SLA</h2>
          {!slaLoading && !sla && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
              Sin configurar — usa valores por defecto
            </span>
          )}
        </div>

        {slaLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Límite de carga</h3>
              <div className="max-w-xs">
                <FormField label="Máx. tickets simultáneos por técnico">
                  <NumberInput
                    min="1"
                    value={slaForm.max_load}
                    onChange={(e) => updateSlaField('max_load', e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Puntaje por impacto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField label="Empresa">
                  <NumberInput
                    min="0"
                    value={slaForm.score_company}
                    onChange={(e) => updateSlaField('score_company', e.target.value)}
                  />
                </FormField>
                <FormField label="Área">
                  <NumberInput
                    min="0"
                    value={slaForm.score_area}
                    onChange={(e) => updateSlaField('score_area', e.target.value)}
                  />
                </FormField>
                <FormField label="Individual">
                  <NumberInput
                    min="0"
                    value={slaForm.score_individual}
                    onChange={(e) => updateSlaField('score_individual', e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Puntaje por prioridad</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <FormField label="Crítica">
                  <NumberInput
                    min="0"
                    value={slaForm.score_critical}
                    onChange={(e) => updateSlaField('score_critical', e.target.value)}
                  />
                </FormField>
                <FormField label="Alta">
                  <NumberInput
                    min="0"
                    value={slaForm.score_high}
                    onChange={(e) => updateSlaField('score_high', e.target.value)}
                  />
                </FormField>
                <FormField label="Media">
                  <NumberInput
                    min="0"
                    value={slaForm.score_medium}
                    onChange={(e) => updateSlaField('score_medium', e.target.value)}
                  />
                </FormField>
                <FormField label="Baja">
                  <NumberInput
                    min="0"
                    value={slaForm.score_low}
                    onChange={(e) => updateSlaField('score_low', e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Puntaje por vencimiento</h3>
              <div className="max-w-xs">
                <FormField label="Ticket vencido">
                  <NumberInput
                    min="0"
                    value={slaForm.score_overdue}
                    onChange={(e) => updateSlaField('score_overdue', e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            <button
              onClick={handleSaveSla}
              disabled={savingSla}
              className="cursor-pointer w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {savingSla ? 'Guardando...' : sla ? 'Guardar cambios' : 'Crear configuración SLA'}
            </button>
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Agregar Técnico">
        <div className="space-y-4">
          <FormField label="ID del Usuario">
            <NumberInput min="1" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </FormField>
          <FormActions
            onCancel={() => setModalOpen(false)}
            onSave={handleAddTech}
            saveLabel={savingTech ? 'Guardando...' : 'Agregar'}
            disabled={savingTech || !userId.trim()}
          />
        </div>
      </Modal>
    </div>
  );
}
