'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDepartmentList } from '@/lib/department';
import {
  useCategoryCache, useServiceCache,
  getDepartmentCategories, getCategoryServices,
  toggleService,
  type ServiceCategory, type Service,
} from '@/lib/catalog';
import DepartmentSidebar from './_components/DepartmentSidebar';
import CategoryCard from './_components/CategoryCard';
import CategoryModal from './_components/CategoryModal';
import ServiceModal from './_components/ServiceModal';

export default function GestionCatalogo() {
  const { state: deptState } = useDepartmentList();
  const { state: catState, dispatch: catDispatch, loadByDept } = useCategoryCache();
  const { state: svcState, dispatch: svcDispatch, loadByCat } = useServiceCache();

  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);

  const [catModal, setCatModal] = useState<{ open: boolean; deptId: number; editing?: ServiceCategory }>({
    open: false, deptId: 0,
  });
  const [serviceModal, setServiceModal] = useState<{ open: boolean; catId: number; editing?: Service }>({
    open: false, catId: 0,
  });

  const effectiveDeptId = selectedDeptId ?? deptState.items[0]?.id ?? null;

  useEffect(() => {
    if (effectiveDeptId !== null) loadByDept(effectiveDeptId);
  }, [effectiveDeptId, loadByDept]);

  const categories = useMemo(
    () => (effectiveDeptId !== null ? catState.items[effectiveDeptId] || [] : []),
    [effectiveDeptId, catState.items]
  );

  useEffect(() => {
    categories.forEach((cat) => loadByCat(cat.id));
  }, [categories, loadByCat]);

  const totalServices = useMemo(
    () => categories.reduce((acc, cat) => acc + (svcState.items[cat.id]?.length || 0), 0),
    [categories, svcState.items]
  );

  const selectedDept = deptState.items.find((d) => d.id === effectiveDeptId);

  async function reloadCategories(deptId: number) {
    const items = await getDepartmentCategories(deptId);
    catDispatch({ type: 'LOAD_SUCCESS', payload: { deptId, items } });
  }

  async function reloadServices(catId: number) {
    const items = await getCategoryServices(catId);
    svcDispatch({ type: 'LOAD_SUCCESS', payload: { catId, items } });
  }

  async function handleToggleService(svc: Service) {
    const updated = await toggleService(svc.id);
    svcDispatch({ type: 'UPDATE_ITEM', payload: updated });
  }

  if (deptState.loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const catsLoading = effectiveDeptId !== null && catState.loading[effectiveDeptId];

  return (
    <div className="flex gap-6 h-[calc(100vh-3rem)]">
      <DepartmentSidebar
        departments={deptState.items}
        selectedId={effectiveDeptId}
        onSelect={setSelectedDeptId}
      />

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
                onClick={() => setCatModal({ open: true, deptId: selectedDept.id })}
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
                  onClick={() => setCatModal({ open: true, deptId: selectedDept.id })}
                  className="cursor-pointer text-sm text-blue-600 hover:underline"
                >
                  Crear la primera categoría
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    services={svcState.items[cat.id] || []}
                    loading={!!svcState.loading[cat.id]}
                    onEditCategory={() => setCatModal({ open: true, deptId: selectedDept.id, editing: cat })}
                    onAddService={() => setServiceModal({ open: true, catId: cat.id })}
                    onEditService={(svc) => setServiceModal({ open: true, catId: cat.id, editing: svc })}
                    onToggleService={handleToggleService}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <CategoryModal
        open={catModal.open}
        onClose={() => setCatModal({ open: false, deptId: 0 })}
        deptId={catModal.deptId}
        editing={catModal.editing}
        onSaved={() => reloadCategories(catModal.deptId)}
      />

      <ServiceModal
        open={serviceModal.open}
        onClose={() => setServiceModal({ open: false, catId: 0 })}
        catId={serviceModal.catId}
        editing={serviceModal.editing}
        onSaved={() => reloadServices(serviceModal.catId)}
      />
    </div>
  );
}
