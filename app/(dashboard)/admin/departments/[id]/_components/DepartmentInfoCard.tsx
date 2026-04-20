'use client';

import { useState, useEffect } from 'react';
import FormField, { TextInput, TextareaInput } from '@/lib/shared/components/FormField';
import { updateDepartment, type Department } from '@/lib/department';

interface Props {
  department: Department;
  onSaved: () => void;
}

export default function DepartmentInfoCard({ department, onSaved }: Props) {
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(department.description || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(department.name);
    setDescription(department.description || '');
  }, [department]);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateDepartment(department.id, {
        name: name.trim(),
        description: description.trim(),
        active: department.active,
      });
      onSaved();
    } catch {
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus() {
    try {
      await updateDepartment(department.id, { ...department, active: !department.active });
      onSaved();
    } catch {
      alert('Error al cambiar estado');
    }
  }

  return (
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
        onClick={handleSave}
        disabled={saving || !name.trim()}
        className="cursor-pointer w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  );
}
