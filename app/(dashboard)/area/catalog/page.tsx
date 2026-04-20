'use client';

import { useState, useEffect, useMemo } from 'react';
import Modal from '@/lib/shared/components/Modal';
import FormField, { TextInput, NumberInput, TextareaInput } from '@/lib/shared/components/FormField';
import CheckboxField from '@/lib/shared/components/CheckboxField';
import FormActions from '@/lib/shared/components/FormActions';
import { useDepartmentList } from '@/lib/department';
import {
  useCategoryCache, useServiceCache,
  getDepartmentCategories, getCategoryServices,
  createServiceCategory, updateServiceCategory,
  createService, updateService, toggleService,
  type ServiceCategory, type Service,
} from '@/lib/catalog';

export default function GestionCatalogo() {
  const { state: deptState } = useDepartmentList();
  const { state: catState, dispatch: catDispatch, loadByDept } = useCategoryCache();
  const { state: svcState, dispatch: svcDispatch, loadByCat } = useServiceCache();

  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);

  const [catModal, setCatModal] = useState<{ open: boolean; deptId: number; editing?: ServiceCategory }>({
    open: false,
    deptId: 0,
  });
  const [serviceModal, setServiceModal] = useState<{ open: boolean; catId: number; editing?: Service }>({
    open: false,
    catId: 0,
  });
  const [catName, setCatName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceHours, setServiceHours] = useState('1');
  const [serviceClientClose, setServiceClientClose] = useState(true);

  useEffect(() => {
    if (selectedDeptId === null && deptState.items.length > 0) {
      setSelectedDeptId(deptState.items[0].id);
    }
  }, [deptState.items, selectedDeptId]);

  useEffect(() => {
    if (selectedDeptId !== null) loadByDept(selectedDeptId);
  }, [selectedDeptId, loadByDept]);

  const categories = useMemo(
    () => (selectedDeptId !== null ? catState.items[selectedDeptId] || [] : []),
    [selectedDeptId, catState.items]
  );

  useEffect(() => {
    categories.forEach((cat) => loadByCat(cat.id));
  }, [categories, loadByCat]);

  const totalServices = useMemo(
    () => categories.reduce((acc, cat) => acc + (svcState.items[cat.id]?.length || 0), 0),
    [categories, svcState.items]
  );

  const selectedDept = deptState.items.find((d) => d.id === selectedDeptId);

  async function reloadCategories(deptId: number) {
    const items = await getDepartmentCategories(deptId);
    catDispatch({ type: 'LOAD_SUCCESS', payload: { deptId, items } });
  }

  async function reloadServices(catId: number) {
    const items = await getCategoryServices(catId);
    svcDispatch({ type: 'LOAD_SUCCESS', payload: { catId, items } });
  }

  async function handleToggleService(serviceId: number, catId: number) {
    await toggleService(serviceId);
    await reloadServices(catId);
  }

  function openCatModal(deptId: number, editing?: ServiceCategory) {
    setCatModal({ open: true, deptId, editing });
    setCatName(editing?.name || '');
  }

  async function handleSaveCategory() {
    if (!catName.trim()) return;
    if (catModal.editing) {
      await updateServiceCategory(catModal.editing.id, {
        name: catName.trim(),
        department: catModal.deptId,
      });
    } else {
      await createServiceCategory({
        name: catName.trim(),
        department: catModal.deptId,
      });
    }
    setCatModal({ open: false, deptId: 0 });
    setCatName('');
    await reloadCategories(catModal.deptId);
  }

  function openServiceModal(catId: number, editing?: Service) {
    setServiceModal({ open: true, catId, editing });
    setServiceName(editing?.name || '');
    setServiceDesc(editing?.description || '');
    setServiceHours(String(editing?.estimated_hours || 1));
    setServiceClientClose(editing?.client_close ?? true);
  }

  async function handleSaveService() {
    if (!serviceName.trim()) return;
    const data = {
      name: serviceName.trim(),
      description: serviceDesc.trim(),
      category: serviceModal.catId,
      estimated_hours: Number(serviceHours),
      client_close: serviceClientClose,
    };
    if (serviceModal.editing) {
      await updateService(serviceModal.editing.id, data);
    } else {
      await createService(data);
    }
    setServiceModal({ open: false, catId: 0 });
    setServiceName('');
    setServiceDesc('');
    setServiceHours('1');
    setServiceClientClose(true);
    await reloadServices(serviceModal.catId);
  }

  if (deptState.loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const catsLoading = selectedDeptId !== null && catState.loading[selectedDeptId];

  return (
    <div className="flex gap-6 h-[calc(100vh-3rem)]">
      <aside className="w-72 shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Departamentos</h2>
          <p className="text-xs text-slate-400 mt-0.5">{deptState.items.length} en total</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {deptState.items.map((d) => {
            const active = selectedDeptId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDeptId(d.id)}
                className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {d.name}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">
        {!selectedDept ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Selecciona un departamento
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{selectedDept.name}</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'} · {totalServices} {totalServices === 1 ? 'servicio' : 'servicios'}
                </p>
              </div>
              <button
                onClick={() => openCatModal(selectedDept.id)}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nueva Categoría
              </button>
            </div>

            {catsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : categories.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-200 py-12 flex flex-col items-center gap-3">
                <p className="text-sm text-slate-500">Este departamento aún no tiene categorías</p>
                <button
                  onClick={() => openCatModal(selectedDept.id)}
                  className="cursor-pointer text-sm text-blue-600 hover:underline"
                >
                  Crear la primera categoría
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((cat) => {
                  const services = svcState.items[cat.id] || [];
                  const svcLoading = svcState.loading[cat.id];
                  return (
                    <div key={cat.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
                        <div className="flex items-baseline gap-2">
                          <h3 className="font-medium text-slate-800">{cat.name}</h3>
                          <span className="text-xs text-slate-400">
                            {services.length} {services.length === 1 ? 'servicio' : 'servicios'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openCatModal(selectedDept.id, cat)}
                            className="cursor-pointer text-xs text-slate-500 hover:text-slate-700"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => openServiceModal(cat.id)}
                            className="cursor-pointer text-xs px-2.5 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            + Servicio
                          </button>
                        </div>
                      </div>

                      {svcLoading ? (
                        <div className="flex justify-center py-6">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                        </div>
                      ) : services.length === 0 ? (
                        <p className="text-xs text-slate-400 px-5 py-4">Sin servicios en esta categoría</p>
                      ) : (
                        <ul className="divide-y divide-slate-100">
                          {services.map((svc) => (
                            <li
                              key={svc.id}
                              className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/60 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    svc.active ? 'bg-green-500' : 'bg-slate-300'
                                  }`}
                                />
                                <div className="min-w-0">
                                  <p
                                    className={`text-sm font-medium truncate ${
                                      svc.active ? 'text-slate-800' : 'text-slate-400 line-through'
                                    }`}
                                  >
                                    {svc.name}
                                  </p>
                                  <p className="text-xs text-slate-400 truncate">
                                    {svc.estimated_hours}h
                                    {svc.description ? ` · ${svc.description}` : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-4">
                                <button
                                  onClick={() => openServiceModal(cat.id, svc)}
                                  className="cursor-pointer text-xs text-blue-600 hover:underline"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleToggleService(svc.id, cat.id)}
                                  className={`cursor-pointer text-xs px-2 py-0.5 rounded font-medium ${
                                    svc.active
                                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  {svc.active ? 'Activo' : 'Inactivo'}
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        open={catModal.open}
        onClose={() => setCatModal({ open: false, deptId: 0 })}
        title={catModal.editing ? 'Editar Categoria' : 'Nueva Categoria'}
      >
        <div className="space-y-4">
          <FormField label="Nombre">
            <TextInput value={catName} onChange={(e) => setCatName(e.target.value)} />
          </FormField>
          <FormActions
            onCancel={() => setCatModal({ open: false, deptId: 0 })}
            onSave={handleSaveCategory}
          />
        </div>
      </Modal>

      <Modal
        open={serviceModal.open}
        onClose={() => setServiceModal({ open: false, catId: 0 })}
        title={serviceModal.editing ? 'Editar Servicio' : 'Nuevo Servicio'}
      >
        <div className="space-y-4">
          <FormField label="Nombre">
            <TextInput value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
          </FormField>
          <FormField label="Descripcion">
            <TextareaInput value={serviceDesc} onChange={(e) => setServiceDesc(e.target.value)} rows={3} />
          </FormField>
          <FormField label="Tiempo estimado (horas)">
            <NumberInput min="1" value={serviceHours} onChange={(e) => setServiceHours(e.target.value)} />
          </FormField>
          <CheckboxField
            id="client_close"
            label="Permitir que el solicitante cierre el ticket"
            checked={serviceClientClose}
            onChange={setServiceClientClose}
          />
          <FormActions
            onCancel={() => setServiceModal({ open: false, catId: 0 })}
            onSave={handleSaveService}
          />
        </div>
      </Modal>
    </div>
  );
}
