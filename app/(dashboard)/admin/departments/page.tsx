'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Department } from '@/lib/types';
import Modal from '@/components/Modal';

export default function GestionDepartamentos() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const data = await api.getDepartments();
      setDepartments(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openModal(dept?: Department) {
    setEditing(dept || null);
    setNombre(dept?.nombre || '');
    setDescripcion(dept?.descripcion || '');
    setModalOpen(true);
  }

  async function handleSave() {
    if (!nombre.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await api.updateDepartment(editing.id, { nombre: nombre.trim(), descripcion: descripcion.trim(), activo: editing.activo });
      } else {
        await api.createDepartment({ nombre: nombre.trim(), descripcion: descripcion.trim() });
      }
      setModalOpen(false);
      setNombre('');
      setDescripcion('');
      setEditing(null);
      await load();
    } catch {
      alert('Error al guardar departamento');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(dept: Department) {
    try {
      await api.updateDepartment(dept.id, { ...dept, activo: !dept.activo });
      await load();
    } catch {
      alert('Error al cambiar estado');
    }
  }

  if (loading) {
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
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nuevo Departamento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-600 font-medium">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripcion</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  No hay departamentos
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{dept.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{dept.descripcion || '-'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(dept)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        dept.activo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {dept.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openModal(dept)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Departamento' : 'Nuevo Departamento'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripcion</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-600">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !nombre.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
