'use client';

import { useState, useCallback, useEffect, use } from 'react';
import Link from 'next/link';
import Modal from '@/lib/shared/components/Modal';
import FormField, { NumberInput } from '@/lib/shared/components/FormField';
import FormActions from '@/lib/shared/components/FormActions';
import {
  getTechnicianProfiles, createTechnicianProfile,
  updateTechnicianProfile, deleteTechnicianProfile,
  type TechnicianProfile,
} from '@/lib/sla';
import { useDepartmentList } from '@/lib/department';

export default function GestionTecnicos({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const deptId = Number(id);

  const { state: deptState } = useDepartmentList();
  const department = deptState.items.find((d) => d.id === deptId);

  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTechnicianProfiles({ department: id });
      setTechnicians(data.results);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  function openModal() {
    setUserId('');
    setModalOpen(true);
  }

  async function handleSave() {
    if (!userId.trim()) return;
    setSaving(true);
    try {
      await createTechnicianProfile({ user_id: Number(userId), department: deptId, active: true });
      setModalOpen(false);
      await load();
    } catch {
      alert('Error al agregar técnico');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(tech: TechnicianProfile) {
    try {
      await updateTechnicianProfile(tech.id, { active: !tech.active });
      await load();
    } catch {
      alert('Error al cambiar estado');
    }
  }

  async function handleDelete(tech: TechnicianProfile) {
    if (!confirm(`¿Eliminar al técnico #${tech.user_id} del departamento?`)) return;
    try {
      await deleteTechnicianProfile(tech.id);
      await load();
    } catch {
      alert('Error al eliminar técnico');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/departments" className="text-sm text-slate-500 hover:text-slate-700">
          ← Departamentos
        </Link>
        <span className="text-slate-300">/</span>
        <h1 className="text-2xl font-bold text-slate-900">
          {department ? department.name : `Departamento #${id}`}
        </h1>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Técnicos asignados al departamento</p>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Agregar Técnico
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
              {technicians.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No hay técnicos en este departamento
                  </td>
                </tr>
              ) : (
                technicians.map((tech) => (
                  <tr key={tech.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">#{tech.user_id}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(tech.created_at).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(tech)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          tech.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {tech.active ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(tech)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Agregar Técnico">
        <div className="space-y-4">
          <FormField label="ID del Usuario">
            <NumberInput
              min="1"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </FormField>
          <FormActions
            onCancel={() => setModalOpen(false)}
            onSave={handleSave}
            saveLabel={saving ? 'Guardando...' : 'Agregar'}
            disabled={saving || !userId.trim()}
          />
        </div>
      </Modal>
    </div>
  );
}
