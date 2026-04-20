'use client';

import { useState, useEffect } from 'react';
import Modal from '@/lib/shared/components/Modal';
import FormField, { NumberInput } from '@/lib/shared/components/FormField';
import FormActions from '@/lib/shared/components/FormActions';
import {
  useTechnicianList,
  createTechnicianProfile, updateTechnicianProfile, deleteTechnicianProfile,
  type TechnicianProfile,
} from '@/lib/sla';

interface Props {
  departmentId: number;
}

export default function TechniciansSection({ departmentId }: Props) {
  const { state, load, setFilter } = useTechnicianList();

  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFilter('department', String(departmentId));
  }, [departmentId, setFilter]);

  async function handleAdd() {
    if (!userId.trim()) return;
    setSaving(true);
    try {
      await createTechnicianProfile({
        user_id: Number(userId),
        department: departmentId,
        active: true,
      });
      setModalOpen(false);
      setUserId('');
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
      alert('Error al cambiar estado del técnico');
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
    <>
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
        {state.loading ? (
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
              {state.items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No hay técnicos en este departamento
                  </td>
                </tr>
              ) : (
                state.items.map((tech) => (
                  <tr key={tech.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">#{tech.user_id}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(tech.created_at).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(tech)}
                        className={`cursor-pointer text-xs px-2.5 py-1 rounded-full font-medium ${
                          tech.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {tech.active ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(tech)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Agregar Técnico">
        <div className="space-y-4">
          <FormField label="ID del Usuario">
            <NumberInput min="1" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </FormField>
          <FormActions
            onCancel={() => setModalOpen(false)}
            onSave={handleAdd}
            saveLabel={saving ? 'Guardando...' : 'Agregar'}
            disabled={saving || !userId.trim()}
          />
        </div>
      </Modal>
    </>
  );
}
