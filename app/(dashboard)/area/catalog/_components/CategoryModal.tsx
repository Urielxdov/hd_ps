'use client';

import { useState, useEffect } from 'react';
import Modal from '@/lib/shared/components/Modal';
import FormField, { TextInput } from '@/lib/shared/components/FormField';
import FormActions from '@/lib/shared/components/FormActions';
import { createServiceCategory, updateServiceCategory, type ServiceCategory } from '@/lib/catalog';

interface Props {
  open: boolean;
  onClose: () => void;
  deptId: number;
  editing?: ServiceCategory;
  onSaved: () => void;
}

export default function CategoryModal({ open, onClose, deptId, editing, onSaved }: Props) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setName(editing?.name || '');
  }, [open, editing]);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await updateServiceCategory(editing.id, { name: name.trim(), department: deptId });
      } else {
        await createServiceCategory({ name: name.trim(), department: deptId });
      }
      onClose();
      onSaved();
    } catch {
      alert('Error al guardar la categoría');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Editar Categoria' : 'Nueva Categoria'}>
      <div className="space-y-4">
        <FormField label="Nombre">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
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
