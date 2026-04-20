'use client';

import { useState } from 'react';
import Link from 'next/link';
import Modal from '@/lib/shared/components/Modal';
import FormField, { TextInput, TextareaInput } from '@/lib/shared/components/FormField';
import FormActions from '@/lib/shared/components/FormActions';
import { useDepartmentList, createDepartment, type Department } from '@/lib/department';

export default function GestionDepartamentos() {
  const { state, load } = useDepartmentList();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  function openModal() {
    setName('');
    setDescription('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setName('');
    setDescription('');
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createDepartment({ name: name.trim(), description: description.trim() });
      closeModal();
      await load();
    } catch {
      alert('Error al crear departamento');
    } finally {
      setSaving(false);
    }
  }

  if (state.loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Gestion de Departamentos</h1>
        <button
          onClick={openModal}
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nuevo Departamento
        </button>
      </div>

      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-600 font-medium">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {state.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">No hay departamentos</td>
              </tr>
            ) : (
              state.items.map((dept: Department) => (
                <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{dept.name}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{dept.description || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      dept.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {dept.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/departments/${dept.id}`}
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      Administrar →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={closeModal} title="Nuevo Departamento">
        <div className="space-y-4">
          <FormField label="Nombre">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
          </FormField>
          <FormField label="Descripción">
            <TextareaInput value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </FormField>
          <FormActions
            onCancel={closeModal}
            onSave={handleSave}
            saveLabel={saving ? 'Guardando...' : 'Crear'}
            disabled={saving || !name.trim()}
          />
        </div>
      </Modal>
    </div>
  );
}
