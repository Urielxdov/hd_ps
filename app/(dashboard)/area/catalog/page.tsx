'use client';

import { useState } from 'react';
import Modal from '@/lib/shared/components/Modal';
import { useDepartmentList } from '@/lib/department';
import {
  useCategoryCache, useServiceCache,
  getDepartmentCategories, getCategoryServices,
  createServiceCategory, updateServiceCategory,
  createService, updateService, toggleService,
  type ServiceCategory, type Service,
} from '@/lib/catalog';

export default function GestionCatalogo() {
  const { state } = useDepartmentList();
  const { state: catState, dispatch: catDispatch, loadByDept } = useCategoryCache();
  const { state: svcState, dispatch: svcDispatch, loadByCat } = useServiceCache();

  // Expanded state
  const [expandedDept, setExpandedDept] = useState<number | null>(null);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);

  // Modals
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
  const [serviceTiempo, setServicioTiempo] = useState('1');

  async function reloadCategories(deptId: number) {
    const items = await getDepartmentCategories(deptId);
    catDispatch({ type: 'LOAD_SUCCESS', payload: { deptId, items } });
  }

  async function reloadServices(catId: number) {
    const items = await getCategoryServices(catId);
    svcDispatch({ type: 'LOAD_SUCCESS', payload: { catId, items } });
  }

  function toggleDept(deptId: number) {
    if (expandedDept === deptId) {
      setExpandedDept(null);
    } else {
      setExpandedDept(deptId);
      loadByDept(deptId);
    }
  }

  function toggleCat(catId: number) {
    if (expandedCat === catId) {
      setExpandedCat(null);
    } else {
      setExpandedCat(catId);
      loadByCat(catId);
    }
  }

  async function handleToggleService(serviceId: number, catId: number) {
    await toggleService(serviceId);
    await reloadServices(catId);
  }

  function openCatModal(deptId: number, editing?: ServiceCategory) {
    setCatModal({ open: true, deptId, editing });
    setCatName(editing?.nombre || '');
  }

  async function handleSaveCategory() {
    if (!catName.trim()) return;

    if (catModal.editing) {
      await updateServiceCategory(catModal.editing.id, {
        nombre: catName.trim(),
        department: catModal.deptId,
      });
    } else {
      await createServiceCategory({
        nombre: catName.trim(),
        department: catModal.deptId,
      });
    }

    setCatModal({ open: false, deptId: 0 });
    setCatName('');
    await reloadCategories(catModal.deptId);
  }

  function openServiceModal(catId: number, editing?: Service) {
    setServiceModal({ open: true, catId, editing });
    setServiceName(editing?.nombre || '');
    setServiceDesc(editing?.descripcion || '');
    setServicioTiempo(String(editing?.tiempo_estimado_default || 1));
  }

  async function handleSaveService() {
    if (!serviceName.trim()) return;

    const data = {
      nombre: serviceName.trim(),
      descripcion: serviceDesc.trim(),
      category: serviceModal.catId,
      tiempo_estimado_default: Number(serviceTiempo),
    };

    if (serviceModal.editing) {
      await updateService(serviceModal.editing.id, data);
    } else {
      await createService(data);
    }

    setServiceModal({ open: false, catId: 0 });
    setServiceName('');
    setServiceDesc('');
    setServicioTiempo('1');
    await reloadServices(serviceModal.catId);
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
      <h1 className="text-2xl font-bold text-slate-900">Gestion del Catalogo</h1>

      <div className="space-y-3">
        {state.items.map((dept) => (
          <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <button
              onClick={() => toggleDept(dept.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">{dept.nombre}</span>
              <span className="text-slate-400 text-lg">{expandedDept === dept.id ? '▲' : '▼'}</span>
            </button>

            {expandedDept === dept.id && (
              <div className="px-5 pb-4 border-t border-slate-100">
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-slate-600">Categorias</span>
                  <button
                    onClick={() => openCatModal(dept.id)}
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Nueva Categoria
                  </button>
                </div>

                {catState.loading[dept.id] ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                  </div>
                ) : (catState.items[dept.id] || []).length === 0 ? (
                  <p className="text-xs text-slate-400">Sin categorias</p>
                ) : (
                  <div className="space-y-2">
                    {(catState.items[dept.id] || []).map((cat) => (
                      <div key={cat.id} className="bg-slate-50 rounded-lg border border-slate-100">
                        <button
                          onClick={() => toggleCat(cat.id)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-100 transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700">{cat.nombre}</span>
                          <span className="text-slate-400 text-sm">{expandedCat === cat.id ? '▲' : '▼'}</span>
                        </button>

                        {expandedCat === cat.id && (
                          <div className="px-4 pb-3 border-t border-slate-100">
                            <div className="flex items-center justify-between py-3">
                              <span className="text-xs font-medium text-slate-500">Servicios</span>
                              <button
                                onClick={() => openServiceModal(cat.id)}
                                className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Nuevo Servicio
                              </button>
                            </div>

                            {svcState.loading[cat.id] ? (
                              <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                              </div>
                            ) : (svcState.items[cat.id] || []).length === 0 ? (
                              <p className="text-xs text-slate-400">Sin servicios</p>
                            ) : (
                              <ul className="space-y-1.5">
                                {(svcState.items[cat.id] || []).map((svc) => (
                                  <li
                                    key={svc.id}
                                    className="flex items-center justify-between text-sm p-2 bg-white border border-slate-100 rounded"
                                  >
                                    <div>
                                      <span className={svc.activo ? 'text-slate-800' : 'text-slate-400 line-through'}>
                                        {svc.nombre}
                                      </span>
                                      <span className="text-xs text-slate-400 ml-2">
                                        {svc.tiempo_estimado_default}h
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => openServiceModal(cat.id, svc)}
                                        className="text-xs text-blue-600 hover:underline"
                                      >
                                        Editar
                                      </button>
                                      <button
                                        onClick={() => handleToggleService(svc.id, cat.id)}
                                        className={`text-xs px-2 py-0.5 rounded ${
                                          svc.activo
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-500'
                                        }`}
                                      >
                                        {svc.activo ? 'Activo' : 'Inactivo'}
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={catModal.open}
        onClose={() => setCatModal({ open: false, deptId: 0 })}
        title={catModal.editing ? 'Editar Categoria' : 'Nueva Categoria'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setCatModal({ open: false, deptId: 0 })}
              className="px-4 py-2 text-sm text-slate-600"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveCategory}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={serviceModal.open}
        onClose={() => setServiceModal({ open: false, catId: 0 })}
        title={serviceModal.editing ? 'Editar Servicio' : 'Nuevo Servicio'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripcion</label>
            <textarea
              value={serviceDesc}
              onChange={(e) => setServiceDesc(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tiempo estimado (horas)</label>
            <input
              type="number"
              min="1"
              value={serviceTiempo}
              onChange={(e) => setServicioTiempo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setServiceModal({ open: false, catId: 0 })}
              className="px-4 py-2 text-sm text-slate-600"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveService}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
